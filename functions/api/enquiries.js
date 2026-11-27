import { CLICK_SOURCES, STATUSES, db, istDay, istDayStartUtc, istMonthStartUtc } from '../../server/db.js'
import { fail, json } from '../../server/http.js'

// Admin-only (guarded by ./_middleware.js).

// GET /api/enquiries -> { items, stats }
export async function onRequestGet({ env }) {
  const DB = await db(env)
  const since7 = istDayStartUtc(6)
  const since30 = istDayStartUtc(29)
  const day7 = istDay(new Date(Date.now() - 6 * 86400000))
  const day30 = istDay(new Date(Date.now() - 29 * 86400000))

  const [items, byStatus, periods, clicks] = await DB.batch([
    DB.prepare(
      `SELECT id, created_at, name, phone, class, board, message, page, status, note, updated_at, updated_by
       FROM enquiries ORDER BY created_at DESC LIMIT 2000`,
    ),
    DB.prepare('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status'),
    DB.prepare(
      `SELECT COUNT(*) AS total,
              SUM(created_at >= ?1) AS month,
              SUM(created_at >= ?2) AS d7,
              SUM(created_at >= ?3) AS d30
       FROM enquiries`,
    ).bind(istMonthStartUtc(), since7, since30),
    DB.prepare(
      `SELECT source, SUM(CASE WHEN day >= ?1 THEN count ELSE 0 END) AS d7, SUM(count) AS d30
       FROM clicks WHERE day >= ?2 GROUP BY source`,
    ).bind(day7, day30),
  ])

  const status = Object.fromEntries(STATUSES.map((s) => [s, 0]))
  for (const r of byStatus.results) status[r.status] = r.n
  const p = periods.results[0] ?? {}
  const click = Object.fromEntries(CLICK_SOURCES.map((s) => [s, { d7: 0, d30: 0 }]))
  for (const r of clicks.results) click[r.source] = { d7: r.d7 ?? 0, d30: r.d30 ?? 0 }

  return json({
    items: items.results,
    stats: { total: p.total ?? 0, month: p.month ?? 0, d7: p.d7 ?? 0, d30: p.d30 ?? 0, status, clicks: click },
  })
}

// PATCH /api/enquiries { id, status?, note? }
export async function onRequestPatch({ request, env, data }) {
  const body = await request.json().catch(() => null)
  const id = Number(body?.id)
  if (!Number.isInteger(id) || id < 1) return fail(400, 'Invalid enquiry.')
  if (body.status !== undefined && !STATUSES.includes(body.status)) return fail(400, 'Invalid status.')
  if (body.note !== undefined && (typeof body.note !== 'string' || body.note.length > 1000)) {
    return fail(400, 'Note is too long (max 1000 characters).')
  }
  const DB = await db(env)
  const row = await DB.prepare(
    `UPDATE enquiries
     SET status = COALESCE(?2, status), note = COALESCE(?3, note), updated_at = ?4, updated_by = ?5
     WHERE id = ?1
     RETURNING id, status, note, updated_at, updated_by`,
  )
    .bind(id, body.status ?? null, body.note ?? null, new Date().toISOString(), data.admin.name)
    .first()
  if (!row) return fail(404, 'That enquiry no longer exists.')
  return json(row)
}

// DELETE /api/enquiries?id=123
export async function onRequestDelete({ request, env }) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id < 1) return fail(400, 'Invalid enquiry.')
  const DB = await db(env)
  await DB.prepare('DELETE FROM enquiries WHERE id = ?1').bind(id).run()
  return json({ deleted: id })
}
