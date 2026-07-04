# Beside Learning — Admin Page & Hosting Guide

This doc answers three questions:

1. How do we add an **admin page** so you can change posters, reels, course
   structure etc. without touching code?
2. How do we **host the site for free** on your own domain — and what would it
   cost if free isn't enough?
3. How do we keep it **secure**?

---

## Part 1 — The Admin Page (CMS)

### The idea

Right now every piece of content on the site (posters, reels, courses, FAQ,
testimonials, contact details) lives in **one file**: `src/data/content.js`,
plus images in `public/`. An "admin page" is a friendly web form that edits
exactly that content and republishes the site. This is called a **CMS**
(Content Management System).

### Recommended approach: Git-based CMS (Decap CMS) — ₹0

Because the site is static (no server, no database), the cleanest admin is a
**Git-based CMS** such as [Decap CMS](https://decapcms.org) (free, open
source). How it works:

- You open `besidelearning.com/admin` and log in.
- You see forms: "Posters", "Reels", "Courses", "FAQ"… with image-upload
  buttons, drag-to-reorder, add/remove.
- When you press **Publish**, the CMS saves the change into the GitHub
  repository, which automatically triggers a rebuild — the live site updates
  in ~1 minute.

Why this fits Beside perfectly:

| | |
|---|---|
| Cost | ₹0 forever (no database, no server) |
| Security | Nothing new to hack — admin logs in through GitHub/Netlify Identity with 2FA |
| Backups | Every change is a Git commit — full history, one-click undo |
| Effort to build | ~1–2 days of work (config + migrating content.js to editable files) |

**Alternative (for later):** a custom admin built with **Supabase** (managed
database + login + file storage, generous free tier). Choose this only if you
eventually need things a Git CMS can't do — e.g. student logins, online fee
payment, enquiry forms stored in a database, multiple staff roles with
fine-grained permissions. It's roughly 1–2 weeks of work instead of 1–2 days.

**Avoid:** running your own WordPress/server on AWS/DigitalOcean. It's the
most-hacked setup on the internet and needs constant patching. Overkill here.

### What the admin page should include

**Content sections (everything currently in content.js):**

- **Posters** — upload desktop (1920×560) & mobile (1080×1350) images,
  reorder, enable/disable, set autoplay speed
- **Reels** — paste/remove Instagram reel URLs, reorder
- **Courses** — the six course cards: title, levels, subjects, highlight
- **Course structure** — per program: subjects list, batch pattern,
  assessments, mode, extras strip
- **Why Beside** — the six points + left-column paragraphs and checklist
- **Testimonials** — name, role, quote (add/remove/reorder)
- **FAQ** — questions and answers
- **Hero** — badge text ("Admissions Open 2026–27"), headline, sub-copy
- **Stats strip** — the four numbers and labels
- **Mentors** — names, subjects, photos (About page)
- **About page** — story paragraphs, mission, vision
- **Contact & socials** — phone, WhatsApp number, email, address, maps link,
  Instagram/YouTube URLs

**Admin features:**

- Secure login (GitHub or email invite + **two-factor authentication**)
- Draft → preview → publish workflow (see changes before they go live)
- Image handling (auto-resize/compress uploads)
- Change history with one-click rollback (free with the Git approach)
- Editor roles: e.g. a staff member can edit posters but not contact details

---

## Part 2 — Hosting & Costs

### Recommendation: Vercel or Netlify (free tier) — no AWS/DO needed

You do **not** need AWS, DigitalOcean, or any server platform. Those are for
apps that run server code; this site is static files. A server would cost
₹400–1,000/month *and* make security your job. Instead:

| Platform | Free tier | Custom domain | HTTPS | Verdict |
|---|---|---|---|---|
| **Vercel** (recommended) | 100 GB bandwidth/mo | ✅ free | ✅ automatic | Best DX, made for Vite/React |
| **Netlify** | 100 GB bandwidth/mo | ✅ free | ✅ automatic | Equally good; nicest Decap CMS integration |
| **Cloudflare Pages** | Unlimited bandwidth | ✅ free | ✅ automatic | Best free limits, slightly more setup |
| GitHub Pages | Soft 100 GB/mo | ✅ free | ✅ automatic | Fine for the demo (already set up) |

