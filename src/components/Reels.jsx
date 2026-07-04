import { useEffect, useRef } from 'react'
import { reels } from '../data/content.js'

// "https://www.instagram.com/reel/ABC123/?igsh=x" -> "https://www.instagram.com/reel/ABC123/embed/"
function embedUrl(url) {
  const path = new URL(url).pathname.replace(/\/?$/, '/')
  return `https://www.instagram.com${path}embed/`
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const DRIFT_PX_PER_FRAME = 0.6 // ~36px/s marquee speed

export default function Reels() {
  const rowRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimer = useRef(null)

  // render the unique reels twice — the marquee wraps at the halfway point,
  // so the row scrolls forward forever without a visible rewind
  const vids = [...new Set(reels.videos)]
  const loopVids = [...vids, ...vids]

  useEffect(() => {
    const row = rowRef.current
    if (!row || vids.length === 0) return

    const setWidth = () => {
      const cards = row.children
      const half = cards[vids.length]?.offsetLeft - cards[0]?.offsetLeft
      return half > 0 ? half : 0
    }

    let raf
    const step = () => {
      const half = setWidth()
      if (half) {
        if (!pausedRef.current) row.scrollLeft += DRIFT_PX_PER_FRAME
        // seamless wrap in both directions (also covers manual swipes)
        if (row.scrollLeft >= half) row.scrollLeft -= half
        else if (row.scrollLeft < 0) row.scrollLeft += half
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [vids.length])

  const pause = () => {
    clearTimeout(resumeTimer.current)
    pausedRef.current = true
  }
  const resume = () => {
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => (pausedRef.current = false), 600)
  }

  const scrollByCards = (dir) => {
    const row = rowRef.current
    if (!row) return
    pause()
    const card = row.firstElementChild
    const step = (card ? card.clientWidth + 16 : 250) * 2
    row.scrollBy({ left: dir * step, behavior: 'smooth' })
    resumeTimer.current = setTimeout(() => (pausedRef.current = false), 900)
  }

  return (
    <section id="reels" className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Beside In Action
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">Watch Us Teach</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Classroom moments, concept shorts and student wins — straight from our Instagram.
          </p>
        </div>

        {/* auto-drifting reel marquee — pauses on hover/touch, swipeable */}
        <div className="relative mt-10">
          <div
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            <div
              ref={rowRef}
              className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
            >
              {loopVids.map((url, i) => (
                <a
                  key={`${url}-${i}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch Beside Learning reel ${(i % vids.length) + 1} on Instagram`}
                  className="group/reel relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-2xl border border-brand-100 bg-black shadow-sm transition hover:shadow-xl hover:shadow-brand-900/20 sm:w-52"
                >
                  {/* Embed cropped to just the video: the ~54px profile header is
                      shifted up out of view, the footer overflows the bottom, and
                      the iframe is widened so the 9:16 video fills the card and
                      Instagram's black side bars fall outside it. Display-only —
                      the card itself links to the reel. */}
                  <iframe
                    src={embedUrl(url)}
                    title={`Beside Learning reel ${(i % vids.length) + 1}`}
                    loading="lazy"
                    scrolling="no"
                    tabIndex={-1}
                    className="pointer-events-none absolute border-0"
                    style={{
                      top: '-54px',
                      left: '-23%',
                      width: '146%',
                      height: 'calc(190% + 60px)',
                    }}
                  />

                  {/* minimal affordances */}
                  <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                    <InstagramIcon className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover/reel:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-brand-700)" aria-hidden="true">
                        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                      </svg>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* manual arrows */}
          <div className="mt-6 hidden justify-center gap-3 sm:flex">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollByCards(dir)}
                aria-label={dir < 0 ? 'Scroll reels left' : 'Scroll reels right'}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-800 shadow-sm transition hover:bg-brand-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={dir < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
