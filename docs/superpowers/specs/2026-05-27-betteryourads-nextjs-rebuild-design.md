# BetterYourAds Landing Page — Next.js Rebuild

**Date:** 2026-05-27
**Status:** Approved

## Summary

Rebuild the existing static HTML landing page (`legacy/index.html` + CSS) for
**BetterYourAds** ("Meta ads, built for B2B SaaS") as a scalable Next.js (App
Router) + TypeScript application. The visual design is already settled in
`legacy/` and must be reproduced faithfully; this project is purely a
stack/architecture migration, not a redesign.

Deployment target is **Vercel, static, no backend**.

## Decisions

| Decision | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Primary styling | Existing CSS design tokens + co-located CSS Modules |
| Secondary (demo) | One section rebuilt in Tailwind + shadcn/ui in a sample folder |
| Waitlist form | Client-only inline confirmation, no persistence, no backend |
| Fonts | `next/font/google`: **DM Sans only** (the marketing layer aliases `--font-mono` → `--font-sans`, so JetBrains Mono is never rendered) |
| `legacy/` | Kept in the repo, untouched, as reference |
| Hosting | Vercel static deploy (`next build`), no env vars, no API routes |

## Architecture

Static-first. Every section is a React Server Component **except** the two
genuinely interactive pieces, which are isolated `"use client"` components:

- **`LiveDemo`** — the animated ad-generator (`#ldg`). The vanilla-JS timeline
  is reimplemented as a `useReducer` phase machine driven by `useEffect`
  timers. Phases preserved exactly: `type → audit → customers → brand →
  concepts → render → shipped → cycle`. The phase-transition logic is extracted
  to a **pure reducer** so it can be unit-tested without the DOM/timers.
- **`WaitlistForm`** — shared client component. On submit it validates the
  email and swaps itself for the inline "you're on the list" confirmation.
  No network call. An `onSubmit` seam is left so a real endpoint can be wired
  in later without changing markup.

The FAQ accordion stays as native `<details>`/`<summary>` (zero JS). The
how-it-works "trial signups by angle" bar chart renders server-side from a
static data array (porting the `buildOptimizeRows` data).

## File structure

```
app/
  layout.tsx          # fonts, <head> metadata, imports global.css
  page.tsx            # composes sections in legacy order
  global.css          # @import "../styles/tokens.css" + page-level base
components/
  Nav/                Hero/                LiveDemo/
  PilotProof/         Problem/             HowItWorks/  (+ OptimizeChart)
  Compare/            Pricing/             Faq/
  FinalCta/           Footer/
  ui/                 # Button, Eyebrow, SectionHead, WaitlistForm
  # each component co-locates Component.tsx + Component.module.css
styles/
  tokens.css          # design-system custom properties, ported verbatim
public/
  logo-mark.png  favicon.svg  demo-clickup-ad.jpg   # grain.svg dropped (unreferenced)
samples/tailwind-shadcn/
  # Pricing section rebuilt with Tailwind + shadcn/ui, self-contained,
  # excluded from the page build, for format comparison only
docs/superpowers/specs/2026-05-27-betteryourads-nextjs-rebuild-design.md
README.md             # rewritten
.gitignore            # Next.js standard
```

## Page composition (legacy order)

`Nav → Hero (with LiveDemo) → PilotProof → Problem → HowItWorks → Compare →
Pricing → Faq → FinalCta → Footer`. Two `WaitlistForm` instances (hero +
final CTA), matching the legacy `data-waitlist` forms.

## Styling

- `styles/tokens.css` copied across **unchanged** — it stays the single source
  of truth for color, type, spacing, radii, shadows, motion.
- Each section's rules from `landing.css` / `live-demo.css` move into a
  co-located `*.module.css`; class names become module-scoped.
- Inline styles in the legacy HTML (how-it-works visuals, pricing waitlist
  banner, footer) are ported into the relevant module files.
- Fonts: `next/font/google` loads **DM Sans only**. The legacy `@import`
  pulled five families (DM Sans, Inter, Open Sans, Plus Jakarta Sans,
  JetBrains Mono); the three alternative sans were "to test" and JetBrains Mono
  is never rendered because the marketing layer aliases `--font-mono` →
  `--font-sans`. tokens.css drops the `@import` entirely (next/font handles
  loading) and collapses `--font-mono` to `var(--font-sans)`, removing the
  alt-font variables.

## Samples folder (format comparison)

`samples/tailwind-shadcn/` rebuilds the **Pricing** section using Tailwind
utility classes plus a shadcn/ui `Card`/`Button`, with the BYA tokens mapped
into a Tailwind theme. Purpose: let the user compare "CSS Modules format" vs
"Tailwind + shadcn format" on identical UI before committing the whole site to
one approach. It is excluded from the Next.js build (not imported by `app/`).

## Code hygiene

The rebuild must carry over **only what is used**. During the port:

- Drop unused CSS tokens, selectors, and rules that no rendered component
  references (e.g. the commented `.serif` placeholder, alt-font variables for
  families we no longer load, any orphan utility classes).
- No dead JavaScript, commented-out blocks, or placeholder TODOs in shipped code.
- No unused imports, props, exports, or files.
- No speculative abstraction — components and helpers exist only because a
  rendered section needs them.
- `next lint` is configured to fail on unused vars/imports so this is enforced,
  not just aspirational.

`legacy/` is exempt (it is reference, left as-is).

## Verification

- `npx tsc --noEmit` — clean
- `next lint` — clean (including no-unused-vars/imports)
- `next build` — succeeds
- Unit test for the `LiveDemo` reducer (pure phase-transition logic)
- Manual visual parity check against `legacy/index.html`
- No unreferenced files in `app/`, `components/`, `styles/`, or `public/`

## Out of scope (YAGNI)

- Any backend, database, email provider, or API route
- Real waitlist persistence
- Additional routes/pages (blog, /privacy, /terms) — structure supports adding
  them later, but none are built now
- Migrating the whole site to Tailwind (only the one sample section)
- Auth, analytics, or the `app.betteryourads.com` product itself
