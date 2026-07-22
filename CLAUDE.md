# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above is load-bearing: this repo runs **Next.js 16 / React 19**, which has
> breaking changes from older versions. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing Next.js code.

## What this is

Two-page marketing site for **Loopy** (tryloopy.io) — AI Meta-ad generation for
brands and agencies running Meta ads. Positioning: paste your URL, a real browser
measures your site's actual colors/fonts/logo, and proven ad layouts get reskinned
into finished, on-brand static ads (product screenshots placed exactly, never
invented). The on-ramp is a 20-minute founder call.
No backend, no database — a static-deployed App Router site (`/` landing +
`/pricing`) whose only interactivity is the pricing billing toggle/slider and
pure-CSS ambient animations. Implemented 1:1 from the approved handoff in
`design_handoff_loopy_landing/` (kept outside the repo).

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

**Each page is a fixed vertical sequence of sections.** `app/page.tsx` composes the
landing (Nav → Hero → Mechanism → BatchGrid → Ribbon → Closer → Faq → FinalCta →
Footer); `app/pricing/page.tsx` composes Nav → Pricing → Faq → Footer. Each section
lives in `components/<Section>/` with a co-located `.module.css`. Nav/Footer/Faq are
shared across both pages via props (`page`/`variant`). To change a page's flow, edit
its `page.tsx`; to change a section, edit its folder.

**Styling is CSS Modules over a single token layer.** `styles/tokens.css` is the source
of truth: `--loopy-*` brand primitives feed semantic aliases (`--bg`, `--fg`,
`--accent`, …). Use semantic tokens in component CSS, not raw hex. Palette: white
paper, ink `#0e1116`, **one** electric-blue signal `#1c42e6`, plus tiny coral/mint/
violet accents (one per mechanism card). DM Sans everywhere; JetBrains Mono only for
chips/tiny technical labels.

**Ad imagery is data-driven where it repeats.** `lib/creatives.ts` holds the hero ad
wall columns (`HERO_WALL_A/B`, brand `ad-01`s) and the final-CTA marquee
(`CTA_MARQUEE`, brand `ad-02`s) — each rendered twice for seamless -50% translate
loops. Real Salesgraph renders live in `public/salesgraph/` (mechanism cards + batch
grid, hard-coded in their sections); the reference Canva ad is
`public/reference/canva-ad.jpg`. `lib/creatives.test.ts` asserts every path exists on
disk.

**All CTAs are plain links to the founder call.** `lib/site.ts` exports `CAL_URL`
(https://cal.com/loopy/20min) and `SITE_URL` — no Cal embed, no forms.
`lib/analytics.ts` `track()` remains a fire-and-forget no-op until a provider
attaches `window.va`.

## Conventions

- **Client vs server:** everything is a server component except
  `components/Pricing/Pricing.tsx` (billing period + Pro-tier slider state). All
  animation is pure CSS keyframes in module files — no motion/lenis.
- **Respect `prefers-reduced-motion`** — every animated section pauses its keyframes
  under it (drifting hero wall, site-scroll screenshot, CTA marquee).
- **Mobile pass is ≤760px** — each section's module CSS ports the handoff's
  `@media (max-width:760px)` rules (grids stack, sticky cards go static, tap targets
  ≥44px, no text below 14px).
- `legacy/` is the original static HTML/CSS, kept for reference only — nothing in `app/`
  or `components/` imports from it. Don't wire it into the build.
- Design specs and implementation plans live in `docs/superpowers/`.

## Env

Copy `.env.local.example`. `NEXT_PUBLIC_SITE_URL` overrides the canonical origin
(defaults to https://tryloopy.io). `NEXT_PUBLIC_CAL_LINK` and the `RESEND_*` vars are
legacy scaffolding — booking is now a hard-coded link (`lib/site.ts`) and no email
route handler exists (there is no `app/api/`).
