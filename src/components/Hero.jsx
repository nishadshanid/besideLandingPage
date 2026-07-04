import { boards, contact, hero, stats } from '../data/content.js'

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2.1 21.9l4.9-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.34-2 1.4-.5.06-1.15.09-1.86-.12a17 17 0 0 1-1.68-.62c-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.19 0 .43-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.73-.86.93-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
    </svg>
  )
}

/* The two lead tutors (transparent cutouts) rising out of a brand blob */
function TutorShowcase() {
  const [left, right] = hero.tutors
  return (
    <div className="relative mx-auto w-full max-w-md pt-10 lg:max-w-lg">
      {/* organic gradient blob behind the tutors */}
      <svg
        className="absolute bottom-2 left-1/2 h-[72%] w-[104%] -translate-x-1/2"
        viewBox="0 0 520 420"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tutor-blob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-600)" />
            <stop offset="55%" stopColor="var(--color-brand-700)" />
            <stop offset="100%" stopColor="var(--color-brand-800)" />
          </linearGradient>
        </defs>
        <path
          d="M96 51C161-9 300-14 385 32c62 34 105 96 115 163 9 62-6 132-56 172-53 42-131 44-201 38-71-6-141-21-186-70C13 287 1 216 22 156 40 105 57 87 96 51Z"
          fill="url(#tutor-blob)"
        />
        {/* subtle texture rings */}
        <circle cx="430" cy="80" r="55" stroke="white" strokeOpacity="0.14" strokeWidth="2" strokeDasharray="6 8" />
        <circle cx="70" cy="330" r="42" stroke="white" strokeOpacity="0.12" strokeWidth="2" />
      </svg>

      {/* tutors — bottom-anchored, heads overflowing the blob */}
      <div className="relative z-10 flex items-end justify-center">
        <img
          src={left.src}
          alt={left.alt}
          className="-mr-10 w-[44%] drop-shadow-[0_20px_30px_rgba(46,14,72,0.45)] sm:-mr-12"
          draggable="false"
        />
        <img
          src={right.src}
          alt={right.alt}
          className="w-[52%] drop-shadow-[0_20px_30px_rgba(46,14,72,0.45)]"
          draggable="false"
        />
      </div>

      {/* floating badge */}
      <div className="absolute top-2 -left-2 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 shadow-xl shadow-brand-900/15 backdrop-blur sm:left-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-400/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-accent-600)" aria-hidden="true">
            <path d="M12 3 1 8l11 5 9-4.09V14h2V8L12 3Z" />
            <path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5l-7 3.2-7-3.2Z" />
          </svg>
        </span>
        <div>
          <div className="text-xs font-bold text-brand-900">Classes 6–12</div>
          <div className="text-[11px] font-medium text-gray-500">All boards, one roof</div>
        </div>
      </div>

      {/* caption pill overlapping the blob's bottom edge */}
      <div className="absolute -bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-lg shadow-brand-900/15">
        <span className="h-2 w-2 rounded-full bg-accent-500" />
        <span className="text-xs font-semibold whitespace-nowrap text-brand-800">
          {hero.teachersCaption}
        </span>
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
