// ─────────────────────────────────────────────────────────────
// Beside Learning — ALL editable content lives in this file.
// Swap placeholders (marked TODO) for real details any time.
// ─────────────────────────────────────────────────────────────

// Prefixes public/ asset paths with the deploy base (needed when the site
// is served from a sub-path, e.g. GitHub Pages: /repo-name/).
export const asset = (p) => import.meta.env.BASE_URL.replace(/\/$/, "") + p

export const brand = {
  name: "Beside",
  fullName: "Beside Learning",
  tagline: "Beyond lectures, Beside learners",
  logo: asset("/logo.png"), // white wordmark on purple
  address:
    "2nd Floor, Pratheeksha Building, Palarivattom, Kochi – 682025",
}

export const contact = {
  phone: "+91 99886 06602",
  whatsapp: "919988606602", // digits only, with country code
  email: "info@besideeducation.com",
  mapsUrl: "https://maps.google.com/?q=Pratheeksha+Building+Palarivattom+Kochi",
  instagram: "https://www.instagram.com/beside.education",
  youtube: "https://youtube.com/@besidelearning", // TODO: real channel

}

export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/#courses" },
  { label: "Why Beside", href: "/#why-beside" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#register" },
]

export const boards = ["CBSE", "ICSE", "IGCSE", "IB", "NIOS", "A-Level", "O-Level"]

export const hero = {
  badge: "Admissions Open 2026–27",
  // Headline is split so "Beside" gets the accent treatment
  headlinePre: "Beyond Lectures,",
  headlineAccent: "Beside",
  headlinePost: "Learners",
  subcopy:
    "Personalised tuition for classes 6 to 12 across CBSE, ICSE, IGCSE, IB, NIOS, A-Level and O-Level — right here in Palarivattom, Kochi.",
}

// Posters: drop image files into public/posters/desktop (wide banners,
// e.g. 1920x560) and public/posters/mobile (portrait, e.g. 1080x1350),
// then list them here. Order in the array = order in the carousel.
export const posters = {
  desktop: [
    { src: asset("/posters/desktop/poster-1.jpg"), alt: "Beside Learning announcement 1" },
    { src: asset("/posters/desktop/poster-2.jpg"), alt: "Beside Learning announcement 2" },
    { src: asset("/posters/desktop/poster-3.jpg"), alt: "Beside Learning announcement 3" },
  ],
  mobile: [
    { src: asset("/posters/mobile/poster-1.jpg"), alt: "Beside Learning announcement 1" },
    { src: asset("/posters/mobile/poster-2.jpg"), alt: "Beside Learning announcement 2" },
    { src: asset("/posters/mobile/poster-3.jpg"), alt: "Beside Learning announcement 3" },
  ],
  autoPlayMs: 4500,
}

export const stats = [
  // TODO: confirm real numbers
  { value: "7+", label: "Boards Under One Roof" },
  { value: "6–12", label: "Classes Covered" },
  { value: "100%", label: "Personal Attention" },
  { value: "1:1", label: "Mentoring & Doubt Support" },
]

// Detailed structure shown in the "Course Structure" tabs.
// TODO: replace drafts with the real batch patterns / timings.
export const courseStructure = [
  {
    tab: "CBSE",
    title: "CBSE — Classes 6 to 12",
    subjects: ["Mathematics", "Science (Phy · Chem · Bio)", "English", "Social Science", "+1/+2: Science & Commerce streams"],
    batches: "Weekday evening batches after school hours, plus weekend revision batches. Small groups of 8–12 students.",
    assessments: "Weekly chapter tests, monthly cumulative exams and pre-board mock series for classes 10 & 12.",
    mode: "Offline at our Palarivattom centre, with online live classes available on request.",
    extras: "NCERT-first approach · board-pattern question practice · monthly parent progress updates",
  },
  {
    tab: "ICSE / ISC",
    title: "ICSE & ISC — Classes 6 to 12",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English Language & Literature"],
    batches: "Weekday evening batches with dedicated descriptive-writing practice hours on weekends.",
    assessments: "Fortnightly written tests modelled on ICSE's descriptive pattern, plus project and practical guidance.",
    mode: "Offline at our Palarivattom centre, with online live classes available on request.",
    extras: "Answer-presentation coaching · internal assessment support · monthly parent updates",
  },
  {
    tab: "IGCSE / O-Level",
    title: "Cambridge IGCSE & O-Level",
    subjects: ["Mathematics (0580/0606)", "Physics · Chemistry · Biology", "English", "Business Studies & Economics"],
    batches: "Flexible small-group batches aligned to school schedules; individual slots for exam-season crash prep.",
    assessments: "Past-paper practice every week with examiner-style marking and grade-boundary tracking.",
    mode: "Offline and online options; hybrid plans for students who travel.",
    extras: "Syllabus-code specific prep · revision notes · mock exams before each Cambridge series",
  },
  {
    tab: "A-Level",
    title: "Cambridge A-Level (AS & A2)",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Economics"],
    batches: "Subject-wise batches with flexible timing; intensive blocks before May/June and Oct/Nov series.",
    assessments: "Topic tests plus full past-paper mocks with detailed feedback on exam technique.",
    mode: "Offline and online options available.",
    extras: "University-application friendly mentoring · exam-technique workshops",
  },
  {
    tab: "IB",
    title: "IB — MYP & Diploma Programme",
    subjects: ["Maths AA / AI (SL & HL)", "Physics · Chemistry · Biology", "English A/B", "Economics & Business Management"],
    batches: "Small batches and 1:1 slots; schedules planned around school deadlines and IA calendars.",
    assessments: "Criterion-based assessments with IA, EE and TOK support checkpoints across the term.",
    mode: "Offline and online options available.",
    extras: "IA & EE mentoring · past-paper practice · predicted-grade preparation",
  },
  {
    tab: "NIOS",
    title: "NIOS — Secondary & Senior Secondary",
    subjects: ["All core subjects for 10th & 12th", "TMA (assignment) guidance", "Practical support where applicable"],
    batches: "Self-paced plans with fixed weekly mentoring hours — built for flexibility.",
    assessments: "TMA reviews, periodic tests and full mock exams before public/on-demand exams.",
    mode: "Offline and online options; ideal for repeaters and alternative-schooling learners.",
    extras: "Admission & exam registration help · study planning · one-to-one doubt clearing",
  },
]

