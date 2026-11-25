import { useEffect, useRef, useState } from 'react'
import { reels } from '../data/content.js'

// "https://www.instagram.com/reel/ABC123/?igsh=x" -> "https://www.instagram.com/reel/ABC123/embed/"
function embedUrl(url) {
  const path = new URL(url).pathname.replace(/\/?$/, '/')
  return `https://www.instagram.com${path}embed/`
}

// content.js entries are either a reel URL string or { url, thumb }
const toReel = (v) => (typeof v === 'string' ? { url: v } : v)

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ReelCard({ reel, index, live }) {
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch Beside Learning reel ${index + 1} on Instagram`}
      className="group/reel relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-800 to-brand-600 shadow-sm transition hover:shadow-xl hover:shadow-brand-900/20 sm:w-52"
    >
      {reel.thumb ? (
        // A still cover image is far cheaper than an embed — prefer it.
        <img
          src={reel.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        live && (
          /* Embed cropped to just the video: the profile header is shifted up
             out of view, the footer overflows the bottom, and the iframe is
             widened so the 9:16 video fills the card and IG's black side bars
             fall outside it. Display-only — the card links to the reel. */
          <iframe
            src={embedUrl(reel.url)}
            title={`Beside Learning reel ${index + 1}`}
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            className="pointer-events-none absolute border-0 bg-black"
            style={{ top: '-54px', left: '-23%', width: '146%', height: 'calc(190% + 60px)' }}
          />
        )
      )}
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
  )
}

export default function Reels() {
  const vids = [...new Map(reels.videos.map(toReel).map((r) => [r.url, r])).values()]

  // Embeds are only created once the section gets near the viewport (and kept
  // after that, so they don't reload), and the marquee is paused whenever the
  // section is off screen.
  const sectionRef = useRef(null)
  const [live, setLive] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setLive(true)
      setOnScreen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (entry.isIntersecting) setLive(true)
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // One "set" must be at least as wide as the viewport, otherwise translating
  // by a set-width (the -50% loop) exposes blank track on wide screens. Repeat
  // the reels only as many times as needed, then render that set twice so the
  // -50% translate loops seamlessly.
  const [reps, setReps] = useState(1)
  useEffect(() => {
    const compute = () => {
      const cardW = window.matchMedia('(min-width: 640px)').matches ? 208 + 16 : 176 + 16
      const setW = vids.length * cardW
      // keep a small safety margin beyond the viewport width
      setReps(Math.max(1, Math.ceil((window.innerWidth + 64) / setW)))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [vids.length])

  const base = Array.from({ length: reps }, () => vids).flat()
  const loop = [...base, ...base]
  const duration = `${base.length * 7}s`

  return (
    <section id="reels" ref={sectionRef} className="overflow-hidden bg-white">
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
      </div>

      {/* full-bleed auto-scrolling marquee; pauses on hover and off screen */}
      <div className="marquee-viewport relative w-full overflow-hidden pb-16 lg:pb-24">
        {/* edge fades */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

        <div
          className="marquee-track flex w-max gap-4"
          style={{
            '--marquee-duration': duration,
            ...(onScreen ? null : { animationPlayState: 'paused' }),
          }}
        >
          {loop.map((reel, i) => (
            <ReelCard key={`${reel.url}-${i}`} reel={reel} index={i % vids.length} live={live} />
          ))}
        </div>
      </div>
    </section>
  )
}
