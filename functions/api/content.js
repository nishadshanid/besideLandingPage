import { github, CONTENT_PATH } from '../../server/github.js'
import { fail, json } from '../../server/http.js'
import { imagePaths, sections, validate } from '../../shared/schema.js'

export const UPLOAD_PATH = /^\/uploads\/[a-z0-9-]{6,80}\.(jpg|png|webp)$/
const SHA = /^[0-9a-f]{40}$/

// GET /api/content -> { content, sha }  (sha = version the admin is editing)
export async function onRequestGet({ env }) {
  const gh = github(env)
  const head = await gh.head()
  const file = await gh.readFile(CONTENT_PATH, head)
  return json({ content: JSON.parse(file.text), sha: file.sha, commit: head })
}

// Names of the admin sections whose data differs between two versions.
export function changedSections(before, after) {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  const changed = [...keys].filter((k) => JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k]))
  return sections.filter((s) => s.keys.some((k) => changed.includes(k))).map((s) => s.title)
}

// PUT /api/content  { content, sha, uploads: [{ path, blob }] }
export async function onRequestPut({ request, env, data }) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return fail(400, 'Invalid request.')
  const { content, sha, uploads = [] } = body
  if (typeof sha !== 'string' || !SHA.test(sha)) return fail(400, 'Missing version.')
  if (!Array.isArray(uploads) || uploads.length > 20) return fail(400, 'Too many images in one save.')

  const errors = validate(content)
  if (errors.length) return fail(422, 'Some fields need fixing.', { errors })

  const used = imagePaths(content)
  for (const u of uploads) {
    if (!u || !UPLOAD_PATH.test(u.path) || !SHA.test(u.blob)) return fail(400, 'Invalid image upload.')
  }
  // only keep uploads that are still used (e.g. not replaced before saving)
  const keep = uploads.filter((u) => used.has(u.path))

  const gh = github(env)
  const head = await gh.head()
  const current = await gh.readFile(CONTENT_PATH, head)
  if (current.sha !== sha) return fail(409, 'conflict')

  // every image the content points at must exist after this commit
  const existing = await gh.listPaths(head)
  const missing = [...used].filter(
    (p) => !existing.has(`public${p}`) && !keep.some((u) => u.path === p),
  )
  if (missing.length) {
    return fail(422, 'Some images are missing. Please upload them again.', {
      errors: missing.map((p) => ({ path: p, message: 'image not found' })),
    })
  }

  const before = JSON.parse(current.text)
  const what = changedSections(before, content)
  if (!what.length && !keep.length) return json({ sha, commit: head, unchanged: true })

  const message = `Content: update ${what.join(', ') || 'images'} (by ${data.admin.name})`
  const result = await gh.commit({
    parent: head,
    message,
    files: [
      { path: CONTENT_PATH, text: JSON.stringify(content, null, 2) + '\n' },
      ...keep.map((u) => ({ path: `public${u.path}`, blob: u.blob })),
    ],
  })
  return json({ sha: result.blobFor(CONTENT_PATH), commit: result.commit, message })
}