// Content for the /about page. TODO: replace drafts with the real story,
// founding year, and the two lead mentors' names/subjects/photos.
export const aboutPage = {
  intro:
    "Beside Learning is a tuition centre in Palarivattom, Kochi, built around one simple idea: students don't need more lectures — they need someone beside them while they learn.",
  story: [
    "Most classrooms move at the speed of the syllabus, not the speed of the student. Doubts pile up quietly, basics stay shaky, and marks become a source of stress instead of confidence. Beside Learning started as an answer to that.",
    "We bring together learners from CBSE, ICSE, IGCSE, IB, NIOS, A-Level and O-Level under one roof — but never into one identical classroom. Each program is small, board-specific and mentor-led, so every student gets teaching tuned to their exam pattern and their pace.",
    "From class 6 foundations to class 12 board exams, our mentors stay beside each student through the whole journey — tracking gaps, rebuilding basics and pushing further where there's room.",
  ],
  mission: {
    title: "Our Mission",
    text: "To make every student feel seen in the classroom — replacing fear of doubts with the confidence to ask, and rote learning with real understanding.",
  },
  vision: {
    title: "Our Vision",
    text: "To be Kochi's most trusted learning partner for school students — the place families recommend, whatever board their child studies in.",
  },
  mentors: {
    heading: "Meet Our Lead Mentors",
    sub: "The two faces every Beside student knows.",
    people: [
      // TODO: real names & subjects
      { name: "Lead Mentor 1", role: "Name & subjects coming soon", photo: asset("/tutors/tutor-1.png") },
      { name: "Lead Mentor 2", role: "Name & subjects coming soon", photo: asset("/tutors/tutor-2.png") },
    ],
  },
}

export const whyBeside = {
  intro:
    "Most tuition centres teach at the class. We sit beside the learner — that's the promise in our name, and it shapes everything about how Beside works.",
  intro2:
    "From the first demo class to the final exam hall, a mentor stays with your child through the whole journey — tracking gaps, rebuilding basics where needed and pushing further where there's room.",
  checklist: [
    "A mentor who knows your child by name, not roll number",
    "Teaching tuned to each board's exam pattern",
    "Honest, regular feedback to parents",
  ],
  // TODO: refine these points to match Beside's real strengths
  points: [
    {
      icon: "users",
      title: "Small Batches, Real Attention",
      desc: "Compact groups mean every student is seen, heard and pushed at their own pace — nobody hides in the back row.",
    },
    {
      icon: "layers",
      title: "7 Boards Under One Roof",
      desc: "CBSE, ICSE, IGCSE, IB, NIOS, A-Level and O-Level — siblings on different boards can learn at the same centre.",
    },
    {
      icon: "chat",
      title: "Doubt Support Beyond Class",
      desc: "Questions don't keep class hours. Our mentors stay reachable for doubts even after the session ends.",
    },
    {
      icon: "chart",
      title: "Progress Parents Can See",
      desc: "Regular assessments with clear score tracking and monthly updates — parents always know where their child stands.",
    },
    {
      icon: "target",
      title: "Board-Specific Teaching",
      desc: "An IGCSE past-paper drill is not a CBSE NCERT session. Each program follows its own board's exam logic.",
    },
    {
      icon: "pin",
      title: "Easy To Reach, Easy To Fit",
      desc: "Right in Palarivattom, Kochi — with hybrid online options when travel or schedules get in the way.",
    },
  ],
}

