# BetterYourAds Landing Page — Elevation Pass

**Date:** 2026-06-01
**Status:** Draft — awaiting review

## Summary

Elevate the existing BetterYourAds landing page so it reads as **craft-grade to
senior web developers**, feels **interactive**, and **converts harder** — without
drifting off-brand. The visual system stays exactly as defined in
`styles/tokens.css`: cream paper, ink, **one** electric blue used sparingly,
DM Sans, borders over shadows, one easing curve. This is a polish + interaction +
CRO pass, **not** a redesign and **not** a re-platforming. No Tailwind, no shadcn
(deliberately dropped in `cf98dac`), still static-deploy on Vercel with no backend.

The "wow" comes from *how it's built* — native scroll-driven animation, a lean
bundle, accessibility done right — and from motion that **earns its place** by
either communicating value or steering the eye to the CTA.

## Goals & non-goals

**Goals**
- Impressive to senior devs: native `animation-timeline`, `@property`, modern HTML
  (`<details name>`), full `prefers-reduced-motion` support, tiny bundle, no jank.
- Interactive: the hero demo responds to the visitor; charts/numbers animate on
  scroll; CTAs feel alive; FAQ + angle-pickers respond to input.
- High CRO: clearer value-at-a-glance, eye guided to "join the waitlist", the ask
  always within reach, a delightful conversion moment.
- Communicate value **visually**: the optimize chart, the interactive demo, and the
  step-flow do the explaining.

**Non-goals (YAGNI)**
- No backend, database, email provider, API route, or real waitlist persistence.
- No real site-scraping of the visitor's URL (impossible client-side; see Honesty).
- No new routes/pages, no analytics, no auth.
- No fabricated social proof or metrics (see Honesty constraints).

## Brand & honesty constraints (non-negotiable)

- **Color:** cream/ink + exactly one signal blue per screen. New effects reuse
  `--accent`, `--fg`, `--border`, `--bg-raised`. No new hues, no gradients beyond
  what already exists in the demo canvas.
- **Surface language:** borders and hairlines over shadows; modest radii; the
  existing single easing curve `--ease` and duration tokens.
- **Restraint:** motion is "balanced — alive but editorial." Reveals are subtle,
  one-pass (not looping) except the existing live-dot pulses. If an effect competes
  with the copy, it loses.
- **Honesty (confirmed with owner):**
  - No "built by Melbourne founders" claim.
  - No waitlist count / momentum number (only 2 pilots exist).
  - "Startmate-backed" stays a description of a *pilot customer* only — never a BYA
    badge.
  - The only proof shown is real: 2 pilots, running live on Meta, shipping daily,
    B2B SaaS. Carried by the (elevated) `PilotProof` section.
  - The example figures in `OptimizeChart` remain framed as a **product dashboard
    illustration** ("this week · trial signups by angle"), not aggregate results.
  - The interactive hero is framed as a **preview** — it personalizes the visitor's
    URL + favicon + a decorative derived accent; it does not claim to have analyzed
    their live site.

## Decisions

| Decision | Choice |
|---|---|
| Motion intensity | Balanced — alive but editorial |
| Animation tech | Hybrid: native CSS-first; `motion` library only for genuine spring moments |
| New runtime dependency | `motion` (maintained successor to framer-motion), client-only, dynamically imported. Exact package/version confirmed from `node_modules` at implementation time per `AGENTS.md`. Confetti hand-rolled (no extra dep). |
| Hero demo | Keep autoplay loop as default/fallback; add **interactive-on-demand**: visitor types a domain → demo re-runs personalized |
| Credibility strip | **Dropped** (nothing honest to populate it) — elevate `PilotProof` instead |
| Number-tickers | Only in honest contexts: `OptimizeChart` (product demo) + hero demo |
| Styling | Existing CSS Modules + `tokens.css`; extend tokens with a clearly-commented motion block |
| RSC posture | Sections stay Server Components; interactivity isolated to small `"use client"` islands |

## Architecture

Static-first, RSC by default. Interactivity is quarantined into small client
islands so the page stays mostly server-rendered and the JS bundle stays lean.

**Animation strategy, by mechanism:**
- **Native CSS scroll-driven** (`animation-timeline: scroll()` / `view()`,
  `@property` for animatable custom props) for: scroll-progress bar, section
  reveals, bar-chart fills, border-beams, the step-flow beam, accent sheens.
  No scroll event listeners. Fallback: content is visible by default when
  `animation-timeline` is unsupported. Disabled under `prefers-reduced-motion`.
