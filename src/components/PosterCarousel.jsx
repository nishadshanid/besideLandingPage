import { useEffect, useRef, useState } from 'react'
import { posters } from '../data/content.js'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

function Arrow({ dir, onClick }) {
  const left = dir === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? 'Previous poster' : 'Next poster'}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-800 shadow-lg shadow-brand-900/20 backdrop-blur transition hover:bg-white ${
        left ? 'left-3' : 'right-3'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={left ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

/**
 * Seamless infinite carousel.
 *
 * The track renders [lastClone, ...slides, firstClone]. Moving forward past
 * the last poster animates into firstClone, then an instant (invisible) jump
 * relocates to the real first poster — so the loop always flows forward.
 * Same trick in reverse for going back from the first poster.
 */
export default function PosterCarousel() {
  const isDesktop = useIsDesktop()
  const slides = isDesktop ? posters.desktop : posters.mobile
  const n = slides.length
  const looping = n > 1
  const extended = looping ? [slides[n - 1], ...slides, slides[0]] : slides

  const trackRef = useRef(null)
  const indexRef = useRef(0) // real index, 0..n-1
  const [index, setIndex] = useState(0)
  const pausedRef = useRef(false)
  const settleTimer = useRef(null)
  const snapTimer = useRef(null)

  const slideW = () => trackRef.current?.clientWidth ?? 0
  const rawIndex = () => Math.round(trackRef.current.scrollLeft / slideW())

  const jumpTo = (raw) => {
    trackRef.current.scrollTo({ left: raw * slideW(), behavior: 'instant' })
  }

  // Smooth-scroll to a raw position. Snap is disabled during the animation:
  // programmatic smooth scrolls get trapped at intermediate snap stops.
  const glideTo = (raw) => {
    const track = trackRef.current
    if (!track) return
    track.style.scrollSnapType = 'none'
    track.scrollTo({ left: raw * slideW(), behavior: 'smooth' })
    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      track.style.scrollSnapType = ''
    }, 700)
  }

  // Safety net: if a missed scroll event left us parked on a clone
  // (throttled background tab, interrupted animation), relocate first.
  const normalize = () => {
    const raw = rawIndex()
    if (raw === 0) jumpTo(n)
    else if (raw === n + 1) jumpTo(1)
  }

  const next = () => {
    normalize()
    glideTo(Math.min(rawIndex() + 1, n + 1))
  }
  const prev = () => {
    normalize()
    glideTo(Math.max(rawIndex() - 1, 0))
  }

  // start on the real first slide (raw position 1)
  useEffect(() => {
    if (looping) jumpTo(1)
    indexRef.current = 0
    setIndex(0)
  }, [looping, isDesktop])

  // keep alignment when the viewport is resized
  useEffect(() => {
    const onResize = () => looping && jumpTo(indexRef.current + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [looping])

  // track the visible slide + normalize away from clones once scrolling settles
  useEffect(() => {
    const track = trackRef.current
    if (!track || !looping) return
    const onScroll = () => {
      const raw = rawIndex()
      const real = (((raw - 1) % n) + n) % n
      indexRef.current = real
      setIndex(real)
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(() => {
        const settled = rawIndex()
        if (settled === 0) jumpTo(n) // on lastClone -> real last
        else if (settled === n + 1) jumpTo(1) // on firstClone -> real first
      }, 120)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [n, looping])

  // autoplay — always forward, paused while hovering/touching
  useEffect(() => {
    if (!looping) return
    const id = setInterval(() => {
      if (!pausedRef.current && trackRef.current) next()
    }, posters.autoPlayMs)
    return () => clearInterval(id)
  }, [looping, isDesktop])

  const pause = () => (pausedRef.current = true)
  const resume = () => (pausedRef.current = false)

  return (
    <section aria-label="Announcements and highlights" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div
          className="group relative"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          <div
            ref={trackRef}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto rounded-3xl shadow-xl shadow-brand-900/15"
          >
            {extended.map((p, i) => (
              <div key={`${p.src}-${i}`} className="w-full shrink-0 snap-center">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={i <= 1 ? 'eager' : 'lazy'}
                  className={`w-full object-cover ${
                    isDesktop ? 'aspect-[24/7]' : 'aspect-[4/5]'
                  }`}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {looping && (
            <>
              <Arrow dir="prev" onClick={prev} />
              <Arrow dir="next" onClick={next} />

              {/* dots */}
              <div className="mt-4 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to poster ${i + 1}`}
                    onClick={() => glideTo(i + 1)}
                    className={`h-2 rounded-full transition-all ${
                      i === index
                        ? 'w-6 bg-brand-700'
                        : 'w-2 bg-brand-200 hover:bg-brand-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