// Instagram reels shown in the video row. Paste full reel URLs here —
// the embed link is derived automatically, and the row repeats them in a
// seamless auto-scrolling loop (no need to add duplicates).
// For a much lighter page, give a reel a cover image instead of the live
// embed: drop a 9:16 image (e.g. 540x960 .jpg) into public/reels/ and write
//   { url: "https://www.instagram.com/reel/XXXX/", thumb: asset("/reels/reel-1.jpg") }
export const reels = {
  handle: "@beside.education",
  videos: [
    "https://www.instagram.com/reel/DZPGbylpixE/",
    "https://www.instagram.com/reel/DZZoFIGhmsh/",
    "https://www.instagram.com/reel/DZrvm_EJG3l/",
    "https://www.instagram.com/reel/DZ1knG0Jmf-/",
  ],
}

// TODO: adjust answers (demo class policy, timings, online availability).
export const faqs = [
  {
    q: "Which classes and boards does Beside Learning cover?",
    a: "We provide tuition for classes 6 to 12 across CBSE, ICSE, IGCSE, IB, NIOS, A-Level and O-Level — all under one roof, each taught to its own board's pattern.",
  },
  {
    q: "Where is Beside Learning located?",
    a: "We're on the 2nd floor of Pratheeksha Building, Palarivattom, Kochi – 682025. It's an easy-to-reach spot with good bus and metro connectivity.",
  },
  {
    q: "Do you offer online classes?",
    a: "Yes. Our core teaching happens offline at the Palarivattom centre, and we offer online live classes and hybrid plans for students who can't travel regularly.",
  },
  {
    q: "How are batches organised?",
    a: "Batches are small and grouped by class and board, so a CBSE class 9 student and an IGCSE class 9 student learn separately, each in their own board's style and pace.",
  },
  {
    q: "Can we try a class before joining?",
    a: "Absolutely — reach out via the register form or WhatsApp and we'll arrange a demo class so your child can experience how Beside teaches before you decide.",
  },
  {
    q: "How do I ask about fees and admission?",
    a: "Fill the quick form below, or call / WhatsApp us directly. We'll walk you through the program options, timings and fees for your child's class and board.",
  },
]

// TODO: replace with real student/parent testimonials (name, role, quote).
export const testimonials = [
  {
    name: "Anjali R",
    meta: "Parent · Class 9 CBSE student",
    quote:
      "My daughter used to hide her doubts in school. At Beside, the small batch changed that completely — she asks, they answer, and her maths scores show it.",
  },
  {
    name: "Mohammed F",
    meta: "Class 12 · A-Level (Physics & Maths)",
    quote:
      "The past-paper practice every week made the real exam feel familiar. My mentor knew exactly which topics I was weak in before I did.",
  },
  {
    name: "Divya & Sanjay",
    meta: "Parents · IGCSE Class 10 student",
    quote:
      "We moved from another centre because nobody there understood the Cambridge pattern. Beside teaches it the way the board actually examines it.",
  },
]

export const coursesIntro =
  "Every board has its own rhythm — its own syllabus, exam pattern and pace. At Beside, each program is taught the way that board demands, so learners are never squeezed into a one-size-fits-all class."

export const courses = [
  {
    abbr: "CBSE",
    title: "CBSE Tuition",
    levels: ["Classes 6–10", "+1 & +2"],
    subjects: "Maths · Science · English · Social Science · Streams for +1/+2",
    highlight: "NCERT-first teaching with regular chapter-wise assessments.",
  },
  {
    abbr: "ICSE",
    title: "ICSE / ISC Tuition",
    levels: ["Classes 6–10", "ISC 11 & 12"],
    subjects: "Maths · Physics · Chemistry · Biology · English",
    highlight: "Detail-oriented coaching built for ICSE's descriptive style.",
  },
  {
    abbr: "IGCSE",
    title: "IGCSE & O-Level",
    levels: ["Cambridge", "Classes 6–10"],
    subjects: "Maths · Sciences · English · Business Studies",
    highlight: "Past-paper driven practice aligned to Cambridge assessment.",
  },
  {
    abbr: "A/L",
    title: "A-Level",
    levels: ["AS & A2"],
    subjects: "Maths · Physics · Chemistry · Biology · Economics",
    highlight: "Concept-deep coaching for university-ready results.",
  },
  {
    abbr: "IB",
    title: "IB Tuition",
    levels: ["MYP", "DP 1 & 2"],
    subjects: "Maths AA/AI · Sciences · English · Economics",
    highlight: "IA and EE support alongside criterion-based teaching.",
  },
  {
    abbr: "NIOS",
    title: "NIOS Support",
    levels: ["Secondary", "Senior Secondary"],
    subjects: "All core subjects · TMA guidance · Exam registration help",
    highlight: "Flexible open-schooling support at your own pace.",
  },
]