- **`motion` (spring physics), client-only, dynamically imported** for: the
  magnetic CTA, and (optionally) the spotlight follow. Loaded only on the client,
  never in RSC, so it doesn't touch first paint.
- **Tiny bespoke hooks** for: number count-up on in-view (IntersectionObserver +
  `requestAnimationFrame`, reduced-motion → jump to final), scroll-aware nav +
  active-link, sticky-CTA visibility, favicon-driven hero personalization.
- **Hand-rolled canvas confetti** (self-contained, no dep) for the conversion
  moment; no-ops in test/jsdom and under reduced-motion.

**Reduced motion is a first-class path, not an afterthought:** a single
`@media (prefers-reduced-motion: reduce)` block neutralizes reveals/beams/sheens to
their final state; JS effects check `matchMedia` and render the end state directly.

## Global craft layer

1. **Scroll-progress hairline** — 2px `--accent` bar fixed at top, width driven by
   `animation-timeline: scroll(root)`. Pure CSS, added in `layout.tsx` + `globals.css`.
2. **Section reveals** — a `.reveal` utility (blur + translateY → resolved) driven by
   `animation-timeline: view()`; applied to section heads and staggered children.
   Pure CSS, fallback-visible, reduced-motion-safe.
3. **Scroll-aware nav** — small client island: cream backdrop-blur + hairline border
   appears once scrolled past the hero; the in-view section's nav link gets the blue
   active state (IntersectionObserver over section ids).
4. **Motion tokens** — extend `tokens.css` with a commented block: reveal duration,
   reveal distance/blur, beam duration, and `@property` registrations.

## Section-by-section

**Nav** — scroll-aware island (above). Primary CTA becomes the **magnetic button**.

**Hero** — keep the `LiveDemo` autoplay loop. Add an **interactive mode**:
- The existing URL row becomes a real, focusable input (it currently animates a
  fixed `clickup.com`). On submit/Enter with a plausible domain, the phase machine
  re-runs personalized to that domain.
- **Honest personalization:** echo the typed domain in the chrome + URL row; fetch
  the domain's favicon (`https://www.google.com/s2/favicons?domain=…`) to place a
  real brand mark in the mock ad, with graceful fallback to a monogram (first letter
  + decorative derived accent) if it fails; the audit/customer/concept feed lines
  stay clearly illustrative.
- Untouched → keeps looping the scripted `clickup.com` demo exactly as today.
- Derivation logic (domain → monogram, domain → decorative accent hue) extracted as
  **pure functions** in `liveDemoMachine.ts` and unit-tested.
- Headline: the "run for you" accent gets a **one-pass sheen** on load (not looping).
- Hero waitlist CTA: magnetic button.

**PilotProof (elevated — now the proof anchor)** — cards get a restrained
**spotlight-on-hover** (faint `--bg-raised` radial that follows the pointer via a CSS
var; border goes ink) and a single blue **border-beam** that travels the border once
on reveal. The "shipping daily" live dot pulse stays. Reinforces the only real proof.

**Problem** — the three "bad option" cells stagger in on reveal; on hover the verdict
line dims/strikes to reinforce "none of these work." Subtle; copy stays the star.

**HowItWorks (primary value-comms)** —
- An **animated beam** hairline draws 01 → 02 → 03 as the section scrolls into view
  (the learns → launches → optimizes flow). Pure CSS scroll-driven.
- **OptimizeChart** becomes the centerpiece: bars fill from 0 → their pct on
  scroll-in; signup counts and the "127 signups · $2,841 mrr" foot **count up**
  (number-ticker hook). Winner (blue) bars emphasized. This visually *is* the pitch:
  "we shift spend toward what drives signups."
- Step 02's angle radios become **clickable** (select an angle; the selection state
  updates). Small interaction reward; no data persistence.

**Compare** — rows stagger in; the "betteryourads" column cells get a one-pass blue
underline draw and a row-hover highlight, sharpening them-vs-us at a glance.

**Pricing** — the featured "scale" card gets the **border-beam** + spotlight to pull
the eye to the recommended plan. Prices stay static (count-up on price reads cheap).
The waitlist-offer banner CTA + card CTAs use the standard button; primary CTAs may
use the magnetic variant.

**FAQ** — keep native `<details>` (zero-JS). Add `name="faq"` for native accordion
exclusivity (one open at a time), animate open via `grid-template-rows: 0fr → 1fr`
(pure CSS, no height JS), rotate "+" → "×". Reduced-motion → instant.

**FinalCta** — "shipping" accent sheen on reveal; **magnetic submit**; a **tasteful
brand-colored confetti** burst (ink/blue/cream) on successful submit, reduced-motion-
and test-safe.

