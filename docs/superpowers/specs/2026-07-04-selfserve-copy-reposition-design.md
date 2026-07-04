# Landing copy reposition: done-for-you → self-serve product (2026-07-04)

## Why

Loopy is no longer *fully* done-for-you. The platform now lets users create ads,
connect their Meta ad account, and see insights themselves. The landing page,
however, still sells "fully done for you" everywhere and converts to a single
`book a pilot call`. This spec repositions the copy so the **product is the hero**
and human help is demoted to a **temporary early-access bonus**, without
overclaiming (the product is early) and without re-narrowing the audience.

## Positioning frame (decided)

- **Broaden the audience, narrow the problem.** Audience stays wide (any business
  running Meta ads). The *message* aims at the one problem we solve best:
  **creative fatigue.** Meta ads burn out fast; you need a constant stream of
  fresh creative. Loopy's batch-generation USP (one reference into endless
  on-brand variations) is the machine that fixes it. "More paying customers" is
  the payoff underneath, not the headline.
- **Product is the main selling point.** Software that learns your brand, batches
  fresh on-brand ads whenever you need them, launches to Meta, and shows what's
  winning. You run it, you own the account, you keep the learnings.
- **The call is reframed as the "get early access" gateway.** It routes to the
  same Cal booking (`loopy/20min`), which is the only wired conversion action
  today. This also drives the founder conversations we want for validation/data.
- **Team help = a small, temporary early-access perk**, not our identity. We do
  NOT brand ourselves as "a team that supports you." We avoid getting boxed into
  a high-touch-service position we'll want to grow out of once self-serve +
  pricing ship.
- **Audience stays broad.** Any business that runs Meta ads (B2B software, apps,
  ecommerce, DTC). Do NOT re-narrow to "B2B SaaS." (`CLAUDE.md` and the
  `WhySaas/` folder name are stale on this; CLAUDE.md line gets corrected here.)
- **Voice shift:** where current copy says "we do X for you" (implying humans),
  move to "Loopy does X" or "you do X in a click," so the page reads self-serve.
- **No em dashes** in rendered copy (house rule).

## Already done in this branch (not copy, for the record)

- Favicon: real logomark wired via `app/icon.png`; placeholder `favicon.svg` and
  metadata override removed. Verified (build emits `/icon.png`).
- Booking link: `lucent-wu/15min` → `loopy/20min`; namespace `15min` → `20min`
  in `BookCallButton.tsx`, `StickyCta.tsx`, test, and `.env.local.example`. Hero
  micro "15-minute" → "20-minute". Verified (tsc + test pass).

## Copy changes (old → new)

### Global CTA label standardization
Primary CTA label everywhere becomes **`get early access ↗`** (from
`book a pilot call ↗`).

### `app/layout.tsx` (metadata / tab + SEO)
- `TITLE`: `loopy · meta ads, run for you`
  → `loopy · never run out of meta ad creative`
- `DESCRIPTION`: `Done-for-you Meta ads that bring your business more paying
  customers. We learn your product, create the ads, and run them on Facebook and
  Instagram.`
  → `Creative fatigue kills Meta ads. Loopy learns your brand and batches fresh
  on-brand ads whenever you need them, launches them on Facebook and Instagram,
  and shows you what's winning. More paying customers, no agency. You run it, you
  own the account.`
  (JSON-LD Organization/WebSite descriptions derive from this const, so they
  update automatically.)

### `components/Nav/Nav.tsx`
- Header CTA children `book a call ↗` → `get early access ↗`
- Nav links unchanged (`why loopy`, `how it works`, `the loop`, `faq`).

### `components/Hero/Hero.tsx`
- Eyebrow: `done-for-you meta ads · for businesses that run them`
  → `fresh meta ad creative, automated · for businesses that run them`
- H1: `Meta ads, run for you.` (accent on "run for you")
  → `Never run out of Meta ad creative.` (accent on **Meta ad creative**)
- Subhead: `More paying customers for your business, fully done for you. We learn
  your product, create the ads, and run them on Facebook and Instagram.`
  → `Creative fatigue kills Meta ads. Loopy learns your brand and batches a fresh
  set of on-brand ads whenever you need them, launches them on Facebook and
  Instagram, and shows you what's winning. More paying customers, no agency. You
  run it, you own the account.`
  (bold/`subStrong` moves from "More paying customers" to **Creative fatigue
  kills Meta ads.**)
- Micro: `a 20-minute call · first month free, 30 ads on us · no card required`
  → `20 minutes with the founders · first month free, 30 ads on us · no card
  required` (keep `microPop` bold on "first month free, 30 ads on us")
