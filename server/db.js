// Enquiry log in Cloudflare D1 (bound to the Pages project as `DB`).
// Tables are created on first use, so there is no manual setup SQL.

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS enquiries (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at TEXT NOT NULL,
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     class TEXT NOT NULL DEFAULT '',
     board TEXT NOT NULL DEFAULT '',
     message TEXT NOT NULL DEFAULT '',
     page TEXT NOT NULL DEFAULT '',
     status TEXT NOT NULL DEFAULT 'new',
     note TEXT NOT NULL DEFAULT '',
     updated_at TEXT,
     updated_by TEXT
   )`,
  `CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries(created_at)`,
  `CREATE TABLE IF NOT EXISTS clicks (
     day TEXT NOT NULL,
     source TEXT NOT NULL,
     count INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (day, source)
   )`,
  `CREATE TABLE IF NOT EXISTS ratelimit (
     key TEXT NOT NULL,
     hour TEXT NOT NULL,
     count INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (key, hour)
   )`,
]

export const STATUSES = ['new', 'contacted', 'joined', 'not_interested']
export const CLICK_SOURCES = ['hero', 'floating', 'contact']

let ready = null
export function db(env) {
  if (!env.DB) {
    const e = new Error('The enquiry database is not connected yet.')
    e.status = 503
    throw e
  }
  ready ??= env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => {
    ready = null
    throw e
  })
  return ready.then(() => env.DB)
}

// Dates are grouped by India time (the centre's clock).
const IST_MS = 5.5 * 60 * 60 * 1000
export const istDay = (d = new Date()) => new Date(d.getTime() + IST_MS).toISOString().slice(0, 10)
export const istHour = (d = new Date()) => new Date(d.getTime() + IST_MS).toISOString().slice(0, 13)
// UTC ISO timestamp of IST midnight `daysAgo` days back (0 = today)
export function istDayStartUtc(daysAgo = 0) {
  const day = istDay(new Date(Date.now() - daysAgo * 86400000))
  return new Date(new Date(`${day}T00:00:00Z`).getTime() - IST_MS).toISOString()
}
export function istMonthStartUtc() {
  const month = istDay().slice(0, 7)
  return new Date(new Date(`${month}-01T00:00:00Z`).getTime() - IST_MS).toISOString()
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// true if this key is still under `limit` hits in the current hour (and counts the hit)
export async function underLimit(DB, key, limit) {
  const hour = istHour()
  const row = await DB.prepare(
    `INSERT INTO ratelimit (key, hour, count) VALUES (?1, ?2, 1)
     ON CONFLICT(key, hour) DO UPDATE SET count = count + 1
     RETURNING count`,
  )
    .bind(key, hour)
    .first()
  // tidy old windows now and then
  if (Math.random() < 0.05) await DB.prepare('DELETE FROM ratelimit WHERE hour < ?1').bind(istHour(new Date(Date.now() - 2 * 3600000))).run()
  return row.count <= limit
}
