// ─────────────────────────────────────────────────────────────
// Beside Learning — site content.
// The editable content lives in content/site.json and is managed from the
// admin page (/admin). This file only adapts it for the components:
// image paths are prefixed with the deploy base path.
// ─────────────────────────────────────────────────────────────
import site from '../../content/site.json'

// Prefixes public/ asset paths with the deploy base (needed when the site
// is served from a sub-path, e.g. GitHub Pages: /repo-name/).
export const asset = (p) => (p ? import.meta.env.BASE_URL.replace(/\/$/, '') + p : p)

const withSrc = (list) => list.map((p) => ({ ...p, src: asset(p.src) }))

export const brand = { ...site.brand, logo: asset(site.brand.logo) }
export const contact = site.contact
export const nav = site.nav
export const boards = site.boards
export const hero = site.hero
export const posters = {
  ...site.posters,
  desktop: withSrc(site.posters.desktop),
  mobile: withSrc(site.posters.mobile),
}
export const stats = site.stats
export const courseStructure = site.courseStructure
export const aboutPage = {
  ...site.aboutPage,
  mentors: {
    ...site.aboutPage.mentors,
    people: site.aboutPage.mentors.people.map((m) => ({ ...m, photo: asset(m.photo) })),
  },
}
export const whyBeside = site.whyBeside
// Each reel is { url, thumb? }. A thumb (cover image) replaces the live
// Instagram embed, which keeps the page much lighter.
export const reels = {
  ...site.reels,
  videos: site.reels.videos.map((r) => ({ ...r, thumb: asset(r.thumb) })),
}
export const faqs = site.faqs
export const testimonials = site.testimonials
export const coursesIntro = site.coursesIntro
export const courses = site.courses
