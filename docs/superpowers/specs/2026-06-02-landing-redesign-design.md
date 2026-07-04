# Loopy — Landing Page Redesign (Design Spec)

**Date:** 2026-06-02
**Branch:** `experiment/crazy-shit`
**Status:** Awaiting user review

## 1. Goal

Rebuild the landing page to do two things better than anything else:

1. **Communicate clearly** what Loopy is and how it helps.
2. **Convert** — funnel every visitor to one action.

Secondary: feel award-winning (premium, fun to scroll) **without** letting cool
visuals hurt the message. Every interactive moment must sell a value-prop point,
not just decorate. Premium here = restraint + a few unforgettable beats.

### Success criteria

- A founder understands what we sell in **under 5 seconds** above the fold.
- One dominant action: **Book a pilot call**. Email capture is the soft fallback.
- The page is ~40% shorter than today (6 sections, not 10), nothing is filler.
- The same asset never appears in more than one section (kills current Zoom repetition).
- Load < 2s; everything below the fold lazy-loads. Fully a11y + reduced-motion safe.

## 2. Locked positioning decisions

| Decision | Choice | Why |
|---|---|---|
| What we sell | **Hybrid: done-for-you, powered by our software.** Lead with the outcome; show the batch engine as proof of *how*. | Resolves today's service-vs-tool ambiguity. |
| Primary CTA | **Book a pilot call** (Cal.com, instant booking). Email = secondary fallback. | YC: talk to users; let demos be booked immediately, no callback. Fills pilot seats with real conversations, not a cold list. |
| Audience / awareness | Write for the **cold, problem-aware** founder; layer proof that satisfies the warm network. | Traffic = mix of cold LinkedIn DMs + warm referrals. |
| Hero direction | **B — centered editorial** ("Meta ads, run for you"), made premium, with strengthened above-the-fold proof. | User-selected. |
| Pricing section | **Omitted** for v1. Price surfaces on the call. | Pre-launch DFY pilot; a tiered pricing table doesn't fit yet. |

### Booking + data
- **Booking:** Cal.com embed → `https://cal.com/lucent-wu/15min`.
- **Email fallback:** must actually persist (today's form saves nothing). Capture via **Resend or Loops**. Add loading / error / duplicate states.

## 3. Information architecture — 6 sections, 6 moments

YC's formula backbone (Hero → Problem→Transformation → How It Works → Social
Proof → FAQ → CTA), tightened. Each section carries **one signature interaction**.

| # | Section | Merges | Signature moment |
|---|---------|--------|------------------|
| 01 | **Hero** — "Meta ads, run for you" | — | **Batch Cascade**: one reference ad fans into 8 on-brand variations on load |
| 02 | **Why nothing else works for SaaS** | Problem + Compare | **The Resolve**: competitor columns fill with ✗ on scroll; BYA column lights electric-blue ✓ |
| 03 | **How it works — the engine** | (keep pipeline) | **Scrollytelling spine**: sticky rail scrubs Learn→Angles→Batch→Ship→Read; batch stage "generates" live |
| 04 | **Real output, real founders** | Showcase + Pilot proof | **The Living Wall**: slow infinite, draggable marquee of multi-brand ads |
| 05 | **Objections, answered** | (trim FAQ) | crisp, fast accordion — restraint reads as premium |
| 06 | **Book a pilot call** | (Manifesto word-reveal moves here) | **The Sign-off**: value-prop reveals word-by-word, one blue button |

### YC-formula upgrades folded in
- **Nav stripped to logo + single CTA** (1:1 attention ratio; remove competing paths).
- **Hero subhead = YC outcome formula** ("*Outcome* for *[ICP]* without *[pain]*").
- **Real above-the-fold trust strip** (Startmate / University of Melbourne / accelerator-backed + "2 funded SaaS teams, shipping daily"). Real signals only.

## 4. Section detail

### 01 — Hero (direction B, centered)
- **Eyebrow:** `done-for-you meta ads · for b2b saas`
- **Display headline:** `Meta ads, run for you.` ("run for you" in electric blue, keep the sheen).
- **Subhead (YC formula, literal):** *"More trial signups for B2B SaaS — without touching your ad account, hiring an agency, or opening Canva. We learn your product, batch the creative, and run it on Facebook & Instagram."*
- **Primary CTA:** `Book a pilot call →`  ·  **Secondary:** `or join the waitlist` (opens inline email).
- **Risk-reducer micro:** `first month free · 30 ads on us · no card required`.
- **Trust strip (above fold):** live dot + `Running ads right now for 2 funded B2B SaaS teams` · `Startmate & Melbourne-backed`.
- **Signature — Batch Cascade:** on load, the reference creative animates into the
  8-variation grid (the USP, shown before a word is read). Reduced-motion: render
  the grid statically. SSR-safe (deterministic first paint, animate after mount).

### 02 — Why nothing else works for SaaS (Problem + Compare merged)
- Keeps the three honest verdicts (agency / freelancer / DIY) but resolves them
  into the BYA comparison in **one** beat instead of two sections.
