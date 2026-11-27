import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { schema, sections, validate, imagePaths } from '../../shared/schema.js'
import { api, ApiError, waitForLive } from './api.js'
import { prepareImage, blobToBase64, newUploadPath } from './images.js'
import { Field } from './Fields.jsx'
import Enquiries from './Enquiries.jsx'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const LOGOUT = '/cdn-cgi/access/logout'
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const topKey = (path) => path.split(/[.[]/)[0]
const sectionOf = (key) => sections.find((s) => s.keys.includes(key))

// "faqs[2].q" -> "FAQ › Question 3 › Question"
function describePath(path) {
  const parts = path.match(/[^.[\]]+|\[\d+\]/g) || [path]
  const labels = []
  let node = schema
  for (const part of parts) {
    if (!node) break
    if (part.startsWith('[')) {
      const i = Number(part.slice(1, -1))
      node = node.item
      labels.push(`${node?.label ?? 'Item'} ${i + 1}`)
    } else {
      node = node.fields?.[part]
      labels.push(node?.label ?? part)
    }
  }
  return labels.filter(Boolean).join(' › ')
}

function timeAgo(iso) {
  const s = Math.round((Date.now() - new Date(iso)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function Screen({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <img src={`${BASE}/logo.png`} alt="" className="mx-auto mb-4 h-12" />
        <h1 className="mb-2 text-lg font-semibold text-gray-900">{title}</h1>
        <div className="space-y-3 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  )
}

function StatusBar({ status, onDismiss }) {
  if (!status) return null
  const tone = {
    busy: 'bg-brand-50 text-brand-800 border-brand-200',
    ok: 'bg-green-50 text-green-800 border-green-200',
    warn: 'bg-amber-50 text-amber-900 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  }[status.tone]
  return (
    <div role="status" className={`mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${tone}`}>
      {status.tone === 'busy' && (
        <span className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <div className="grow">{status.text}</div>
      {status.action}
      {status.tone !== 'busy' && (
        <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  )
}

function History({ busy, onRestore }) {
  const [list, setList] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    api.history().then((r) => setList(r.commits), (e) => setErr(e.message))
  }, [])
  if (err) return <p className="text-sm text-red-600">{err}</p>
  if (!list) return <p className="text-sm text-gray-500">Loading history…</p>
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <p className="border-b border-gray-100 px-5 py-3 text-sm text-gray-600">
        Every publish is saved. Restoring an older version publishes it again as a new change, so nothing is lost.
      </p>
      <ol className="divide-y divide-gray-100">
        {list.map((c, i) => (
          <li key={c.sha} className="flex items-center gap-4 px-5 py-3">
            <div className="min-w-0 grow">
              <p className="truncate text-sm font-medium text-gray-900">{c.message.replace(/^Content: /, '')}</p>
              <p className="text-xs text-gray-500">{timeAgo(c.date)}</p>
            </div>
            {i === 0 ? (
              <span className="text-xs font-medium text-green-700">Current</span>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => onRestore(c)}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Restore
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function App() {
  const [me, setMe] = useState(null)
  const [fatal, setFatal] = useState(null) // ApiError that blocks the whole page
  const [saved, setSaved] = useState(null) // content as last loaded/published
  const [draft, setDraft] = useState(null)
  const [sha, setSha] = useState(null)
  const [errors, setErrors] = useState({})
  const [view, setView] = useState('enquiries') // 'enquiries', a section id, or 'history'
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [historyKey, setHistoryKey] = useState(0)
  // images uploaded this session: path -> { blob, url }
  const uploads = useRef(new Map())
  const [, bump] = useState(0)
  const mainRef = useRef(null)

  const load = useCallback(async () => {
    const r = await api.load()
    setSaved(r.content)
    setDraft(r.content)
    setSha(r.sha)
    setErrors({})
  }, [])

  useEffect(() => {
    Promise.all([api.me(), load()])
      .then(([who]) => setMe(who))
      .catch((e) => setFatal(e instanceof ApiError ? e : new ApiError(0, e.message)))
  }, [load])

  const dirty = draft && saved && !same(draft, saved)
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const changedIds = useMemo(() => {
    if (!draft || !saved) return new Set()
    return new Set(sections.filter((s) => s.keys.some((k) => !same(draft[k], saved[k]))).map((s) => s.id))
  }, [draft, saved])

  const ctx = useMemo(
    () => ({
      previewFor: (p) => uploads.current.get(p)?.url ?? `${BASE}${p}`,
      uploadImage: async (file, preset) => {
        const img = await prepareImage(file, preset)
        const { blob } = await api.upload(await blobToBase64(img.blob), img.type)
        const path = newUploadPath(img.type)
        uploads.current.set(path, { blob, url: URL.createObjectURL(img.blob), pending: true })
        bump((n) => n + 1)
        return path
      },
    }),
    [],
  )

  const handleError = (e, fallback) => {
    if (e.status === 401 || e.status === 403) return setFatal(e)
    if (e.status === 409) {
      return setStatus({
        tone: 'warn',
        text: 'Someone else published changes while you were editing. Reload to get their version, then make your changes again.',
        action: (
          <button type="button" onClick={() => location.reload()} className="font-semibold underline">
            Reload
          </button>
        ),
      })
    }
    if (e.data?.errors?.length) {
      setErrors(Object.fromEntries(e.data.errors.map((x) => [x.path, x.message])))
    }
    setStatus({ tone: 'error', text: e.message || fallback })
  }

  const followDeploy = async (commit, what) => {
    setStatus({ tone: 'busy', text: `${what} Updating the website (usually about a minute)…` })
    const live = await waitForLive(commit, {
      onTick: (s) =>
        setStatus({ tone: 'busy', text: `${what} Updating the website… ${s}s (usually about a minute)` }),
    })
    if (live === null) setStatus({ tone: 'ok', text: `${what} (Local test: no real website update.)` })
    else if (live)
      setStatus({
        tone: 'ok',
        text: (
          <>
            {what} The website is updated.{' '}
            <a href={`${BASE}/`} target="_blank" rel="noreferrer" className="font-semibold underline">
              View site
            </a>
          </>
        ),
      })
    else
      setStatus({
        tone: 'warn',
        text: `${what} The website is taking longer than usual to update. It should appear within a few minutes.`,
      })
  }

  const publish = async () => {
    const problems = validate(draft)
    if (problems.length) {
      setErrors(Object.fromEntries(problems.map((x) => [x.path, x.message])))
      const sec = sectionOf(topKey(problems[0].path))
      if (sec) setView(sec.id)
      setStatus({
        tone: 'error',
        text: `Please fix ${problems.length === 1 ? 'this field' : `these ${problems.length} fields`} first: ${problems
          .slice(0, 3)
          .map((p) => `${describePath(p.path)} ${p.message}`)
          .join('; ')}${problems.length > 3 ? '…' : ''}`,
      })
      return
    }
    setErrors({})
    setBusy(true)
    setStatus({ tone: 'busy', text: 'Publishing…' })
    try {
      const used = imagePaths(draft)
      const pending = [...uploads.current]
        .filter(([p, u]) => u.pending && used.has(p))
        .map(([path, u]) => ({ path, blob: u.blob }))
      const r = await api.save(draft, sha, pending)
      if (r.unchanged) {
        setStatus({ tone: 'ok', text: 'Nothing changed, so there was nothing to publish.' })
        return
      }
      for (const { path } of pending) uploads.current.get(path).pending = false
      setSaved(draft)
      setSha(r.sha)
      setHistoryKey((k) => k + 1)
      setBusy(false)
      await followDeploy(r.commit, 'Published.')
    } catch (e) {
      handleError(e, 'Could not publish.')
    } finally {
      setBusy(false)
    }
  }

  const discard = () => {
    if (!confirm('Throw away all changes you have not published?')) return
    setDraft(saved)
    setErrors({})
    setStatus(null)
  }

  const restore = async (c) => {
    const msg = dirty
      ? `Restore the version from ${timeAgo(c.date)}? Your unpublished changes will be lost.`
      : `Restore the version from ${timeAgo(c.date)}? It will be published right away.`
    if (!confirm(msg)) return
    setBusy(true)
    setStatus({ tone: 'busy', text: 'Restoring…' })
    try {
      const r = await api.revert(c.sha)
      await load()
      setHistoryKey((k) => k + 1)
      setBusy(false)
      if (r.unchanged) setStatus({ tone: 'ok', text: 'That version is already what the website shows.' })
      else await followDeploy(r.commit, 'Restored.')
    } catch (e) {
      handleError(e, 'Could not restore.')
    } finally {
      setBusy(false)
    }
  }

  const go = (id) => {
    setView(id)
    mainRef.current?.scrollIntoView({ block: 'start' })
  }

  // ── blocking screens ──────────────────────────────────────
  if (fatal) {
    const title =
      fatal.status === 403 ? 'No access' : fatal.status === 401 ? 'Please sign in' : fatal.status === 503 ? 'Not set up yet' : 'Something went wrong'
    return (
      <Screen title={title}>
        <p>{fatal.message}</p>
        {fatal.status === 403 && <p>Ask the site owner to add your email to the admin list.</p>}
        <div className="flex justify-center gap-3 pt-2">
          <button type="button" onClick={() => location.reload()} className="rounded-lg bg-brand-700 px-4 py-2 font-medium text-white hover:bg-brand-800">
            Try again
          </button>
          <a href={LOGOUT} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Sign out
          </a>
        </div>
      </Screen>
    )
  }
  if (!me || !draft) {
    return (
      <Screen title="Loading…">
        <p>Getting the latest content.</p>
      </Screen>
    )
  }

  const current = sections.find((s) => s.id === view)
  const errorCount = Object.keys(errors).length
  const navBtn = (active) =>
    `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
      active ? 'bg-brand-700 font-medium text-white' : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <img src={`${BASE}/logo.png`} alt="" className="h-8" />
          <div className="min-w-0 grow">
            <p className="text-sm font-semibold text-gray-900">Website admin</p>
            <p className="truncate text-xs text-gray-500">Signed in as {me.name}</p>
          </div>
          {dirty && (
            <button
              type="button"
              onClick={discard}
              disabled={busy}
              className="hidden rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:block"
            >
              Discard changes
            </button>
          )}
          {(view !== 'enquiries' || dirty) && (
            <button
              type="button"
              onClick={publish}
              disabled={busy || !dirty}
              className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {busy ? 'Working…' : dirty ? 'Publish' : 'Published'}
            </button>
          )}
          <a href={LOGOUT} className="hidden text-sm text-gray-500 hover:text-gray-800 sm:block">
            Sign out
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <nav className="hidden w-52 shrink-0 md:block" aria-label="Sections">
          <ul className="sticky top-20 space-y-1">
            <li className="pb-3">
              <button type="button" onClick={() => go('enquiries')} className={navBtn(view === 'enquiries')}>
                Enquiries
              </button>
            </li>
            <li className="px-3 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Website content</li>
            {sections.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => go(s.id)} className={navBtn(view === s.id)}>
                  {s.title}
                  {changedIds.has(s.id) && <span className="h-2 w-2 rounded-full bg-accent-500" title="Unpublished changes" />}
                </button>
              </li>
            ))}
            <li className="pt-3">
              <button type="button" onClick={() => go('history')} className={navBtn(view === 'history')}>
                History
              </button>
            </li>
          </ul>
        </nav>

        <main ref={mainRef} className="min-w-0 grow scroll-mt-20">
          <div className="mb-4 md:hidden">
            <label htmlFor="section-pick" className="sr-only">
              Section
            </label>
            <select
              id="section-pick"
              value={view}
              onChange={(e) => go(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="enquiries">Enquiries</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                  {changedIds.has(s.id) ? ' •' : ''}
                </option>
              ))}
              <option value="history">History</option>
            </select>
            <div className="mt-2 flex justify-between text-sm">
              {dirty ? (
                <button type="button" onClick={discard} disabled={busy} className="text-gray-600 underline disabled:opacity-50">
                  Discard changes
                </button>
              ) : (
                <span />
              )}
              <a href={LOGOUT} className="text-gray-500 underline">
                Sign out
              </a>
            </div>
          </div>

          <StatusBar status={status} onDismiss={() => setStatus(null)} />
          {errorCount > 0 && current && !current?.keys.some((k) => Object.keys(errors).some((p) => topKey(p) === k)) && (
            <p className="mb-4 text-sm text-red-600">
              Fields in other sections need fixing:{' '}
              {[...new Set(Object.keys(errors).map((p) => sectionOf(topKey(p))?.title).filter(Boolean))].join(', ')}
            </p>
          )}

          {view === 'enquiries' ? (
            <>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Enquiries</h2>
              <Enquiries />
            </>
          ) : view === 'history' ? (
            <>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">History</h2>
              <History key={historyKey} busy={busy} onRestore={restore} />
            </>
          ) : (
            <>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">{current.title}</h2>
              <div className="space-y-6">
                {current.keys.map((k) => (
                  <Field
                    key={k}
                    node={schema.fields[k]}
                    value={draft[k]}
                    path={k}
                    errors={errors}
                    ctx={ctx}
                    onChange={(v) => {
                      setDraft((d) => ({ ...d, [k]: v }))
                      // drop old error marks for this part once it's edited
                      setErrors((es) => {
                        const left = Object.entries(es).filter(([p]) => topKey(p) !== k)
                        return left.length === Object.keys(es).length ? es : Object.fromEntries(left)
                      })
                    }}
                  />
                ))}
              </div>
              <p className="mt-8 text-xs text-gray-400">
                Changes stay on this page until you press Publish. The website updates about a minute after publishing.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
