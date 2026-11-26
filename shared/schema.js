// ─────────────────────────────────────────────────────────────
// Shape of content/site.json.
// Used by the admin page (to draw the forms) and by the API (to validate
// every save), so the two can never disagree.
//
// Node types:
//   object  { fields }            string  { max, multiline, optional }
//   number  { min, max }          url     { pattern?, optional }
//   image   { preset, optional }  select  { options }
//   list    { item, min, max, itemLabel }
//   fixed   – kept as-is, not editable in the admin
// ─────────────────────────────────────────────────────────────

const s = (label, extra = {}) => ({ type: 'string', label, max: 300, ...extra })
const text = (label, extra = {}) => ({ type: 'string', label, multiline: true, max: 2000, ...extra })
const url = (label, extra = {}) => ({ type: 'url', label, ...extra })
const list = (label, item, extra = {}) => ({ type: 'list', label, item, min: 0, max: 50, ...extra })
const obj = (label, fields, extra = {}) => ({ type: 'object', label, fields, ...extra })

// Image presets: the browser resizes uploads to fit inside these bounds.
export const imagePresets = {
  posterDesktop: { maxW: 1920, maxH: 800, alpha: false, hint: 'Wide banner, ideally 1920 × 560' },
  posterMobile: { maxW: 1080, maxH: 1350, alpha: false, hint: 'Portrait, ideally 1080 × 1350' },
  reelCover: { maxW: 540, maxH: 960, alpha: false, hint: 'Portrait 9:16, e.g. a screenshot of the reel' },
  mentor: { maxW: 800, maxH: 1000, alpha: true, hint: 'Cut-out photo with transparent background (PNG)' },
}

export const whyIcons = ['users', 'layers', 'chat', 'chart', 'target', 'pin']

export const REEL_URL = /^https:\/\/(www\.)?instagram\.com\/(reel|p)\/[A-Za-z0-9_-]+\/?(\?.*)?$/

