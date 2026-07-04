import { testimonials } from '../data/content.js'

function initials(name) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-brand-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Success Stories
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            What Families Say About Beside
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            The real report card — from the students we sit beside and the parents who trust us.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10"
            >
              {/* quote mark */}
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" className="text-accent-400" aria-hidden="true">
                <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H7.5A2.5 2.5 0 0 1 10 7.5V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-2.5a2.5 2.5 0 0 1 2.5-2.5V7Z" />
              </svg>

              <blockquote className="mt-4 grow text-sm leading-relaxed text-gray-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-50 pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <div className="text-sm font-semibold text-brand-900">{t.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{t.meta}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
