import { courses, coursesIntro } from '../data/content.js'

export default function Courses() {
  return (
    <section id="courses" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Our Programs
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            Explore Our Courses
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">{coursesIntro}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10"
            >
              {/* banner */}
              <div className="relative flex h-28 items-center justify-between overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600 px-6">
                <span className="text-3xl font-bold tracking-tight text-white">{c.abbr}</span>
                {/* decorative ring */}
                <svg
                  className="absolute -top-10 -right-10 h-32 w-32 text-white/10 transition-transform duration-500 group-hover:scale-125"
                  viewBox="0 0 100 100"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" />
                </svg>
                <svg
                  className="h-9 w-9 text-accent-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 1 8l11 5 9-4.09V14h2V8L12 3Z" fill="currentColor" stroke="none" />
                  <path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" />
                </svg>
              </div>

              {/* body */}
              <div className="flex grow flex-col p-6">
                <h3 className="text-lg font-semibold text-brand-900">{c.title}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {c.levels.map((l) => (
                    <span
                      key={l}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                    >
                      {l}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">{c.subjects}</p>
                <p className="mt-3 grow text-sm leading-relaxed font-medium text-brand-700">
                  {c.highlight}
                </p>

                <a
                  href="#course-structure"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition group-hover:gap-2.5 hover:text-accent-500"
                >
                  View course structure
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