export const schema = obj('Site', {
  hero: obj('Hero (top of home page)', {
    badge: s('Badge', { help: 'Small pill above the headline, e.g. "Admissions Open 2026–27"', max: 60 }),
    headlinePre: s('Headline – first line', { max: 80 }),
    headlineAccent: s('Headline – highlighted word', { max: 40 }),
    headlinePost: s('Headline – after the highlight', { max: 80 }),
    subcopy: text('Sub-heading', { max: 400 }),
  }),
  stats: list('Stats strip', obj('Stat', { value: s('Number', { max: 12 }), label: s('Label', { max: 60 }) }), {
    min: 1, max: 8, itemLabel: 'label',
  }),
  posters: obj('Poster carousel', {
    desktop: list('Desktop posters', obj('Poster', {
      src: { type: 'image', label: 'Image', preset: 'posterDesktop' },
      alt: s('Description (for screen readers)', { max: 200 }),
    }), { min: 1, max: 12, itemLabel: 'alt' }),
    mobile: list('Mobile posters', obj('Poster', {
      src: { type: 'image', label: 'Image', preset: 'posterMobile' },
      alt: s('Description (for screen readers)', { max: 200 }),
    }), { min: 1, max: 12, itemLabel: 'alt' }),
    autoPlayMs: { type: 'number', label: 'Time per poster (milliseconds)', min: 2000, max: 20000 },
  }),
  coursesIntro: text('Courses – intro paragraph', { max: 600 }),
  courses: list('Course cards', obj('Course', {
    abbr: s('Short name on the banner', { max: 10 }),
    title: s('Title', { max: 80 }),
    levels: list('Level tags', s('Tag', { max: 40 }), { max: 6 }),
    subjects: s('Subjects line', { max: 200 }),
    highlight: s('Highlight sentence', { max: 200 }),
  }), { min: 1, max: 12, itemLabel: 'title' }),
  courseStructure: list('Course structure tabs', obj('Program', {
    tab: s('Tab name', { max: 30 }),
    title: s('Heading', { max: 100 }),
    subjects: list('Subjects covered', s('Subject', { max: 120 }), { min: 1, max: 15 }),
    batches: text('Batch pattern', { max: 500 }),
    assessments: text('Assessments & feedback', { max: 500 }),
    mode: text('Mode of learning', { max: 500 }),
    extras: text('Highlights strip', { max: 400 }),
  }), { min: 1, max: 12, itemLabel: 'tab' }),
  whyBeside: obj('Why Beside', {
    intro: text('Intro paragraph 1', { max: 600 }),
    intro2: text('Intro paragraph 2', { max: 600 }),
    checklist: list('Checklist', s('Point', { max: 120 }), { max: 6 }),
    points: list('Feature cards', obj('Feature', {
      icon: { type: 'select', label: 'Icon', options: whyIcons },
      title: s('Title', { max: 60 }),
      desc: text('Description', { max: 300 }),
    }), { min: 1, max: 12, itemLabel: 'title' }),
  }),
  testimonials: list('Testimonials', obj('Testimonial', {
    name: s('Name', { max: 60 }),
    meta: s('Who they are', { help: 'e.g. "Parent · Class 9 CBSE student"', max: 100 }),
    quote: text('Quote', { max: 600 }),
  }), { max: 12, itemLabel: 'name' }),
  reels: obj('Instagram reels', {
    handle: s('Instagram handle', { max: 40 }),
    videos: list('Reels', obj('Reel', {
      url: url('Reel link', { pattern: REEL_URL, help: 'Paste the reel link from Instagram' }),
      thumb: {
        type: 'image', label: 'Cover image', preset: 'reelCover', optional: true,
        help: 'With a cover image the page loads a picture instead of the heavy Instagram player.',
      },
    }), { min: 1, max: 16, itemLabel: 'url' }),
  }),
  faqs: list('FAQ', obj('Question', {
    q: s('Question', { max: 200 }),
    a: text('Answer', { max: 1000 }),
  }), { max: 20, itemLabel: 'q' }),
  aboutPage: obj('About page', {
    intro: text('Intro', { max: 600 }),
    story: list('Our story paragraphs', text('Paragraph', { max: 1000 }), { min: 1, max: 8 }),
    mission: obj('Mission card', { title: s('Title', { max: 40 }), text: text('Text', { max: 400 }) }),
    vision: obj('Vision card', { title: s('Title', { max: 40 }), text: text('Text', { max: 400 }) }),
    mentors: obj('Mentors', {
      heading: s('Heading', { max: 80 }),
      sub: s('Sub-heading', { max: 160 }),
      people: list('People', obj('Mentor', {
        name: s('Name', { max: 60 }),
        role: s('Role / subjects', { max: 100 }),
        photo: { type: 'image', label: 'Photo', preset: 'mentor' },
      }), { min: 1, max: 8, itemLabel: 'name' }),
    }),
  }),
  boards: list('Boards', s('Board', { max: 20 }), { min: 1, max: 12 }),
  brand: obj('Brand & address', {
    name: s('Short name', { max: 40 }),
    fullName: s('Full name', { max: 60 }),
    tagline: s('Tagline', { max: 80 }),
    logo: { type: 'fixed' },
    address: text('Address', { max: 200 }),
  }),
  contact: obj('Contact & social links', {
    phone: s('Phone (as shown)', { max: 20, pattern: /^\+?[0-9 ]{7,20}$/ }),
    whatsapp: s('WhatsApp number', { help: 'Digits only, with country code, e.g. 919988606602', max: 15, pattern: /^[0-9]{8,15}$/ }),
    email: s('Email', { max: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    mapsUrl: url('Google Maps link'),
    instagram: url('Instagram profile link'),
    youtube: url('YouTube channel link'),
  }),
  nav: { type: 'fixed' },
})

// Admin sidebar: which top-level keys appear under which section.
export const sections = [
  { id: 'hero', title: 'Hero & stats', keys: ['hero', 'stats'] },
  { id: 'posters', title: 'Posters', keys: ['posters'] },
  { id: 'reels', title: 'Reels', keys: ['reels'] },
  { id: 'courses', title: 'Courses', keys: ['coursesIntro', 'courses'] },
  { id: 'structure', title: 'Course structure', keys: ['courseStructure'] },
  { id: 'why', title: 'Why Beside', keys: ['whyBeside'] },
  { id: 'testimonials', title: 'Testimonials', keys: ['testimonials'] },
  { id: 'faq', title: 'FAQ', keys: ['faqs'] },
  { id: 'about', title: 'About page', keys: ['aboutPage'] },
  { id: 'contact', title: 'Contact & brand', keys: ['contact', 'brand', 'boards'] },
]

export const IMAGE_PATH = /^\/[A-Za-z0-9/_.-]+\.(jpe?g|png|webp)$/i

// Returns a list of { path, message } problems; empty means valid.
export function validate(value, node = schema, path = '') {
  const errors = []
  const err = (message) => errors.push({ path: path || '(root)', message })
  const where = path

  switch (node.type) {
    case 'fixed':
      return errors
    case 'object': {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        err('must be an object')
        return errors
      }
      for (const k of Object.keys(value)) {
        if (!(k in node.fields)) err(`unknown field "${k}"`)
      }
      for (const [k, child] of Object.entries(node.fields)) {
        const p = where ? `${where}.${k}` : k
        if (value[k] === undefined || value[k] === null) {
          if (!child.optional && child.type !== 'fixed') errors.push({ path: p, message: 'is required' })
          continue
        }
        errors.push(...validate(value[k], child, p))
      }
      return errors
    }
    case 'list': {
      if (!Array.isArray(value)) {
        err('must be a list')
        return errors
      }
      if (value.length < (node.min ?? 0)) err(`needs at least ${node.min} item(s)`)
      if (value.length > (node.max ?? 50)) err(`can have at most ${node.max} items`)
      value.forEach((v, i) => errors.push(...validate(v, node.item, `${where}[${i}]`)))
      return errors
    }
    case 'string': {
      if (typeof value !== 'string') return err('must be text'), errors
      if (!value.trim() && !node.optional) err('cannot be empty')
      if (value.length > (node.max ?? 300)) err(`is too long (max ${node.max} characters)`)
      if (node.pattern && value && !node.pattern.test(value)) err('is not in the expected format')
      return errors
    }
    case 'url': {
      if (typeof value !== 'string') return err('must be a link'), errors
      if (!value && node.optional) return errors
      let ok = false
      try {
        ok = new URL(value).protocol === 'https:'
      } catch {}
      if (!ok) err('must be a full https:// link')
      else if (node.pattern && !node.pattern.test(value)) err('is not the expected kind of link')
      if (value.length > 500) err('is too long')
      return errors
    }
    case 'image': {
      if (typeof value !== 'string') return err('must be an image path'), errors
      if (!value && node.optional) return errors
      if (!IMAGE_PATH.test(value) || value.includes('..')) err('must be an uploaded image')
      return errors
    }
    case 'number': {
      if (typeof value !== 'number' || !Number.isFinite(value)) return err('must be a number'), errors
      if (node.min != null && value < node.min) err(`must be at least ${node.min}`)
      if (node.max != null && value > node.max) err(`must be at most ${node.max}`)
      return errors
    }
    case 'select': {
      if (!node.options.includes(value)) err(`must be one of: ${node.options.join(', ')}`)
      return errors
    }
    default:
      err(`unknown schema type ${node.type}`)
      return errors
  }
}

// Every image path referenced anywhere in the content.
export function imagePaths(value, node = schema, out = new Set()) {
  if (value == null) return out
  if (node.type === 'image' && value) out.add(value)
  else if (node.type === 'object') for (const [k, c] of Object.entries(node.fields)) imagePaths(value[k], c, out)
  else if (node.type === 'list' && Array.isArray(value)) value.forEach((v) => imagePaths(v, node.item, out))
  return out
}
