const MAX_OUT = 3 * 1024 * 1024

const toBlob = (canvas, type, quality) => new Promise((r) => canvas.toBlob(r, type, quality))

// Resize/compress in the browser so uploads stay small and fast.
export async function prepareImage(file, preset) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.')
  if (file.size > 30 * 1024 * 1024) throw new Error('That file is too big (max 30 MB).')

  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, preset.maxW / bmp.width, preset.maxH / bmp.height)
  const w = Math.max(1, Math.round(bmp.width * scale))
  const h = Math.max(1, Math.round(bmp.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!preset.alpha) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
  }
  ctx.drawImage(bmp, 0, 0, w, h)
  bmp.close?.()

  for (const quality of [0.85, 0.72, 0.6]) {
    let blob = await toBlob(canvas, 'image/webp', quality)
    let type = 'webp'
    if (!blob || blob.type !== 'image/webp') {
      // older Safari can't encode WebP
      type = preset.alpha ? 'png' : 'jpg'
      blob = await toBlob(canvas, preset.alpha ? 'image/png' : 'image/jpeg', quality)
    }
    if (blob && blob.size <= MAX_OUT) return { blob, type, width: w, height: h }
  }
  throw new Error('Could not make this image small enough. Try a smaller picture.')
}

export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = () => reject(new Error('Could not read the image.'))
    r.readAsDataURL(blob)
  })

export function newUploadPath(type) {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => b.toString(16).padStart(2, '0')).join('')
  return `/uploads/${d}-${rand}.${type}`
}
