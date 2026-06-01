# BetterYourAds Landing — Scroll Cinematics & Smoothness Plan

> **For agentic workers (READ FIRST):** This plan is self-contained so it can be executed in a fresh session with no prior chat context. Execute with superpowers:subagent-driven-development (parallel waves where files are disjoint). Steps use `- [ ]` checkboxes.
> **Also read:** the two project memories — `usp-batch-creation` and `landing-impressive-means-usp-not-decoration` (in the session memory dir) — they encode the founder's intent. And per the repo `AGENTS.md`, skim the relevant guide under `node_modules/next/dist/docs/01-app/` before writing component code (this Next version differs from training data).

**Goal:** Make the existing scroll-driven pieces buttery-smooth and add a small, curated set of scroll-cinematic moments that *showcase how BetterYourAds delivers value* — without breaking the cream/ink/one-blue editorial brand.

**Architecture:** Next.js 16.2.6 App Router, React 19, TS, **CSS Modules over `styles/tokens.css`** (NO Tailwind, NO shadcn — deliberately removed). Sections are RSC; interactivity is isolated in small `"use client"` islands. Motion via the `motion` package (`motion/react`). Smoothness via **Lenis**. Static deploy on Vercel, no backend.

**Branch:** `experiment/crazy-shit` (currently 22 commits ahead of `main`). Keep committing here; do not merge/push unless the user asks.

---

## 1. What ALREADY EXISTS and is committed (do NOT rebuild)

A large "elevation" pass + a hero rebuild are already done and committed. Spec: `docs/superpowers/specs/2026-06-01-landing-page-elevation-design.md`. Prior plan: `docs/superpowers/plans/2026-06-01-landing-page-elevation.md`.

**Foundation / primitives (committed):**
- `styles/tokens.css` — design tokens + motion additions: `--reveal-dur/-rise/-blur`, `--beam-dur`, and a registered `@property --beam-angle`.
- `app/globals.css` — `.reveal` (scroll-driven blur-fade-up via `animation-timeline: view()`), `.scrollProgress` (top hairline via `scroll(root)`), `.sheen` (one-pass accent sweep), all with `@supports not (animation-timeline)` fallbacks + a `prefers-reduced-motion` block.
- `app/layout.tsx` — mounts `<div className="scrollProgress">` and `<StickyCta/>`.
- `components/ui/Counter.tsx` (number-ticker, count-up on in-view, `easeOutCubic` tested), `SpotlightCard.tsx` (pointer-follow), `MagneticButton.tsx` (spring CTA, mirrors `Button` API, uses `motion/react`), `lib/confetti.ts` (brand confetti, no-ops in SSR/jsdom/reduced-motion).
- `motion@12.40.0` is installed; React entry is `motion/react`.

**Sections polished (committed):** Problem (reveal + verdict hover), Compare (reveal + "us" column underline draw), PilotProof (SpotlightCard + one-pass border-beam), Pricing (featured beam/spotlight + MagneticButton CTAs), Faq (native `<details name="faq">` exclusive accordion + `::details-content` animation), OptimizeChart (bars animate + Counter count-ups — it is `'use client'` because it passes a `format` fn to Counter), HowItWorks (`AnglePicker` clickable + scroll-drawn step beam), Nav (scroll-aware + active-link IntersectionObserver + MagneticButton), FinalCta (sheen + confetti on submit via WaitlistForm), StickyCta (slim sticky waitlist bar, `inert` when hidden).

**Hero demo v2 — "BatchDemo" (committed, the centerpiece):** `components/Hero/BatchDemo.tsx` + `.module.css` + `batchDemoMachine.ts` + `.test.ts`. A calm ~9.3s LOOP using REAL ad creatives: phase 1 reference ad → phase 2 "generating" → phase 3 the 8 real variations fan out into a 4×2 grid (continuous stage, NOT `AnimatePresence mode="wait"`) → phase 4 hold → crossfade loop. SSR-safe (deterministic `INITIAL`, reduced-motion applied post-mount via rAF-deferred dispatch). The old `LiveDemo` + its URL/favicon "logo puller" were DELETED.

