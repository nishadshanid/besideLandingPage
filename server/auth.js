// Who is calling the admin API?
//
// In production, Cloudflare Access sits in front of /admin and /api and only
// lets listed emails through after an emailed one-time code. Access then adds
// a signed JWT header to every request; we verify it here as well, so the
// API stays locked even if the Access app is misconfigured.

const enc = new TextEncoder()

const b64urlToBytes = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}
const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)))

let certCache = { team: null, at: 0, keys: [] }

async function accessKeys(team) {
  if (certCache.team === team && Date.now() - certCache.at < 10 * 60 * 1000) return certCache.keys
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`)
  if (!res.ok) throw new Error(`Access certs ${res.status}`)
  const { keys } = await res.json()
  certCache = { team, at: Date.now(), keys }
  return keys
}

async function verifyAccessJwt(token, env) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, sig] = parts
  const header = b64urlJson(h)
  const payload = b64urlJson(p)
  if (header.alg !== 'RS256') return null

  const jwk = (await accessKeys(env.ACCESS_TEAM_DOMAIN)).find((k) => k.kid === header.kid)
  if (!jwk) return null
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(sig), enc.encode(`${h}.${p}`))
  if (!ok) return null

  const now = Math.floor(Date.now() / 1000)
  if (!payload.exp || payload.exp < now) return null
  if (payload.nbf && payload.nbf > now + 60) return null
  if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
  if (!aud.includes(env.ACCESS_AUD)) return null
  return typeof payload.email === 'string' ? payload.email.toLowerCase() : null
}

// ADMIN_EMAILS="anjali@example.com=Anjali, rahul@example.com=Rahul"
// The name (optional) is what appears in the public edit history instead of
// the email address.
export function parseAdmins(raw = '') {
  const map = new Map()
  for (const entry of raw.split(',')) {
    const [email, name] = entry.split('=').map((x) => x?.trim())
    if (email) map.set(email.toLowerCase(), name || 'admin')
  }
  return map
}

// Returns { email, name } or { error, status }.
export async function identify(request, env) {
  const url = new URL(request.url)
  const admins = parseAdmins(env.ADMIN_EMAILS)
  let email = null

  // Local development only (`wrangler pages dev` on localhost with
  // DEV_ADMIN_EMAIL in .dev.vars). Never set DEV_ADMIN_EMAIL in Cloudflare.
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  if (env.DEV_ADMIN_EMAIL && local) {
    email = env.DEV_ADMIN_EMAIL.toLowerCase()
  } else {
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
      return { status: 503, error: 'Admin login is not configured yet.' }
    }
    const token = request.headers.get('Cf-Access-Jwt-Assertion')
    if (token) email = await verifyAccessJwt(token, env).catch(() => null)
  }

  if (!email) return { status: 401, error: 'Please sign in.' }
  if (!admins.has(email)) return { status: 403, error: `${email} is not on the admin list.` }
  return { email, name: admins.get(email) }
}
