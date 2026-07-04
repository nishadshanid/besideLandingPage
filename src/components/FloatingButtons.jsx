import { brand, contact } from '../data/content.js'

export default function FloatingButtons() {
  return (
    <>
      {/* call — bottom left */}
      <a
        href={`tel:${contact.phone.replace(/\s/g, '')}`}
        aria-label={`Call ${brand.fullName}`}
        className="fixed bottom-5 left-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-accent-500 text-white shadow-xl shadow-accent-600/40 transition hover:scale-110 hover:bg-accent-600"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
        </svg>
      </a>

      {/* whatsapp — bottom right */}
      <a
        href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.fullName}! I'd like to know more about your tuition programs.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${brand.fullName} on WhatsApp`}
        className="fixed right-5 bottom-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-110 hover:bg-[#1fb857]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2.1 21.9l4.9-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.34-2 1.4-.5.06-1.15.09-1.86-.12a17 17 0 0 1-1.68-.62c-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.19 0 .43-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.73-.86.93-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
        </svg>
      </a>
    </>
  )
}
