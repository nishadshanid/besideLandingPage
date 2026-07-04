import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav } from '../data/content.js'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-md shadow-brand-900/10' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="Beside Learning — Home">
          <img src="/logo-purple.png" alt="Beside" className="h-6 w-auto lg:h-8" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-brand-700 ${
                item.href === pathname ? 'text-brand-700' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/#register"
          className="hidden rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition hover:bg-brand-800 lg:inline-block"
        >
          Register Now
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-100 text-brand-700 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-brand-50 bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/#register"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-brand-700 px-6 py-3 text-center text-sm font-semibold text-white"
          >
            Register Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
