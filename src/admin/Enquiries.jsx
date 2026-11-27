import { useEffect, useMemo, useState } from 'react'
import { api } from './api.js'

const STATUS = {
  new: { label: 'New', cls: 'bg-amber-100 text-amber-900 border-amber-200' },
  contacted: { label: 'Contacted', cls: 'bg-blue-100 text-blue-900 border-blue-200' },
  joined: { label: 'Joined', cls: 'bg-green-100 text-green-900 border-green-200' },
  not_interested: { label: 'Not interested', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
}
const SOURCES = { hero: 'Top of page', floating: 'Floating button', contact: 'Contact box' }

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

// WhatsApp needs the country code; assume India for 10-digit numbers
function waNumber(phone) {
  const d = phone.replace(/\D/g, '')
  return d.length === 10 ? `91${d}` : d.replace(/^0+/, '')
}

function downloadCsv(items) {
  // keep spreadsheet apps from treating text as formulas
  const safe = (v) => {
    let s = String(v ?? '')
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
    return `"${s.replace(/"/g, '""')}"`
  }
  const head = ['Date', 'Name', 'Phone', 'Class', 'Board', 'Message', 'Status', 'Note', 'Updated by']
  const rows = items.map((e) => [fmt(e.created_at), e.name, e.phone, e.class, e.board, e.message, STATUS[e.status]?.label, e.note, e.updated_by])
  const csv = '﻿' + [head, ...rows].map((r) => r.map(safe).join(',')).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = `beside-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function Stat({ label, value, tone = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  )
}

function Row({ e, onChange, onDelete }) {
  const [note, setNote] = useState(e.note)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  useEffect(() => setNote(e.note), [e.note])

  const save = async (patch) => {
    setSaving(true)
    setErr('')
    try {
      onChange({ ...e, ...(await api.updateEnquiry(e.id, patch)) })
    } catch (x) {
      setErr(x.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 grow">
          <p className="font-semibold text-gray-900">{e.name}</p>
          <p className="text-xs text-gray-500">{fmt(e.created_at)}</p>
        </div>
        <select
          value={e.status}
          disabled={saving}
          onChange={(ev) => save({ status: ev.target.value })}
          aria-label={`Status for ${e.name}`}
          className={`rounded-lg border px-2 py-1.5 text-sm font-medium ${STATUS[e.status]?.cls}`}
        >
          {Object.entries(STATUS).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-gray-900">{e.phone}</span>
        <a href={`tel:${e.phone.replace(/[^\d+]/g, '')}`} className="rounded-lg border border-gray-300 px-2.5 py-1 text-gray-700 hover:bg-gray-50">
          Call
        </a>
        <a
          href={`https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(`Hi ${e.name}, this is Beside Learning replying to your enquiry.`)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-green-300 px-2.5 py-1 text-green-800 hover:bg-green-50"
        >
          WhatsApp
        </a>
        {(e.class || e.board) && <span className="text-gray-600">{[e.class, e.board].filter(Boolean).join(' · ')}</span>}
      </div>

      {e.message && <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm whitespace-pre-wrap text-gray-700">{e.message}</p>}

      <div className="mt-3">
        <label htmlFor={`note-${e.id}`} className="sr-only">
          Note
        </label>
        <textarea
          id={`note-${e.id}`}
          rows={1}
          maxLength={1000}
          value={note}
          placeholder="Add a note (e.g. called on Monday, demo on Friday)…"
          onChange={(ev) => setNote(ev.target.value)}
          onBlur={() => note !== e.note && save({ note })}
          className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>
          {saving ? 'Saving…' : err ? <span className="text-red-600">{err}</span> : e.updated_by ? `Updated by ${e.updated_by}, ${fmt(e.updated_at)}` : ''}
        </span>
        <button type="button" onClick={() => onDelete(e)} className="hover:text-red-600">
          Delete
        </button>
      </div>
    </li>
  )
}

export default function Enquiries() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState('new')
  const [q, setQ] = useState('')

  const load = () => {
    setErr('')
    api.enquiries().then(setData, (e) => setErr(e.message))
  }
  useEffect(load, [])

  const items = data?.items ?? []
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    const digits = term.replace(/\D/g, '')
    return items.filter(
      (e) =>
        (filter === 'all' || e.status === filter) &&
        (!term || e.name.toLowerCase().includes(term) || (digits && e.phone.replace(/\D/g, '').includes(digits))),
    )
  }, [items, filter, q])

  const counts = useMemo(() => {
    const c = { all: items.length }
    for (const k of Object.keys(STATUS)) c[k] = items.filter((e) => e.status === k).length
    return c
  }, [items])

  const replace = (row) => setData((d) => ({ ...d, items: d.items.map((x) => (x.id === row.id ? row : x)) }))
  const remove = async (e) => {
    if (!confirm(`Delete the enquiry from ${e.name} (${e.phone})? This cannot be undone.`)) return
    try {
      await api.deleteEnquiry(e.id)
      setData((d) => ({ ...d, items: d.items.filter((x) => x.id !== e.id) }))
    } catch (x) {
      alert(x.message)
    }
  }

  if (err) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        {err}{' '}
        <button type="button" onClick={load} className="font-semibold underline">
          Try again
        </button>
      </div>
    )
  }
  if (!data) return <p className="text-sm text-gray-500">Loading enquiries…</p>

  const s = data.stats
  const clicks7 = Object.values(s.clicks).reduce((n, c) => n + c.d7, 0)
  const clicks30 = Object.values(s.clicks).reduce((n, c) => n + c.d30, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Waiting for a call back" value={s.status.new} tone={s.status.new ? 'text-amber-700' : 'text-gray-900'} />
        <Stat label="This month" value={s.month} />
        <Stat label="Joined" value={s.status.joined} tone="text-green-700" />
        <Stat label="All time" value={s.total} />
      </div>

      <details className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-gray-800">
          WhatsApp buttons: {clicks7} click{clicks7 === 1 ? '' : 's'} in the last 7 days · {s.d7} form enquir{s.d7 === 1 ? 'y' : 'ies'}
        </summary>
        <p className="mt-2 text-gray-600">
          Clicks on the “Chat on WhatsApp” buttons open WhatsApp without a form, so only the number of clicks is known. Compare
          them with the chats you received.
        </p>
        <table className="mt-3 w-full text-left">
          <thead className="text-xs text-gray-500">
            <tr>
              <th className="py-1 font-medium">Button</th>
              <th className="py-1 text-right font-medium">7 days</th>
              <th className="py-1 text-right font-medium">30 days</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(SOURCES).map(([k, label]) => (
              <tr key={k} className="border-t border-gray-100">
                <td className="py-1.5">{label}</td>
                <td className="py-1.5 text-right">{s.clicks[k]?.d7 ?? 0}</td>
                <td className="py-1.5 text-right">{s.clicks[k]?.d30 ?? 0}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-200 font-medium">
              <td className="py-1.5">All buttons</td>
              <td className="py-1.5 text-right">{clicks7}</td>
              <td className="py-1.5 text-right">{clicks30}</td>
            </tr>
            <tr className="border-t border-gray-100 text-gray-600">
              <td className="py-1.5">Register form enquiries</td>
              <td className="py-1.5 text-right">{s.d7}</td>
              <td className="py-1.5 text-right">{s.d30}</td>
            </tr>
          </tbody>
        </table>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        {[['new', 'New'], ['contacted', 'Contacted'], ['joined', 'Joined'], ['not_interested', 'Not interested'], ['all', 'All']].map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={`rounded-full border px-3 py-1 text-sm ${filter === k ? 'border-brand-700 bg-brand-700 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {label} <span className="opacity-70">{counts[k]}</span>
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={load} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            Refresh
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(items)}
            disabled={!items.length}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="enq-search" className="sr-only">
          Search
        </label>
        <input
          id="enq-search"
          type="search"
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Search by name or phone…"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {shown.length ? (
        <ol className="space-y-3">
          {shown.map((e) => (
            <Row key={e.id} e={e} onChange={replace} onDelete={remove} />
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          {items.length ? 'No enquiries match.' : 'No enquiries yet. They appear here when someone sends the Register form.'}
        </p>
      )}
    </div>
  )
}
