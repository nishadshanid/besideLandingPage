import { aboutPage, boards, brand, contact } from '../data/content.js'

function MentorCard({ person }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 via-brand-50 to-white">
        {person.photo ? (
          <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <svg width="90" height="98" viewBox="0 0 110 120" fill="none" aria-hidden="true">
              <circle cx="55" cy="38" r="24" className="fill-brand-200" />
              <path d="M10 120c0-25 20-40 45-40s45 15 45 40" className="fill-brand-200" />
            </svg>
            <span className="text-xs font-medium text-brand-400">Photo coming soon</span>
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <h3 className="text-base font-semibold text-brand-900">{person.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{person.role}</p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <main className="pt-16 lg:pt-20">
      {/* ── page hero ── */}
      <section className="relative overflow-hidden bg-brand-50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
          <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-accent-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            About Us
          </span>
          <h1 className="mt-3 text-4xl font-bold text-brand-900 sm:text-5xl">
            The Story Of <span className="text-brand-700">Beside</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600">
            {aboutPage.intro}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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
      </section>

      {/* ── our story ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
                Our Story
              </span>
              <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
                Why We Sit Beside, Not In Front
              </h2>
              <div className="mt-6 space-y-4">
                {aboutPage.story.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base leading-relaxed text-gray-600">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              {[aboutPage.mission, aboutPage.vision].map((card, i) => (
                <div
                  key={card.title}
                  className={`rounded-3xl p-8 shadow-xl ${
                    i === 0
                      ? 'bg-gradient-to-br from-brand-800 to-brand-600 text-white shadow-brand-900/20'
                      : 'border border-brand-100 bg-brand-50 text-brand-900 shadow-brand-900/5'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      i === 0 ? 'bg-white/15 text-accent-400' : 'bg-white text-brand-700'
                    }`}
                  >
                    {i === 0 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-brand-100' : 'text-gray-600'}`}>
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── mentors ── */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
              The People
            </span>
            <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
              {aboutPage.mentors.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">{aboutPage.mentors.sub}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {aboutPage.mentors.people.map((person) => (
              <MentorCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* ── visit cta ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-10 text-center shadow-2xl shadow-brand-900/25 lg:flex-row lg:p-14 lg:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Come See How We Teach
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100">
                Drop in for a chat or book a demo class — {brand.address}.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="/#register"
                className="rounded-full bg-accent-500 px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-accent-600/30 transition hover:bg-accent-600"
              >
                Register Now
              </a>
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-white/30 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
