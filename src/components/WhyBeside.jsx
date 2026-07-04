import { brand, whyBeside } from '../data/content.js'

const icons = {
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17.5 14.5c2.4.4 4 2.2 4 4.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4l1.5-3.5A8 8 0 1 1 21 12Z" />
      <path d="M8.5 10.5h7M8.5 13.5h4" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15v-4M12 15V7M17 15v-6" strokeWidth="2.4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
}

export default function WhyBeside() {
  return (
    <section id="why-beside" className="relative overflow-hidden bg-white">
      {/* soft corner blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* ── Left: heading + promise ── */}
          <div className="text-center lg:sticky lg:top-32 lg:self-start lg:text-left">
            <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
              Why <span className="text-brand-700">Beside</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 lg:mx-0">
              {whyBeside.intro}
            </p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 lg:mx-0">
              {whyBeside.intro2}
            </p>

            <ul className="mx-auto mt-6 max-w-md space-y-3 text-left lg:mx-0">
              {whyBeside.checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-400/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12.5 10 18 20 6" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed font-medium text-brand-900">{item}</span>
                </li>
              ))}
            </ul>

            {/* tagline card */}
            <figure className="mx-auto mt-8 max-w-md rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 p-6 text-left shadow-xl shadow-brand-900/20 lg:mx-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-accent-400" aria-hidden="true">
                <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H7.5A2.5 2.5 0 0 1 10 7.5V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-2.5a2.5 2.5 0 0 1 2.5-2.5V7Z" />
              </svg>
              <blockquote className="mt-3 text-lg leading-snug font-semibold text-white">
                {brand.tagline}
              </blockquote>
              <figcaption className="mt-3 text-xs font-medium tracking-wide text-brand-200 uppercase">
                The {brand.fullName} promise
              </figcaption>
            </figure>
          </div>

          {/* ── Right: feature grid ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            {whyBeside.points.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-brand-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icons[p.icon]}
                  </svg>
                </span>
                <h3 className="mt-4 text-base font-semibold text-brand-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