- **The Resolve:** as the section enters, the three competitor columns fill with ✗
  across the capability rows; the BYA column fills with ✓ and lights blue last.
- Copy carries today's Compare rows (SaaS funnels not ecommerce, full batch at once,
  optimizes for signups not ROAS, live in ~90s, flat monthly).

### 03 — How it works (the engine)
- Keep the scroll-driven 5-stage pipeline (the strongest existing asset).
- **Each stage gets a distinct visual** (no shared Zoom grid):
  Learn (analyzed brand kit) → Angles (AnglePicker) → **Batch** (live generate) →
  Ship (Meta placement preview) → Read (winner + why + fresh variations).
- Uses the **worked-example brand** (see §5) so the story is "this is what we'd do for *you*."

### 04 — Real output, real founders (Showcase + Pilot merged)
- **The Living Wall:** slow infinite marquee (1–2 rows, opposing directions),
  draggable, of real on-brand ad creatives across recognizable SaaS brands —
  proves *range*, not one lucky template.
- **Brands (biggest first):** Slack, Notion, Asana, Monday.com, ClickUp, Zapier,
  Grammarly, Mailchimp, Gusto, Kinsta (3–4 ads each in `~/Downloads/creatives`).
- **Honesty guardrail:** framed as *"creative our engine generates, in the style of
  brands you know"* — a quality/range demo. **Never** implied as clients or
  endorsements (consistent with how the Zoom set is already labeled).
- Paired with the **two live pilots** (anonymous until the data is) + a real founder
  quote when available — the believable proof beat.

### 05 — Objections, answered (trimmed FAQ)
- 4–5 questions that actually block the sale: is it really done for me? · price /
  commitment · why SaaS-only · what I need to provide · when do seats open.
- Quiet, fast accordion. One-sentence answers.

### 06 — Book a pilot call (final CTA + Manifesto sign-off)
- **The Sign-off:** the Manifesto value prop ("We learn your product. Write the
  angles. **Batch the creative.** Run the ads. Tuned for trial signups — not
  add-to-carts.") reveals word-by-word as the closing line.
- Big type, the one blue **Book a pilot call** button (Cal.com), email fallback.
- Risk reversal repeated: first month free · no card · seats released in waves.

## 5. Asset strategy

- **Worked-example brand (hero + how-it-works through-line):** v1 uses **one real
  library brand** (recommend Slack or Notion — 4 ads each) as the consistent
  example. The "we read your site → kit" visual shows that brand's analyzed
  positioning/palette. Coherent, **no new asset generation required**.
- **Living Wall:** the remaining ~9 brands provide range.
- **Phase 2 (optional):** a purpose-built **fictional demo SaaS** with a
  hand-defined brand kit, threaded through hero + pipeline, to simulate "put in
  your own SaaS" end-to-end. Deferred because it requires generating that brand's
  ad batch; v1 ships on the real library.
- Assets copied into `/public/creatives/<brand>/ad-0N.jpg`, pre-optimized (~760px),
  served via `next/image` with explicit `sizes`. Catalogue lives in a `lib/` module
  like today's `demoAds.ts`.

## 6. Brand & visual language

- **Unchanged tokens:** cream paper `#f4efe6`, ink `#0a0a0a`, one electric blue
  `#1a3df0`, DM Sans, modest radii, borders > shadows. One signal color per screen.
- **Motion:** one easing curve; scroll-reveal + sheen as today. Nothing scrolls
  sideways; no auto-advancing carousels (YC don't). Every effect degrades to its
  final static state under `prefers-reduced-motion` and without `animation-timeline`.
- Keep Lenis smooth-scroll island (SSR-safe, no-ops under reduced motion).

## 7. Non-functional requirements

- **Performance:** LCP image (hero) prioritized; everything below the fold
  lazy-loads; target < 2s. Compress all creatives.
- **Accessibility:** visible/visually-hidden `<label>` on the email input (today
  it's placeholder-only); focus-visible rings; reduced-motion paths; alt text on
  every creative.
- **SEO / sharing:** full `metadata` in `app/layout.tsx` — title, description,
  canonical, and an **OpenGraph image** (the page's real distribution channel is
  founder DMs/Slacks; the OG card must sell).
- **Analytics:** Vercel Analytics + events on `book_call_click`, `waitlist_submit`
  (success), and section-in-view — so CRO is measurable. Test one element/week.
- **Engineering:** Next.js App Router, Server Components by default, `'use client'`
  only on interactive islands; CSS Modules + tokens; keep components small and
  single-purpose. Read the in-repo Next.js docs before writing framework code
  (per AGENTS.md — this Next.js has breaking changes vs training data).

## 8. Out of scope (v1)

- Pricing/tiers section. Fictional demo brand (phase 2). Self-serve signup/trial
  (the CTA system is built so it can later swap "Book a pilot call" → "Start free
  trial" with no redesign). Blog/docs/other routes.

## 9. Open items

- Confirm the **worked-example brand** (Slack vs Notion vs other).
- Email provider: **Resend vs Loops** (both fine; pick one for keys).
- Final FAQ copy (the 4–5 questions) — draft during implementation, you approve.
