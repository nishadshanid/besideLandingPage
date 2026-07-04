import { boards, contact, hero, stats } from '../data/content.js'

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2.1 21.9l4.9-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.34-2 1.4-.5.06-1.15.09-1.86-.12a17 17 0 0 1-1.68-.62c-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.19 0 .43-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.73-.86.93-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
    </svg>
  )
}

const featureIcons = {
  classes: (
    <>
      <path d="M12 3 1 8l11 5 9-4.09V14h2V8L12 3Z" fill="var(--color-brand-700)" stroke="none" />
      <path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 16v-5M13 16V8M18 16v-3" strokeWidth="2.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 5.5V11c0 5 3.4 8.8 8 11 4.6-2.2 8-6 8-11V5.5L12 2Z" />
      <path d="m8.5 11.5 2.5 2.5 4.5-5" />
    </>
  ),
}

/* The two lead tutors on a clean brand circle, per the front-view reference:
   heads break the circle's top edge, the circle's bottom is clipped by the
   composition edge, dotted accent pattern at the top right. */
function TutorShowcase() {
  const [left, right] = hero.tutors
  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden pt-10 lg:max-w-lg"
      style={{
        // soft fade at the bottom so the clipped edge melts into the section
        maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
      }}
    >
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

      {/* tutors — bottom-anchored on the circle, lifted for presence */}
      <div className="relative z-10 flex items-end justify-center">
        <img
          src={left.src}
          alt={left.alt}
          className="-mr-10 w-[46%] brightness-[1.04] saturate-[1.05] drop-shadow-[0_24px_36px_rgba(46,14,72,0.5)] sm:-mr-12"
          draggable="false"
        />
        <img
          src={right.src}
          alt={right.alt}
          className="w-[57%] brightness-[1.04] saturate-[1.05] drop-shadow-[0_24px_36px_rgba(46,14,72,0.5)]"
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

            <h1 className="mt-5 text-4xl leading-tight font-bold sm:text-[2.6rem] lg:text-[2.75rem]">
              <span className="text-brand-900">{hero.headline1}</span>
              <br />
              <span className="text-brand-700">{hero.headline2}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 lg:mx-0">
              {hero.subcopy}
            </p>

            {/* icon feature row */}
            <div className="mt-8 grid grid-cols-2 gap-y-6 sm:flex sm:divide-x sm:divide-brand-200">
              {hero.features.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 text-center sm:max-w-28 sm:items-start sm:px-5 sm:text-left sm:first:pl-0 sm:last:pr-0"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {featureIcons[f.icon]}
                  </svg>
                  <span className="text-xs leading-snug font-semibold text-brand-900">{f.label}</span>
                </div>
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

            {/* courses we cover */}
            <div className="mt-9">
              <div className="text-sm font-semibold text-brand-900">{hero.coursesLabel}</div>
              <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                {boards.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
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
