import { github } from '../../server/github.js'
import { fail, json } from '../../server/http.js'

const MAX_BASE64 = Math.ceil((3 * 1024 * 1024 * 4) / 3) // 3 MB image
const MAGIC = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  webp: (b) =>
    String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP',
}

// POST /api/upload?type=jpg|png|webp   body: the image as base64 text
// Stores the image in the repo's object store and returns its id; the image
// is only added to the site when the content is published.
export async function onRequestPost({ request, env }) {
  const type = new URL(request.url).searchParams.get('type')
  if (!MAGIC[type]) return fail(400, 'Only JPG, PNG or WebP images.')

  const b64 = (await request.text()).trim()
  if (!b64) return fail(400, 'Empty image.')
  if (b64.length > MAX_BASE64) return fail(413, 'Image is too large (max 3 MB).')
  // cheap checks only: base64 alphabet on the head, real image signature
  let headBytes
  try {
    headBytes = Uint8Array.from(atob(b64.slice(0, 16)), (c) => c.charCodeAt(0))
  } catch {
    return fail(400, 'Invalid image data.')
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64.slice(-64)) || !MAGIC[type](headBytes)) {
    return fail(400, 'That file is not a valid image.')
  }

  const blob = await github(env).createBlobFromBase64(b64)
  return json({ blob })
}
