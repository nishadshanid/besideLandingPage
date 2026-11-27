import { useState } from 'react'
import { boards, brand, contact } from '../data/content.js'
import { logEnquiry, trackClick } from '../lib/track.js'

const classes = ['6', '7', '8', '9', '10', '11', '12']

const inputCls =
  'w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-brand-900 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-accent-400'
const labelCls = 'mb-1.5 block text-xs font-semibold tracking-wide text-brand-100'

function ContactRow({ href, children, label, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
    >
      {children}
      <span>{label}</span>
    </a>
  )
}

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', klass: '', board: '', message: '' })
  const [website, setWebsite] = useState('') // hidden; only bots fill it
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    const lines = [
      `Hi ${brand.fullName}! I'd like to register.`,
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.klass && `Class: ${form.klass}`,
      form.board && `Board: ${form.board}`,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean)
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    // open WhatsApp first, while still inside the click (popup blockers)
    window.open(url, '_blank', 'noopener,noreferrer')
    logEnquiry({ ...form, website, elapsedMs: Math.round(performance.now()) /* time on the page */ })
  }

  return (
    <section id="register" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Admissions Open
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            Ready To Get Started? <span className="text-brand-700">Register Today</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Tell us a little about your child and we&rsquo;ll get back with the right program,
            timings and a demo class.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 shadow-2xl shadow-brand-900/25">
          <div className="grid lg:grid-cols-[1fr_1.5fr]">
            {/* ── Left: direct contact ── */}
            <div className="relative flex flex-col justify-between gap-10 p-8 sm:p-10">
              <div>
                <h3 className="text-xl font-bold text-white">Prefer to talk directly?</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-100">
                  Call or message us — we&rsquo;re happy to answer questions about programs,
                  timings and fees.
                </p>

                <div className="mt-6 space-y-3">
                  <ContactRow href={`tel:${contact.phone.replace(/\s/g, '')}`} label={contact.phone}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-400" aria-hidden="true">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
                    </svg>
                  </ContactRow>
                  <ContactRow
                    href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.fullName}! I'd like to know more about your tuition programs.`)}`}
                    onClick={() => trackClick('contact')}
                    label="Chat on WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] shrink-0 text-[#25D366]" aria-hidden="true">
                      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2.1 21.9l4.9-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.34-2 1.4-.5.06-1.15.09-1.86-.12a17 17 0 0 1-1.68-.62c-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.19 0 .43-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.73-.86.93-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
                    </svg>
                  </ContactRow>
                  <ContactRow href={`mailto:${contact.email}`} label={contact.email}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-400" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </ContactRow>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent-400" aria-hidden="true">
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-white">Visit us</div>
                    <p className="mt-1 text-xs leading-relaxed text-brand-100">{brand.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: form ── */}
            <form
              onSubmit={onSubmit}
              className="border-t border-white/15 bg-white/5 p-8 backdrop-blur sm:p-10 lg:border-t-0 lg:border-l"
            >
              {/* honeypot: hidden from people, bots tend to fill it */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="reg-website">Website</label>
                <input id="reg-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-name" className={labelCls}>
                    Student / Parent Name <span className="text-accent-400">*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className={labelCls}>
                    Phone Number <span className="text-accent-400">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    pattern="[0-9+\-\s]{7,15}"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+91 ..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="reg-class" className={labelCls}>Class</label>
                  <select id="reg-class" value={form.klass} onChange={set('klass')} className={inputCls}>
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c} value={`Class ${c}`}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-board" className={labelCls}>Board</label>
                  <select id="reg-board" value={form.board} onChange={set('board')} className={inputCls}>
                    <option value="">Select board</option>
                    {boards.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="reg-message" className={labelCls}>Message (optional)</label>
                  <textarea
                    id="reg-message"
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Anything you'd like us to know — subjects, timings, goals..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-accent-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent-600/30 transition hover:bg-accent-600 sm:w-auto"
              >
                Send via WhatsApp
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <p className="mt-4 text-xs leading-relaxed text-brand-200">
                Submitting opens WhatsApp with your details pre-filled. We also save your name and
                number so our team can call you back about admissions.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
