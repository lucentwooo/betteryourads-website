# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above is load-bearing: this repo runs **Next.js 16 / React 19**, which has
> breaking changes from older versions. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing Next.js code.

## What this is

Single-page marketing site for **BetterYourAds** (done-for-you Meta ads for B2B SaaS).
No backend, no database — a static-deployed App Router site whose only "interactivity"
is a Cal.com booking embed, scroll animations, and fire-and-forget analytics.

## Commands

```bash
npm run dev          # dev server → http://localhost:3000
npm run build        # production build (also the strictest type+lint gate)
npm run lint         # eslint (fails on unused vars/imports)
npx tsc --noEmit     # standalone type check
npm test             # vitest run (one-shot)
npm run test:watch   # vitest watch
npx vitest run lib/creatives.test.ts            # single test file
npx vitest run -t "name of the test"            # single test by name
```

Vitest runs in **jsdom** with globals enabled (no per-file `import { describe }`).
The `@/` alias maps to the repo root in both `tsconfig.json` and `vitest.config.ts`.

## Architecture

**The page is a fixed vertical sequence of sections.** `app/page.tsx` composes them in
order (Nav → Hero → WhySaas → HowItWorks → RealOutput → Faq → FinalCta → Footer). Each
section lives in `components/<Section>/` with a co-located `.module.css`. Shared
primitives live in `components/ui/` (Button, MagneticButton, Counter, SectionHead,
BookCallButton, etc.). To change the page flow, edit `page.tsx`; to change a section,
edit its folder.

**Styling is CSS Modules over a single token layer.** `styles/tokens.css` is the source
of truth for color, type scale, spacing, and motion — a two-tier system: `--bya-*` brand
primitives feed semantic aliases (`--bg`, `--fg`, `--accent`, …). Use the semantic
tokens in component CSS, not raw hex. The palette is deliberately constrained: cream
paper, ink, and **one** electric-blue signal color used sparingly.

**Ad creatives are data-driven.** `lib/creatives.ts` is the single registry mapping
brands → image files in `public/creatives/<brand>/`. Three disjoint sets by design —
`HERO_BRAND` (Zoom, hero cascade), `WORKED_EXAMPLE` (Notion, the how-it-works pipeline),
and `WALL_BRANDS` (the Living Wall) — chosen so **no creative repeats across sections**.
When adding/removing images, update the counts/indices here; they must match what's on
disk (note Zapier intentionally skips `ad-03`).

**Booking + analytics are single-call-site abstractions.** `components/ui/BookCallButton.tsx`
wraps the Cal.com embed (`NEXT_PUBLIC_CAL_LINK`). `lib/analytics.ts` `track()` is a
fire-and-forget no-op until a provider attaches `window.va` — wire any provider there,
once.

## Conventions

- **Client vs server:** sections are server components by default; add `'use client'`
  only for interactivity (booking, scroll/motion, counters). Animation uses the `motion`
  library and `lenis` for smooth scroll.
- **Respect `prefers-reduced-motion`** in any new animation — existing components do.
- `legacy/` is the original static HTML/CSS, kept for reference only — nothing in `app/`
  or `components/` imports from it. Don't wire it into the build.
- Design specs and implementation plans live in `docs/superpowers/`.

## Env

Copy `.env.local.example`. `NEXT_PUBLIC_CAL_LINK` is the public Cal.com handle. The
`RESEND_*` vars are scaffolded for a future email-capture flow but **no route handler
exists yet** — there is currently no `app/api/`. (The README's mention of a
`WaitlistForm` is aspirational; the live CTA is the Cal.com booking call.)
