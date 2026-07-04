import { boards, contact, hero, stats } from '../data/content.js'

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2.1 21.9l4.9-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.34-2 1.4-.5.06-1.15.09-1.86-.12a17 17 0 0 1-1.68-.62c-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.19 0 .43-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.73-.86.93-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
    </svg>
  )
}

/* The two lead tutors on a clean brand circle, per the front-view reference:
   heads break the circle's top edge, the circle's bottom is clipped by the
   composition edge, dotted accent pattern at the top right. */
function TutorShowcase() {
  const [left, right] = hero.tutors
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden pt-10 lg:max-w-lg">
      {/* dotted accent pattern */}
      <svg className="absolute top-4 right-0 h-24 w-36 text-brand-200" aria-hidden="true">
        <defs>
          <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* big brand circle — top edge near the heads, bottom clipped */}
      <div
        aria-hidden="true"
        className="absolute top-[13%] left-1/2 aspect-square w-[102%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_28%_18%,var(--color-brand-600),var(--color-brand-700)_55%,var(--color-brand-800))]"
      />

      {/* tutors — bottom-anchored on the circle */}
      <div className="relative z-10 flex items-end justify-center">
        <img
          src={left.src}
          alt={left.alt}
          className="-mr-9 w-[43%] drop-shadow-[0_20px_30px_rgba(46,14,72,0.45)] sm:-mr-11"
          draggable="false"
        />
        <img
          src={right.src}
          alt={right.alt}
          className="w-[54%] drop-shadow-[0_20px_30px_rgba(46,14,72,0.45)]"
          draggable="false"
        />
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-brand-50">
      {/* soft decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-accent-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 sm:px-6 lg:px-8 lg:pt-20 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Left: copy ── */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-400/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-600 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
              {hero.badge}
            </span>

            <h1 className="mt-5 text-4xl leading-tight font-bold text-brand-900 sm:text-5xl lg:text-[3.4rem]">
              {hero.headlinePre}
              <br />
              <span className="relative inline-block text-brand-700">
                {hero.headlineAccent}
                {/* hand-drawn accent underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3 9c50-7 130-7 194-3" stroke="var(--color-accent-400)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              {hero.headlinePost}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 lg:mx-0">
              {hero.subcopy}
            </p>

            {/* board chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {boards.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#register"
                className="w-full rounded-full bg-brand-700 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition hover:bg-brand-800 sm:w-auto"
              >
                Register Now
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi Beside Learning! I would like to know more about your tuition programs.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-200 bg-white px-8 py-3.5 text-sm font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50 sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* ── Right: lead tutors showcase ── */}
          <TutorShowcase />
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:mt-20 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-6 text-center backdrop-blur transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/10"
            >
              <div className="text-3xl font-bold text-brand-700 lg:text-4xl">{s.value}</div>
              <div className="mt-1.5 text-xs font-medium text-gray-600 lg:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
