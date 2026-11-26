import { useRef, useState } from 'react'
import { imagePresets } from '../../shared/schema.js'

// Draws a form for any schema node (see shared/schema.js).

export function emptyValue(node) {
  switch (node.type) {
    case 'object': {
      const out = {}
      for (const [k, c] of Object.entries(node.fields)) {
        if (c.type === 'fixed' || c.optional) continue
        out[k] = emptyValue(c)
      }
      return out
    }
    case 'list':
      return []
    case 'number':
      return node.min ?? 0
    case 'select':
      return node.options[0]
    default:
      return ''
  }
}

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200'

function Label({ node, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-800">
      {node.label}
      {node.optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
    </label>
  )
}

function Help({ node, error }) {
  return (
    <>
      {node.help && <p className="mt-1 text-xs text-gray-500">{node.help}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </>
  )
}

const idFor = (path) => `f-${path.replace(/[^a-zA-Z0-9]/g, '-')}`

function TextField({ node, value, onChange, path, errors }) {
  const id = idFor(path)
  const len = (value ?? '').length
  const near = node.max && len > node.max * 0.85
  const props = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(node.type === 'number' ? e.target.valueAsNumber : e.target.value),
    className: `${inputCls} ${errors[path] ? 'border-red-400' : ''}`,
    'aria-invalid': !!errors[path],
  }
  return (
    <div>
      <Label node={node} htmlFor={id} />
      {node.multiline ? (
        <textarea rows={Math.min(8, Math.max(3, Math.ceil(len / 90)))} {...props} />
      ) : node.type === 'number' ? (
        <input type="number" min={node.min} max={node.max} step="100" {...props} value={Number.isFinite(value) ? value : ''} />
      ) : (
        <input type={node.type === 'url' ? 'url' : 'text'} {...props} />
      )}
      {near && (
        <p className={`mt-1 text-right text-xs ${len > node.max ? 'text-red-600' : 'text-gray-400'}`}>
          {len} / {node.max}
        </p>
      )}
      <Help node={node} error={errors[path]} />
    </div>
  )
}

function SelectField({ node, value, onChange, path, errors }) {
  const id = idFor(path)
  return (
    <div>
      <Label node={node} htmlFor={id} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {node.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Help node={node} error={errors[path]} />
    </div>
  )
}

function ImageField({ node, value, onChange, path, errors, ctx }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const preset = imagePresets[node.preset]
  const preview = value ? ctx.previewFor(value) : null

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr('')
    setBusy(true)
    try {
      onChange(await ctx.uploadImage(file, preset))
    } catch (x) {
      setErr(x.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <Label node={node} />
      <div className="flex items-start gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
          {preview ? (
            <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
            </button>
            {node.optional && value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">{preset?.hint}</p>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} />
          <Help node={node} error={err || errors[path]} />
        </div>
      </div>
    </div>
  )
}

function itemTitle(node, item, i) {
  const key = node.itemLabel
  const raw = typeof item === 'string' ? item : key ? item?.[key] : ''
  const label = String(raw || '').trim()
  return label ? label.slice(0, 70) : `${node.item.label} ${i + 1}`
}

function ListField({ node, value = [], onChange, path, errors, ctx }) {
  const isObject = node.item.type === 'object'
  const [open, setOpen] = useState(() => new Set())
  const toggle = (i) => setOpen((s) => new Set(s.has(i) ? [...s].filter((x) => x !== i) : [...s, i]))

  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(new Set())
  }
  const remove = (i) => {
    if (!confirm(`Remove "${itemTitle(node, value[i], i)}"?`)) return
    onChange(value.filter((_, j) => j !== i))
    setOpen(new Set())
  }
  const add = () => {
    onChange([...value, emptyValue(node.item)])
    setOpen((s) => new Set([...s, value.length]))
  }
  const hasErrorIn = (i) => Object.keys(errors).some((p) => p.startsWith(`${path}[${i}]`))

  const btn = 'rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30'

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{node.label}</h4>
        <span className="text-xs text-gray-400">
          {value.length} item{value.length === 1 ? '' : 's'}
        </span>
      </div>
      {errors[path] && <p className="mb-2 text-xs font-medium text-red-600">{errors[path]}</p>}
      <ol className="space-y-2">
        {value.map((item, i) => {
          const p = `${path}[${i}]`
          const expanded = !isObject || open.has(i)
          return (
            <li key={i} className={`rounded-lg border bg-white ${hasErrorIn(i) ? 'border-red-300' : 'border-gray-200'}`}>
              <div className="flex items-center gap-1 px-2 py-1.5">
                {isObject ? (
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={expanded}
                    className="flex min-w-0 grow items-center gap-2 rounded-md px-1 py-1 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    <span className={`text-gray-400 transition ${expanded ? 'rotate-90' : ''}`}>▸</span>
                    <span className="truncate">{itemTitle(node, item, i)}</span>
                    {hasErrorIn(i) && <span className="text-xs text-red-600">needs fixing</span>}
                  </button>
                ) : (
                  <div className="grow">
                    <Field node={{ ...node.item, label: '' }} value={item} onChange={(v) => set(i, v)} path={p} errors={errors} ctx={ctx} bare />
                  </div>
                )}
                <button type="button" className={btn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className={btn} onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">↓</button>
                <button type="button" className={`${btn} hover:text-red-600`} onClick={() => remove(i)} disabled={value.length <= (node.min ?? 0)} aria-label="Remove">✕</button>
              </div>
              {isObject && expanded && (
                <div className="border-t border-gray-100 p-4">
                  <Field node={node.item} value={item} onChange={(v) => set(i, v)} path={p} errors={errors} ctx={ctx} bare />
                </div>
              )}
            </li>
          )
        })}
      </ol>
      {value.length < (node.max ?? 50) && (
        <button
          type="button"
          onClick={add}
          className="mt-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-brand-700 hover:border-brand-600 hover:bg-brand-50"
        >
          + Add {node.item.label.toLowerCase()}
        </button>
      )}
    </div>
  )
}

function ObjectField({ node, value = {}, onChange, path, errors, ctx, bare }) {
  const children = Object.entries(node.fields).filter(([, c]) => c.type !== 'fixed')
  const body = (
    <div className="space-y-5">
      {children.map(([k, c]) => (
        <Field
          key={k}
          node={c}
          value={value[k]}
          path={path ? `${path}.${k}` : k}
          errors={errors}
          ctx={ctx}
          onChange={(v) => {
            const next = { ...value, [k]: v }
            if (c.optional && (v === '' || v == null)) delete next[k]
            onChange(next)
          }}
        />
      ))}
    </div>
  )
  if (bare) return body
  return (
    <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-gray-900">{node.label}</legend>
      {body}
    </fieldset>
  )
}

export function Field(props) {
  const { node } = props
  switch (node.type) {
    case 'object':
      return <ObjectField {...props} />
    case 'list':
      return <ListField {...props} />
    case 'image':
      return <ImageField {...props} />
    case 'select':
      return <SelectField {...props} />
    case 'fixed':
      return null
    default:
      return props.bare && !node.label ? (
        <TextField {...props} node={{ ...node, label: '' }} />
      ) : (
        <TextField {...props} />
      )
  }
}