**Setup with your domain (one-time, ~15 minutes):**

1. Push this repo to GitHub.
2. Sign up at vercel.com with that GitHub account → "Import project" → it
   auto-detects Vite → Deploy. Done: you get `something.vercel.app`.
3. Buy your domain (e.g. besidelearning.com — ~₹700–1,500/yr from Namecheap,
   Cloudflare, GoDaddy or Hostinger).
4. In Vercel → Settings → Domains → add your domain → it shows you two DNS
   records to add at your domain registrar. HTTPS is issued automatically.

### Realistic monthly cost

| Setup | Monthly cost |
|---|---|
| Site only (now) | **₹0** — free tier is far more than a tuition-centre site uses |
| Site + Decap CMS admin | **₹0** — still no server or database |
| Site + custom admin (Supabase free tier) | **₹0** to start |
| Site + custom admin at scale (Supabase Pro) | ~₹2,100/mo ($25) — only if you outgrow free limits |
| Vercel Pro (only if traffic exceeds free tier) | ~₹1,700/mo ($20) — very unlikely for a local tuition centre |

The only certain cost is the **domain: ~₹700–1,500/year**, which you're buying.

---

## Part 3 — Security

Honest note first: nothing on the internet is 100% "unhackable" — but this
architecture is about as safe as a website can be, because **there is almost
nothing to hack**:

- **No server, no database** — the site is static files on Vercel/Netlify's
  CDN. There's no login system, no stored user data, no SQL to inject.
- **HTTPS everywhere** — automatic certificates; traffic can't be intercepted.
- **The register form stores nothing** — it opens WhatsApp on the visitor's
  own phone. No personal data ever touches the website. (This is a real
  privacy advantage.)
- **Admin protected by managed auth** — with Decap CMS the login is GitHub /
  Netlify Identity with 2FA. Turn on 2FA and the admin is protected by the
  same infrastructure that protects millions of repos.
- **DDoS/attack absorption** — Vercel/Netlify/Cloudflare sit behind global
  CDNs that absorb attack traffic as part of the service.

Practices to keep it that way:

1. Enable **2FA** on GitHub, Vercel/Netlify and the domain registrar.
2. Use a strong unique password for each (password manager).
3. Never commit secrets/API keys to the repo (there are none today).
4. Run `npm audit` / update dependencies every few months.
5. If a custom admin (Supabase) is added later: use its managed auth,
   Row-Level-Security policies, and rate limiting — never roll your own login.

---

## Part 4 — GitHub Pages demo (already set up ✅)

The repo now contains `.github/workflows/deploy-pages.yml`. To put the demo
live for clients:

1. Create a repository on github.com (private repos work with Pages on paid
   plans; use a **public** repo for free Pages, or Netlify free for private).
2. Push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → "GitHub Actions"**.
4. Every push to `main` auto-builds and deploys to
   `https://<your-username>.github.io/<repo-name>/`.

The build is already sub-path aware (assets, router and images all adapt), and
`/about` works on refresh via the 404 fallback. When you later move to Vercel
with the real domain, nothing needs to change — the same repo deploys there
with zero config.

### Troubleshooting: "Multiple artifacts named github-pages were unexpectedly found"

This means **two** things tried to deploy Pages on the same push. Almost always
the fix is the Source setting:

- **Settings → Pages → Build and deployment → Source → "GitHub Actions".**
  If Source is "Deploy from a branch", GitHub *also* runs its own built-in
  `pages-build-deployment` builder, which collides with this workflow. Switch
  to "GitHub Actions" so only this workflow runs, then re-run it from the
  **Actions** tab.
- Also confirm `.github/workflows/` has no second Pages file (e.g. a
  `static.yml` GitHub may have added from a UI template). This repo ships only
  `deploy-pages.yml`; delete any other one.

(The "Node.js 20 is deprecated" line in the logs is only a warning from
GitHub's own actions and is safe to ignore — it does not fail the build.)

---

### Suggested roadmap

1. **Now** — push to GitHub → demo link for clients (free).
2. **Launch** — buy domain → connect Vercel (free) → go live.
3. **Phase 2** — add Decap CMS admin (~1–2 days work, still free).
4. **Phase 3 (only if needed)** — custom admin with Supabase when you want
   stored enquiries, student portals or online payments.