**Showcase — container-scroll (committed):** `components/Showcase/Showcase.tsx` + `.module.css`, rendered in `app/page.tsx` after `<PilotProof/>`. A 3D-tilted "app screen" that rotates flat + scales up on scroll (`useScroll`/`useTransform`, sticky, `perspective`), revealing the 8 real ads in a large 4×2 grid. SSR-safe + reduced-motion-static.

**Assets / manifest (committed):**
- `public/demo/zoom-ref.jpg` + `zoom-1.jpg`…`zoom-8.jpg` — REAL ad creatives (Zoom Workplace set), ~760px, ~90KB each. Source originals in `~/Downloads/demo`.
- `lib/demoAds.ts` — exports `REFERENCE_AD`, `VARIATION_ADS` (8: each `{src, alt, angle}`; angles = feature, credibility, use-case, aspiration, case study, pain point, manifesto, social proof), `VARIATION_COUNT` (=8). **Import these; never hardcode paths.**

**Current page order** (`app/page.tsx`): `Nav → Hero → PilotProof → Showcase → Problem → HowItWorks → Compare → Pricing → Faq → FinalCta → Footer`.

---

## 2. Non-negotiable constraints

- **Brand restraint in palette/type:** cream `--bg #f4efe6`, ink `--fg #0a0a0a`, exactly ONE electric blue `--accent #1a3df0` for UI; DM Sans; borders over shadows; modest radii; one easing curve `--ease`. The **ad creatives are full-colour content** (an intentional exception) — but site chrome stays flat/editorial. NO animated gradients on chrome.
- **SSR-safe:** initial render must be byte-identical server vs first client render. NEVER branch initial reducer state or initial JSX on `useReducedMotion()` (caused a hydration mismatch earlier — the Next dev overlay flagged "1 Issue"). Apply reduced-motion in a POST-MOUNT effect, deferring the `setState`/`dispatch` via `requestAnimationFrame` (also satisfies the `react-hooks/set-state-in-effect` lint rule).
- **Reduced motion:** every scroll/loop animation degrades to a static, legible end-state under `@media (prefers-reduced-motion: reduce)` and/or `useReducedMotion()`.
- **Honesty:** the demo creatives are real example output (Zoom set), framed as examples — no fabricated metrics, no claim of having analysed the visitor's own site.
- **Lean + coherent:** one motion language (Lenis + a single easing). Do not stack redundant effects. The "wow" includes correctness (no console/hydration errors), not just flash.

---

## 3. Conventions & gotchas (learned — honour these)

