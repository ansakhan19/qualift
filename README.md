# Qualift — Fair Fares Application Readiness MVP

A Next.js app that walks NYC residents through Fair Fares eligibility, document collection, and application preparation — with magic link progress saving so users can return across devices.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Open `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | Free at [resend.com](https://resend.com) — verify your domain first |
| `EMAIL_FROM` | A verified sender address in your Resend account |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local, your domain in production |
| `TOKEN_SECRET` | Run `openssl rand -hex 32` in terminal |

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Add your `.env.local` variables in the Vercel dashboard under **Settings → Environment Variables**.

> **Note:** `better-sqlite3` (the database) writes to a local file (`qualift.db`). On Vercel's serverless platform, this file doesn't persist between deployments. For production, swap `lib/db.js` to use [Vercel Postgres](https://vercel.com/storage/postgres) or [Supabase](https://supabase.com) — the query interface stays the same.

---

## App structure

```
app/
  page.js                  → Splash + eligibility screening
  dashboard/page.js        → Progress dashboard (Duolingo-style)
  docs/page.js             → Document collection
  review/page.js           → Readiness review (Stage 6)
  walkthrough/page.js      → Application field walkthrough (Stage 8)
  guide/page.js            → Submission guide + HRA link (Stage 9)
  auth/verify/page.js      → Magic link landing
  api/
    send-magic-link/       → POST — creates session, sends email
    verify-token/          → GET  — validates token, restores progress
    save-progress/         → POST — syncs progress to database

components/
  Splash.jsx               → Home screen + returning user entry
  EligibilityFlow.jsx      → 6-question screening + 4 outcome paths
  SaveProgress.jsx         → Email capture (fires after first positive signal)
  Dashboard.jsx            → Stage tracker with doc pills
  docs/DocCollection.jsx   → Full doc checklist (intl + domestic paths)
  docs/guides/GuideShell.jsx → Reusable guide screen wrapper
  walkthrough/AppWalkthrough.jsx → 6-section (intl) or 5-section (domestic) form
  ReadinessReview.jsx      → Pre-application summary
  SubmissionGuide.jsx      → Reference card + HRA ACCESS link

lib/
  fpl.js                   → FPL thresholds — UPDATE EACH JANUARY
  db.js                    → SQLite session storage
  email.js                 → Resend magic link sender

store/
  ProgressContext.jsx      → React context — syncs to localStorage + backend
```

---

## Annual maintenance

**Every January**, update `lib/fpl.js` when HHS publishes new poverty guidelines:
- Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
- Update `FPL_YEAR` and the `FPL` object values
- The eligibility check and all UI references pull from this single file

---

## User flow

```
Splash
  ↓ new user                         ↓ returning user (email → magic link)
Eligibility screening (6 questions)  Magic link landing → Dashboard
  ↓ Q1 yes → Save progress prompt
  ↓ Continue screening
  ↓ Eligible → Dashboard
      ↓
  Document collection (intl or domestic path)
    ├─ All income branches (pay stub, finaid, benefits, unemployment, zero income)
    ├─ I-20 guide (intl) or SSN guide (domestic)
    └─ No-income screening (2-question funnel before zero-income)
      ↓ all docs collected
  Readiness review
      ↓
  Application walkthrough (pre-filled fields, 6 or 5 sections)
      ↓
  Submission guide → HRA ACCESS portal
```

---

## Not-yet-built (post-MVP)

- Gig/freelance income guide (currently routes to chat)
- Family support income guide
- PDF generation for zero-income self-attestation letter
- Push/email reminders for users stuck on document collection
- Analytics on where users drop off
