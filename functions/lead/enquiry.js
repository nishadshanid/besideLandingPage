import { db, sha256, underLimit } from '../../server/db.js'

// POST /lead/enquiry — called by the Register form right after it opens
// WhatsApp. Public (no login), so everything is validated and rate limited.
// Always answers 204 so a problem here never bothers the visitor.

const done = () => new Response(null, { status: 204 })
const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '')
const cleanMultiline = (v, max) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max) : ''

export async function onRequestPost({ request, env, waitUntil }) {
  try {
    const origin = request.headers.get('Origin')
    if (origin && origin !== new URL(request.url).origin) return done()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') return done()

    // bots: filled the hidden field, or submitted faster than a person can type
    if (body.website) return done()
    if (typeof body.elapsedMs === 'number' && body.elapsedMs < 2500) return done()

    const name = clean(body.name, 80)
    const phone = clean(body.phone, 20)
    const digits = phone.replace(/\D/g, '')
    if (name.length < 2 || !/^[0-9+\-\s]{7,20}$/.test(phone) || digits.length < 7 || digits.length > 15) return done()
    const klass = /^Class (6|7|8|9|10|11|12)$/.test(body.klass ?? '') ? body.klass : ''
    const board = clean(body.board, 30)
    const message = cleanMultiline(body.message, 500)
    const page = clean(body.page, 100)

    const DB = await db(env)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const key = (await sha256(`${env.SHEET_SECRET || 'beside'}|${ip}`)).slice(0, 32)
    if (!(await underLimit(DB, `enq:${key}`, 5))) return done()

    // same number again within 30 minutes (double click, resubmit): keep the first
    const recent = await DB.prepare('SELECT 1 FROM enquiries WHERE phone = ?1 AND created_at > ?2 LIMIT 1')
      .bind(phone, new Date(Date.now() - 30 * 60000).toISOString())
      .first()
    if (recent) return done()

    const createdAt = new Date().toISOString()
    await DB.prepare(
      `INSERT INTO enquiries (created_at, name, phone, class, board, message, page)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
    )
      .bind(createdAt, name, phone, klass, board, message, page)
      .run()

    if (env.SHEET_WEBHOOK_URL && env.SHEET_SECRET) {
      const date = new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      waitUntil(
        fetch(env.SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: env.SHEET_SECRET, date, name, phone, klass, board, message }),
        }).catch((e) => console.error('sheet', e)),
      )
    }
  } catch (e) {
    console.error('enquiry', e)
  }
  return done()
}
