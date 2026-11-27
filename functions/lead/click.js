import { CLICK_SOURCES, db, istDay, sha256, underLimit } from '../../server/db.js'

// POST /lead/click  body: "hero" | "floating" | "contact"
// Counts WhatsApp-button clicks per day. No personal data is stored.
export async function onRequestPost({ request, env }) {
  try {
    const source = (await request.text()).trim()
    if (CLICK_SOURCES.includes(source)) {
      const DB = await db(env)
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
      const key = (await sha256(`${env.SHEET_SECRET || 'beside'}|${ip}`)).slice(0, 32)
      // one visitor can't inflate the numbers
      if (!(await underLimit(DB, `clk:${key}`, 20))) return new Response(null, { status: 204 })
      await DB.prepare(
        `INSERT INTO clicks (day, source, count) VALUES (?1, ?2, 1)
         ON CONFLICT(day, source) DO UPDATE SET count = count + 1`,
      )
        .bind(istDay(), source)
        .run()
    }
  } catch (e) {
    console.error('click', e)
  }
  return new Response(null, { status: 204 })
}
