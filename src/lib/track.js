// Records enquiries and WhatsApp-button clicks (Cloudflare Functions in
// functions/lead/). Fire-and-forget: failures never affect the visitor.

// Only the root-domain site has the /lead endpoints (not the GitHub Pages copy).
const enabled = import.meta.env.BASE_URL === '/'

export function trackClick(source) {
  if (!enabled) return
  try {
    if (!navigator.sendBeacon?.('/lead/click', source)) {
      fetch('/lead/click', { method: 'POST', body: source, keepalive: true }).catch(() => {})
    }
  } catch {}
}

export function logEnquiry(data) {
  if (!enabled) return
  try {
    fetch('/lead/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, page: location.pathname }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
