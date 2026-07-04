import { useState } from 'react'
import { courseStructure } from '../data/content.js'

const detailIcons = {
  subjects: (
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
  ),
  batches: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  assessments: (
    <>
      <path d="M9 11l3 3 8-8" />
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  mode: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
}

function DetailBlock({ icon, label, children }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icon}
          </svg>
        </span>
        <h4 className="text-sm font-semibold text-brand-900">{label}</h4>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  )
}

export default function CourseStructure() {
  const [active, setActive] = useState(0)
  const course = courseStructure[active]

  return (
    <section id="course-structure" className="bg-brand-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-widest text-accent-600 uppercase">
            Inside The Classroom
          </span>
          <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
            Detailed Course Structure
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Pick a program to see how it runs — subjects, batch pattern, assessments and mode.
          </p>
        </div>

        {/* tabs — horizontal scroll on mobile */}
        <div
          role="tablist"
          aria-label="Course programs"
          className="scrollbar-hide mt-10 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-center"
        >
          {courseStructure.map((c, i) => (
            <button
              key={c.tab}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                i === active
                  ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/25'
                  : 'bg-white text-brand-800 hover:bg-brand-100'
              }`}
            >
              {c.tab}
            </button>
          ))}
        </div>

        {/* active panel */}
        <div className="mt-8 rounded-3xl border border-brand-100 bg-brand-50/50 p-5 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-xl font-bold text-brand-900 sm:text-2xl">{course.title}</h3>
            <a
              href="#register"
              className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
            >
              Enquire About This Course
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailBlock icon={detailIcons.subjects} label="Subjects Covered">
              <ul className="space-y-1.5">
                {course.subjects.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </DetailBlock>
            <DetailBlock icon={detailIcons.batches} label="Batch Pattern">
              {course.batches}
            </DetailBlock>
            <DetailBlock icon={detailIcons.assessments} label="Assessments & Feedback">
              {course.assessments}
            </DetailBlock>
            <DetailBlock icon={detailIcons.mode} label="Mode of Learning">
              {course.mode}
            </DetailBlock>
          </div>

          <p className="mt-5 rounded-2xl bg-brand-700 px-5 py-4 text-sm leading-relaxed font-medium text-brand-50">
            {course.extras}
          </p>
        </div>
      </div>
    </section>
  )
}