**NEW — Sticky waitlist bar** — slim bottom bar (primary value on mobile; compact)
that appears after the hero scrolls out of view: one-line value + "join the waitlist
→". Client island using IntersectionObserver on the hero. Dismissible.

## New / changed files

**New**
- `components/ui/MagneticButton.tsx` (+ `.module.css`) — client; spring magnetic CTA,
  dynamically imports `motion`; falls back to a plain styled `<a>` pre-hydration.
- `components/ui/Counter.tsx` — client; count-up-on-in-view number-ticker.
- `components/ui/Spotlight` behavior — likely a small `useSpotlight` hook +
  CSS (no standalone component if a hook suffices).
- `components/StickyCta/StickyCta.tsx` (+ `.module.css`) — client; sticky waitlist bar.
- `components/Nav/NavScroll.tsx` (or a `useNavScroll` hook) — client; scroll-aware +
  active-link island used by `Nav`.
- `lib/confetti.ts` — self-contained canvas confetti util (no dep).

**Changed**
- `app/layout.tsx` — mount scroll-progress bar; mount `StickyCta`.
- `app/globals.css` — `.reveal` utilities, scroll-progress styles, reduced-motion
  block, stagger helpers.
- `styles/tokens.css` — commented motion block + `@property` registrations.
- `components/LiveDemo/LiveDemo.tsx` — interactive input + personalization; keep
  reducer/timeline; isolate new state cleanly.
- `components/LiveDemo/liveDemoMachine.ts` — add pure helpers (domain → monogram,
  domain → decorative accent, domain validity); keep existing exports/tests intact.
- `components/HowItWorks/OptimizeChart*` — animated fills + counters.
- `components/HowItWorks/HowItWorks*` — step beam; clickable angle radios (small
  client island for the picker).
- `components/PilotProof/*`, `components/Compare/*`, `components/Pricing/*`,
  `components/Problem/*`, `components/Faq/*`, `components/FinalCta/*` — reveal classes,
  hover/spotlight/border-beam, FAQ accordion animation, sheens.
- `components/ui/WaitlistForm.tsx` — fire confetti on `done` (guarded); optional
  magnetic submit.
- `components/Nav/Nav*` — integrate scroll-aware island + magnetic CTA.

## Testing & verification

- `npx tsc --noEmit` — clean.
- `next lint` — clean (fails on unused vars/imports — keep that bar).
- `vitest run` — existing `liveDemoMachine.test.ts` and `WaitlistForm.test.tsx` stay
  green; add unit tests for the new pure helpers (domain → monogram/accent/validity)
  and the counter easing/format math. Confetti guarded to no-op under jsdom so the
  WaitlistForm test is unaffected.
- `next build` — succeeds.
- **Manual:** run `next dev`, screenshot hero / how-it-works / pricing / final-cta,
  verify the interactive demo, the chart animation, and the CTAs; then re-check with
  `prefers-reduced-motion: reduce` to confirm everything degrades to a static,
  legible page. Confirm bundle didn't balloon (Motion is client-only/dynamic).
- **Brand check:** one blue per screen, borders-over-shadows intact, no new hues,
  copy unchanged in meaning.

## Risks & mitigations

- **Scroll-driven CSS browser support** — progressive enhancement: unsupported →
  content simply shows (no animation). No functionality depends on it.
- **Motion bundle creep** — dynamically imported, client-only, scoped to 1–2
  interactions; verified in `build` output. Cut to CSS if any effect doesn't need it.
- **Favicon fetch failure / slow** — graceful monogram fallback; fetched only on
  submit, not per keystroke.
- **Over-animation** — single reduced-motion kill-switch; reveals one-pass; effects
  reviewed against copy. Anything that distracts gets cut.
- **Honesty drift** — proof limited to real facts; example dashboards labeled as
  product illustrations; hero framed as a preview.

## Build order (for the implementation plan)

1. Foundation: motion tokens, `.reveal` + reduced-motion in `globals.css`, scroll-
   progress bar. (Visible craft, low risk, unblocks everything.)
2. Section reveals + Compare/Problem/Pricing/PilotProof hover & border-beam & sheens.
3. Value-comms: `OptimizeChart` animation + `Counter`; HowItWorks step beam +
   clickable angles.
4. Hero interactive demo + pure helpers + tests.
5. Magnetic CTA (`motion`), scroll-aware nav + active link, sticky CTA.
6. FAQ accordion polish; FinalCta sheen + confetti.
7. Verify: tsc / lint / vitest / build / dev-server screenshots / reduced-motion.
