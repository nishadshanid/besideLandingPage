import { identify } from '../../server/auth.js'
import { fail } from '../../server/http.js'

// Guards every /api/* request: must be a listed admin, and writes must come
// from the admin page itself (same origin + custom header, which a
// cross-site form or fetch cannot send without a CORS preflight).
export async function onRequest(ctx) {
  const { request, env } = ctx
  try {
    const who = await identify(request, env)
    if (who.error) return fail(who.status, who.error)

    // content routes publish through GitHub; the enquiry log only needs the database
    const usesGitHub = !new URL(request.url).pathname.startsWith('/api/enquiries')
    if (usesGitHub && (!env.GITHUB_TOKEN || !env.GITHUB_REPO)) return fail(503, 'Publishing is not configured yet.')

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const origin = request.headers.get('Origin')
      if (origin !== new URL(request.url).origin || request.headers.get('X-Beside-Admin') !== '1') {
        return fail(403, 'Request blocked.')
      }
    }

    ctx.data.admin = who
    return await ctx.next()
  } catch (e) {
    console.error(e)
    if (e.status === 409) return fail(409, 'conflict')
    if (e.status === 503) return fail(503, e.message)
    return fail(502, 'Something went wrong on the server. Please try again.')
  }
}
