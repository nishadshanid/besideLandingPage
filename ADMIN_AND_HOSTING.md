# Beside Learning — Hosting & Admin Guide

## How the site runs

| Piece | Where | Cost |
|---|---|---|
| Website | Cloudflare Pages project **besidelandingpage**, built from `main` | ₹0 |
| Domain | **besideeducation.com** on Cloudflare Registrar (`www` redirects to it) | ~US$10–27/yr |
| Email | `info@besideeducation.com` → forwarded to the Beside Gmail (Cloudflare Email Routing) | ₹0 |
| Admin login | Cloudflare Access (Zero Trust free plan, up to 50 people) | ₹0 |
| Admin saving | Cloudflare Pages Functions in `functions/api/` commit to this GitHub repo | ₹0 |

Every push to `main` rebuilds the site in about a minute. A copy also still
deploys to GitHub Pages (`nishadshanid.github.io/besideLandingPage`) through
`.github/workflows/deploy-pages.yml`; that copy has no working admin.

## Editing the site (for admins)

1. Open **https://besideeducation.com/admin**.
2. Enter your email, then the 6-digit code Cloudflare emails you.
3. Pick a section on the left (Posters, Reels, FAQ…), make changes.
   Sections with unpublished changes show an orange dot.
4. Press **Publish**. The website updates about a minute later — the page tells
   you when it's live.
5. **History** lists every publish. **Restore** brings back an older version
   (it is published as a new change, so nothing is ever lost).

Images are resized in the browser before upload (posters, reel covers, mentor
photos). Reels with a **cover image** load a picture instead of the heavy
Instagram player, which makes the home page faster.

If two admins edit at once, the second one to publish is asked to reload — no
one's work is silently overwritten.

## Enquiries (Register form + WhatsApp buttons)

When a visitor sends the **Register** form, WhatsApp opens as before and the
details (name, phone, class, board, message) are also saved:

- in the admin page → **Enquiries** (first item in the sidebar): mark each one
  *New / Contacted / Joined / Not interested*, add notes, call or reply on
  WhatsApp, search, **Download CSV**, delete;
- as a new row in the **Google Sheet** (if connected).

Clicks on the "Chat on WhatsApp" buttons (top of page, floating button, contact
box) are only **counted** per day — those buttons don't ask for a name or number.

Spam protection: hidden bot field, minimum time on page, max 5 form sends per
visitor per hour, and the same phone number within 30 minutes is saved once.
Visitor IP addresses are never stored (only a salted hash for the hourly limit).

Setup (once):
1. Cloudflare → **Storage & databases → D1 → Create** a database named `beside`.
2. **Workers & Pages → besidelandingpage → Settings → Bindings → Add → D1
   database**: variable name `DB`, database `beside`. Tables are created
   automatically on first use.
3. Google Sheet (optional): follow the steps at the top of
   `docs/google-sheet-script.gs`, then add Production secrets
   `SHEET_WEBHOOK_URL` (the web-app URL) and `SHEET_SECRET` (same text as in the
   script).
4. **Deployments → Retry deployment**.

## Adding or removing an admin

Both lists must contain the email:

1. **Cloudflare Zero Trust → Access → Applications → Beside admin → Policies**:
   add/remove the email in the *Allow* rule.
2. **Workers & Pages → besidelandingpage → Settings → Variables and Secrets →
   `ADMIN_EMAILS`**: e.g. `official.beside@gmail.com=Beside, anjali@gmail.com=Anjali`.
   The name after `=` is what appears in the edit history (instead of the email).
   Then **Deployments → latest → Retry deployment** so the change takes effect.

## One-time setup (already done once; keep for reference)

Production variables on the Pages project (Settings → Variables and Secrets,
**Production** only, so preview builds have no write access):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` (secret) | Fine-grained GitHub token: only this repo, *Contents: Read and write* |
| `GITHUB_REPO` | `nishadshanid/besideLandingPage` |
| `GITHUB_BRANCH` | `main` |
| `ADMIN_EMAILS` | see above |
| `ACCESS_TEAM_DOMAIN` | `<team>.cloudflareaccess.com` |
| `ACCESS_AUD` | *Application Audience (AUD) tag* of the Access application |

Cloudflare Access application (self-hosted): domains
`besideeducation.com/admin` and `besideeducation.com/api`, login method
**One-time PIN**, one *Allow* policy with the admin emails.

The API checks the Access token and the email list itself too, so the admin
stays locked even if the Access application is misconfigured.

**Renew the GitHub token before it expires** (GitHub emails a reminder) and
paste the new one into `GITHUB_TOKEN`.

## Where things live in the code

- `content/site.json` — all editable content (what the admin changes).
- `shared/schema.js` — the shape of that content; draws the admin forms and
  validates every save.
- `src/data/content.js` — feeds `site.json` to the page components.
- `src/admin/` + `admin/index.html` — the admin page (a separate bundle; never
  loaded by visitors).
- `functions/api/` + `server/` — the admin API (Cloudflare Pages Functions).
- `public/uploads/` — images uploaded from the admin.
- `public/_headers` — security headers (strict rules for `/admin`).

## Local development

```bash
npm install
npm run dev            # public site + admin UI on http://localhost:5173
```

To try saving locally, create `.dev.vars` (never commit it):

```
GITHUB_TOKEN=<a token for a test repo or branch>
GITHUB_REPO=<owner/repo>
GITHUB_BRANCH=<a test branch>
ADMIN_EMAILS=you@example.com=You
DEV_ADMIN_EMAIL=you@example.com
```

then `npm run build && npm run dev:api` and open http://localhost:8788/admin/.
`DEV_ADMIN_EMAIL` skips the Cloudflare login and only works on localhost —
never set it in Cloudflare.
