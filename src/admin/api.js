export class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message)
    this.status = status
    this.data = data
  }
}

const EXPIRED = 'Your login has expired. Reload the page to sign in again.'

async function request(method, path, body, { raw = false } = {}) {
  const headers = {}
  if (method !== 'GET') headers['X-Beside-Admin'] = '1'
  if (body !== undefined) headers['Content-Type'] = raw ? 'text/plain' : 'application/json'
  let res
  try {
    res = await fetch(`/api/${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    })
  } catch {
    // Cloudflare Access answers an expired session with a cross-site redirect
    throw new ApiError(401, EXPIRED)
  }
  if (!(res.headers.get('content-type') || '').includes('application/json')) {
    throw new ApiError(res.status === 200 ? 401 : res.status, res.status >= 500 ? 'Server error. Please try again.' : EXPIRED)
  }
  const data = await res.json()
  if (!res.ok) throw new ApiError(res.status, data.error || 'Something went wrong.', data)
  return data
}

export const api = {
  me: () => request('GET', 'me'),
  load: () => request('GET', 'content'),
  save: (content, sha, uploads) => request('PUT', 'content', { content, sha, uploads }),
  upload: (base64, type) => request('POST', `upload?type=${type}`, base64, { raw: true }),
  history: () => request('GET', 'history'),
  revert: (commit) => request('POST', 'revert', { commit }),
}

// Resolves when the public site is serving `commit` (Cloudflare finished building).
export async function waitForLive(commit, { onTick, timeoutMs = 6 * 60 * 1000 } = {}) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
      const v = await res.json()
      if (v.commit === commit) return true
      if (v.commit === 'dev') return null // local development: no real deploys
    } catch {}
    onTick?.(Math.round((Date.now() - start) / 1000))
    await new Promise((r) => setTimeout(r, 5000))
  }
  return false
}
