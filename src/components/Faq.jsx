import { useState } from 'react'
import { faqs } from '../data/content.js'

function Item({ faq, open, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        open ? 'border-brand-200 bg-white shadow-lg shadow-brand-900/5' : 'border-brand-100 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
      >
        <span className="text-sm font-semibold text-brand-900 sm:text-base">{faq.q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
            open ? 'rotate-180 bg-brand-700 text-white' : 'bg-brand-50 text-brand-700'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 sm:px-7 sm:pb-6">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-brand-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Good To Know
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Quick answers for parents and students. Something else on your mind? Just ask us below.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <Item
              key={faq.q}
              faq={faq}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