- **Lint:** `next lint` is REMOVED in Next 16. Use **`npm run lint`** (eslint). It enforces `react-hooks/set-state-in-effect` (no synchronous setState in an effect body — defer via rAF or do it in timer/event callbacks).
- **Verify commands:** `npx tsc --noEmit` · `npm run lint` · `npx vitest run` · `npm run build`. All must pass.
- **next/image:** local `/public` images need no `remotePatterns`. Do NOT pass a custom `quality` (Next 16 needs an `images.qualities` allowlist in config, which we don't have). `priority` is replaced by `preload` in this version.
- **Browser verification (REQUIRED before declaring a visual task done):** use the webapp-testing Playwright helper:
  `python3 /Users/lucentwu/.claude/skills/webapp-testing/scripts/with_server.py --server "npm run dev" --port 3000 --timeout 150 -- python3 <script.py>`
  Capture screenshots at 1280px + 390px, and **attach a `pageerror`/console listener to assert ZERO hydration errors** in BOTH normal and `reduced_motion="reduce"` contexts. (The Next dev overlay showing "N · 1 Issue" = a runtime/hydration problem — investigate, don't ship.)
- **Agent coordination (if using subagents):** parallel implementers must own DISJOINT files; have them edit-only (no commit, no project-wide tsc/lint/build while peers edit), then the controller runs the checks once and commits per wave. Solo agents may run the full suite themselves.
- **Commits:** end messages with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## 4. Component decisions (the six 21st.dev links the founder shared)

| Component | Decision | Use |
|---|---|---|
| **efferd/zoom-parallax** (Lenis + Framer) | **Adopt — core** | Brings Lenis (smoothness) + the most cinematic way to show the real ad output. Folds into the showcase. |
| **magicui/text-reveal** | **Adopt** | Word-by-word value-prop manifesto on scroll. Pure type → on-brand. |
| **ishamsu/smooth-scroll-hero** | **Adapt (Lenis only)** | Take the momentum-scroll idea globally; skip its clip-reveal hero (we have the BatchDemo). |
| **ruixenui/scroll-tilted-grid** | **Optional** | A second editorial "volume wall" of creatives — only if the founder wants it (else redundant with zoom-parallax). |
| **arunachalam0606/scroll-expansion-hero** | **Skip** | Redundant 3rd "expand a creative" reveal. |
| **hammamikhairi/animated-gradient-background** | **Skip (brand risk)** | Animated gradients fight flat cream/ink. At most a whisper-faint, slow on-brand glow behind hero/final-CTA — default OFF. |

---

## 5. The build — phases

### Phase S — Smoothness foundation (do FIRST; everything benefits)

**S1. Global Lenis smooth scroll.**
- Files: install `lenis`; create `components/ui/SmoothScroll.tsx` (`"use client"`); mount it in `app/layout.tsx` (inside `<body>`, wrapping nothing — it just drives scroll).
- Verify the installed package's React usage from `node_modules/lenis` (newer versions ship `lenis/react` with a `<ReactLenis root>` component; otherwise hand-roll). Hand-rolled pattern:
  ```tsx
  'use client';
  import { useEffect } from 'react';
  export function SmoothScroll() {
    useEffect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // a11y: no smoothing
      let lenis: { raf: (t: number) => void; destroy: () => void } | undefined;
      let id = 0;
      (async () => {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        const raf = (t: number) => { lenis!.raf(t); id = requestAnimationFrame(raf); };
        id = requestAnimationFrame(raf);
      })();
      return () => { cancelAnimationFrame(id); lenis?.destroy(); };
    }, []);
    return null;
  }
  ```
  (Dynamic `import('lenis')` keeps it client-only. Framer's `useScroll` reads `window` scroll, which Lenis drives — existing scroll animations get smoothed automatically.)
- Checklist:
  - [ ] `npm install lenis`; confirm React entry / usage from its package.
  - [ ] Create `SmoothScroll.tsx`; reduced-motion early-return; rAF loop; destroy on unmount.
  - [ ] Mount in `layout.tsx`.
  - [ ] Verify: `tsc`/`lint`/`build` green; Playwright — scrolling is smooth, NO hydration error, reduced-motion = native scroll (no Lenis).

**S2. Soften existing motion.**
- `components/Hero/BatchDemo.tsx`: soften the reveal `SPRING` (e.g. `{ type:'spring', stiffness:90, damping:24, mass:1 }`) or switch the fan-out to a tween `{ duration:0.75, ease:[0.16,1,0.3,1] }`; nudge `PHASE_MS` holds a touch longer (in `batchDemoMachine.ts`). Goal: calm, legible, no spring jitter.
- `components/Showcase/Showcase.tsx`: widen the scroll range so the flatten is gradual (e.g. rotateX maps `[0, 0.6] → [20deg, 0]`, scale `[0, 0.6] → [0.94, 1]`), gentler `ease`. With Lenis it should feel silky.
- Checklist: [ ] adjust spring/easing/ranges; [ ] re-screenshot the hero loop + showcase flatten and confirm visibly smoother; [ ] checks green.

### Phase 1 — Showcase upgraded with zoom-parallax  *(shows: real, on-brand output at volume)*
Fold a zoom-parallax feel into the existing `Showcase` (keep the "this is your batch" framing). As the section scrolls, the real ad tiles **zoom/scale in at staggered speeds** (Lenis-smooth) instead of (or in addition to) the flat reveal.
- Files: `components/Showcase/Showcase.tsx` + `.module.css` (rewrite the inner reveal; keep `useScroll` + the manifest import). Reuse `VARIATION_ADS` (and `REFERENCE_AD` as the lead "1 →" thumbnail).
- Pattern: per-tile `useTransform(scrollYProgress, [a,b], [scaleSmall, scaleFull])` with staggered ranges per index; `next/image` `fill` + `sizes` in `aspect-ratio:1` frames. Keep SSR-safe + reduced-motion-static (grid simply shown).
- Checklist: [ ] implement; [ ] Playwright across the section's scroll travel — smooth staggered zoom, ZERO hydration errors (normal + reduced); [ ] checks green; [ ] commit.

### Phase 2 — text-reveal manifesto  *(shows: the whole value prop, in words)*
A new full-width section that reveals a value statement **word-by-word on scroll** (magicui TextRevealByWord pattern, ported to CSS Modules + tokens — ink-on-cream, NOT the dark Tailwind original).
- Files: create `components/Manifesto/Manifesto.tsx` (`"use client"`) + `.module.css`; render in `app/page.tsx` (suggested placement: between `Showcase` and `Problem`, or just before `HowItWorks`).
- Copy (tunable): *"We learn your product. Write the angles. Batch the creative. Run the ads. Tuned for trial signups — not add-to-carts."* Each word's opacity/blur maps to scroll progress (`useScroll` on a tall sticky container, `useTransform` per word). Reduced-motion: render full-opacity text statically (SSR-safe).
- Checklist: [ ] implement; [ ] Playwright reveal + reduced-motion static + no hydration error; [ ] checks green; [ ] commit.

### Phase 3 — value-comms sections (the "rest of the site," now Lenis-smooth)
*(These predate the 21st.dev links but are the substance of "make the rest impressive + it must sell." Build after Phases S–2.)*

**3a. How it works → pinned scrollytelling pipeline** *(shows: the done-for-you process)*
- `components/HowItWorks/*`: convert to a sticky, scroll-driven narrative — one ad moves through **learn brand → write angles → BATCH (the 8) → ship to Meta → optimize for signups**, each stage animating as you scroll. Keep the existing `AnglePicker` + `OptimizeChart` where they fit, or restage. SSR-safe + reduced-motion (stages shown stacked/static).

**3b. Compare → ecom ↔ SaaS metric morph** *(shows: built for SaaS, not ecom)*
- `components/Compare/*`: add an interactive toggle (or scroll-triggered morph) where dashboard metrics animate from agency/ecom (ROAS, add-to-cart, CPM) → SaaS (trial signups, MRR, CAC payback). Keep the existing comparison table content; add the morph as the hook.

**3c. Optimize chart → live spend-reallocation sim** *(shows: we optimize for signups, daily)*
- `components/HowItWorks/OptimizeChart.*`: make it a short looping/stepped simulation — budget visibly flows to the winning angle across a simulated week; signups count up; cost/signup drops. Keep on-brand (accent for winners, ink/muted for the rest). Reduced-motion: final state shown.

### Optional (default OFF — confirm with founder)
- **scroll-tilted-grid "volume wall"** — a second editorial creatives band (ruixenui pattern) if more "volume" is wanted.
- **whisper-faint on-brand glow** — a very subtle, slow radial (cream/faint-blue) behind hero or final-CTA. Only if the founder asks; keep it nearly invisible to protect the brand.

---

## 6. Final verification (run after each phase + at the end)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean (no unused vars/imports; no `set-state-in-effect`)
- [ ] `npx vitest run` green
- [ ] `npm run build` succeeds; First Load JS still small (Lenis + motion are client-only).
- [ ] Playwright pass at 1280px + 390px: hero loop, showcase zoom, manifesto reveal, how-it-works pipeline. **Assert zero `pageerror`/console errors** in normal AND `reduced_motion="reduce"`.
- [ ] Reduced-motion: whole page static + legible; no Lenis; no looping content changes.
- [ ] Brand audit: one blue per surface (ad creatives excepted); borders over shadows; DM Sans; copy meaning unchanged.

## 7. How to resume in a fresh session
1. Read this plan + the two memories (`usp-batch-creation`, `landing-impressive-means-usp-not-decoration`).
2. `git log --oneline main..HEAD` on `experiment/crazy-shit` to see what's committed.
3. `npm run dev` and look at the current hero loop + showcase to feel the baseline before Phase S.
4. Execute Phase S → 1 → 2 → 3, committing per phase, verifying in the browser each time.