- CTA label: inherits new default `get early access ↗`.
- TrustStrip: unchanged ("Running ads right now for 2 funded startups · One
  Startmate-backed, one accelerator-backed").

### `components/ui/BookCallButton.tsx`
- `DEFAULT_LABEL`: `book a pilot call ↗` → `get early access ↗`

### `components/ui/BookCallButton.test.tsx`
- Text matcher `/book a pilot call/i` → `/get early access/i` (link assertion
  already `loopy/20min`).

### `components/WhySaas/WhySaas.tsx`
- Section header + sub: unchanged (already comparison-based, broad, no DFY claim).
- Table columns unchanged (`typical agency` / `freelancer / DIY` / `loopy`).
  Rows unchanged. (The loopy column is already "built for paying customers" and
  wins on all five; the reposition doesn't weaken it.)

### `components/HowItWorks/HowItWorks.tsx`
Shift the "we do it for you" voice to "Loopy / you," and drop "fully done for you."
- Sub: `Five stages, about 90 seconds per ad, fully done for you. Tuned for what
  shows up in revenue, not your CTR column.`
  → `Five stages, about 90 seconds per ad. You drive, the software does the hard
  part. Tuned for what shows up in revenue, not your CTR column.`
- Stage 01 title `We read your site.` → `Loopy reads your site.`
  - desc `Drop your URL. We extract positioning, category, ICP, and palette in
    about twelve seconds...` → `Drop your URL. Loopy extracts positioning,
    category, ICP, and palette in about twelve seconds. No briefing call, no
    questionnaire.`
- Stage 02 title `We generate angles to test.` → `Angles, generated for you to
  test.`
  - desc: `One angle for each of the five stages of awareness. You don't guess
    which message lands...` → keep (already "you"-framed).
- Stage 03 title/desc: unchanged (`One reference. Unlimited on-brand
  variations.`); the line "This is the part agencies and DIY tools can't do."
  stays.
- Stage 04 title `We launch on Facebook & Instagram.` → `Go live on Facebook &
  Instagram in a click.`
  - desc `One click and the batch goes live as real Meta placements. No
    ad-account wrangling, no creative handoff.` → keep.
- Stage 05 title/desc: unchanged (`Your winning angle is customer research.` +
  weekly-read copy already "you"-framed). CTA link `watch it compound in the
  loop ↓` unchanged.

### `components/Loop/Loop.tsx`
- Section unchanged except the skip-the-line micro: `or book a pilot call and
  skip the line` → `or get early access and skip the line`.

### `components/RealOutput/RealOutput.tsx`
- Unchanged (reference library; no DFY claims). Honesty guardrail preserved.

### `components/Faq/Faq.tsx`
- Q `Is it really done for me?` → `Do I run the ads, or do you?`
  - A → `You run it. Loopy does the heavy lifting: it learns your brand, batches
    the ads, launches them, and shows you what's working. You keep control of
    your account and your data. And while we're in early access you also get us
    on a call whenever you want a hand, so you're never stuck.`
- Q `What is the optimization loop?` A → keep (already "in the works" framed).
- Q `What does it cost?` A: `...we'll walk through pricing on the pilot call.`
  → `...we'll walk through pricing when you get access.`
- Q `Who do you work with?` A: keep (already broad; good).
- Q `When can I start?` A: `We're running two pilots now and opening seats in
  waves. Book a call and we'll tell you the next opening.`
  → `We're in early access and opening seats in waves. Grab a call and we'll get
  you set up and tell you the next opening.`
- Q `How are you different from an agency or a freelancer?` A: keep (strong,
  already flat-price / unlimited / hours framing).
- Remaining FAQs: keep.

### `components/FinalCta/FinalCta.tsx`
- Eyebrow `book a pilot call` → `get early access`
- Headline `Stop guessing. / Start shipping.` → keep.
- CTA label: inherits new default `get early access ↗`.
- Micro: `no card required · seats released in waves · for meta advertisers`
  → `no card required · early access, seats in waves · for anyone running meta
  ads`

### `components/StickyCta/StickyCta.tsx`
- Copy: `Meta ads, run for you. First month free.`
  → `Never run out of Meta ad creative. First month free.`
- CTA: `book a pilot call →` → `get early access →`

### `CLAUDE.md` (stale doc fix)
- "Single-page marketing site for **Loopy** (done-for-you Meta ads for B2B SaaS,
  tryloopy.io)." → "Single-page marketing site for **Loopy** (self-serve Meta ads
  software for any business that runs Meta ads, tryloopy.io). Users create ads,
  connect their Meta account, and see insights; a founder call is the current
  early-access on-ramp."

## Out of scope (later)

- Pricing section / self-serve signup button (built separately; integrated later;
  the "get early access" call is the on-ramp until then).
- Renaming the `WhySaas/` folder (internal name only; not rendered).
- Historical `docs/superpowers/{specs,plans}/2026-06-02-*` records (kept as-is).
- Deleting `public/logo-mark.png` (old "B", dead) — optional cleanup, user's call.

## Verification

- `npx tsc --noEmit` clean.
- `npm test` green (BookCallButton label matcher updated).
- `npm run build` succeeds; `/icon.png` route present.
- Manual: load the page, confirm hero/eyebrow/CTA read as spec, tab shows the loop
  logomark (hard-refresh for favicon cache), and clicking any CTA opens the
  `loopy/20min` Cal modal.
