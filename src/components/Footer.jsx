import { Link } from 'react-router-dom'
import { brand, contact, courses, nav } from '../data/content.js'

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* brand */}
          <div>
            <img src="/logo-white.png" alt={brand.fullName} className="h-8 w-auto" />
            <p className="mt-4 text-sm font-medium text-accent-400">{brand.tagline}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
              A tuition centre in Palarivattom, Kochi for classes 6 to 12 — teaching CBSE, ICSE,
              IGCSE, IB, NIOS, A-Level and O-Level, each the way its board demands.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href={contact.instagram} label="Beside Learning on Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </SocialLink>
              <SocialLink href={contact.youtube} label="Beside Learning on YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
                  <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-brand-200 transition hover:text-accent-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* courses */}
          <nav aria-label="Footer courses">
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase">Courses</h3>
            <ul className="mt-5 space-y-3">
              {courses.map((c) => (
                <li key={c.title}>
                  <Link to="/#courses" className="text-sm text-brand-200 transition hover:text-accent-400">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-brand-200">
              <li className="flex items-start gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent-400" aria-hidden="true">
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>{brand.address}</span>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 transition hover:text-accent-400">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-400" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-accent-400">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-400" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-500"
                >
                  Open in Google Maps
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-brand-300 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {brand.fullName}®. All rights reserved.
          </p>
          <p>{brand.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
