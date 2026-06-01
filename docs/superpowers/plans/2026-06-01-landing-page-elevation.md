# BetterYourAds Landing Page Elevation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing BYA landing page to be craft-grade for senior devs, genuinely interactive, and higher-converting — while staying strictly on-brand (cream/ink/one-blue, DM Sans, borders-over-shadows, CSS Modules, no Tailwind/shadcn).

**Architecture:** Sections stay React Server Components. All interactivity is isolated into small `"use client"` islands and reusable `ui/` primitives. Motion is mostly native CSS scroll-driven animation (`animation-timeline`, `@property`); the `motion` library is used only for spring physics in the magnetic CTA. Everything honors `prefers-reduced-motion` and degrades to a static, legible page when scroll-timeline is unsupported.

**Tech Stack:** Next.js 16.2.6 (App Router) · React 19 · TypeScript · CSS Modules over `styles/tokens.css` · `motion` (new) · Vitest + RTL. `@/*` → repo root.

**Spec:** `docs/superpowers/specs/2026-06-01-landing-page-elevation-design.md`

**AGENTS.md mandate:** Before writing component code, skim the relevant guide under `node_modules/next/dist/docs/01-app/` (client components, fonts, images). Pure-CSS and pure-logic tasks need no doc read.

---

## Execution waves & file ownership (READ FIRST — prevents agent collisions)

Run in three waves. **Within a wave, tasks touch disjoint files and may run in parallel. Between waves, finish fully before starting the next.**

- **Wave A (foundation — 1 agent, must finish first):** Task 1. Touches `package.json`, `styles/tokens.css`, `app/globals.css`, `app/layout.tsx`.
- **Wave B (primitives — parallel):** Tasks 2,3,4,5,6. Each creates new isolated files (plus Task 2 edits only `LiveDemo/liveDemoMachine*`).
- **Wave C (sections & integration — parallel):** Tasks 7–15. Each task owns a disjoint set of files (listed per task). Task 13 (StickyCta) is the sole Wave-C editor of `app/layout.tsx`.
- **Verify (1 agent):** Task 16.

Ownership map (no two same-wave tasks share a file):
- T7 Problem → `components/Problem/*`
- T8 Compare → `components/Compare/*`
- T9 PilotProof → `components/PilotProof/*`
- T10 Pricing → `components/Pricing/*`
- T11 Faq → `components/Faq/*`
- T12 OptimizeChart → `components/HowItWorks/OptimizeChart.tsx` + `OptimizeChart.module.css`
- T12b HowItWorks flow/angles → `components/HowItWorks/HowItWorks.tsx` + `HowItWorks.module.css` + new `AnglePicker.*` *(distinct files from T12; if one agent does both T12+T12b, even safer)*
- T13 StickyCta → `components/StickyCta/*` + `app/layout.tsx`
- T14 Hero/LiveDemo → `components/Hero/*` + `components/LiveDemo/LiveDemo.tsx` + `LiveDemo.module.css`
- T15 Nav + FinalCta + WaitlistForm → `components/Nav/*`, `components/FinalCta/*`, `components/ui/WaitlistForm.tsx` + `.module.css` *(group these so WaitlistForm has a single owner)*

---

## File Structure

**New files**
- `components/ui/Counter.tsx` — client number-ticker, counts up on in-view.
- `components/ui/Counter.test.ts` — unit tests for `easeOutCubic`.
- `components/ui/SpotlightCard.tsx` + `.module.css` — client pointer-follow highlight wrapper.
- `components/ui/MagneticButton.tsx` + `.module.css` — client spring CTA (mirrors `Button` API).
- `components/HowItWorks/AnglePicker.tsx` + `.module.css` — client clickable angle list.
- `components/StickyCta/StickyCta.tsx` + `.module.css` — client sticky waitlist bar.
- `lib/confetti.ts` — self-contained canvas confetti (no dependency).

**Modified**
- `package.json` — add `motion`.
- `styles/tokens.css` — motion tokens + `@property --beam-angle`.
- `app/globals.css` — `.reveal` utilities, reduced-motion block, scroll-progress, `.sheen`.
- `app/layout.tsx` — mount scroll-progress bar; mount `<StickyCta/>`.
- `components/LiveDemo/liveDemoMachine.ts` (+ `.test.ts`) — pure personalization helpers.
- `components/LiveDemo/LiveDemo.tsx` + `.module.css` — interactive URL input + personalization.
- `components/Hero/Hero.tsx` + `.module.css` — magnetic CTA + headline sheen.
- `components/HowItWorks/OptimizeChart.tsx` + `.module.css` — animated fills + counters.
- `components/HowItWorks/HowItWorks.tsx` + `.module.css` — step beam + AnglePicker.
- `components/PilotProof/*`, `components/Compare/*`, `components/Pricing/*`, `components/Problem/*`, `components/Faq/*`, `components/FinalCta/*` — reveals, hover, border-beam, accordion.
- `components/Nav/Nav.tsx` + `.module.css` — scroll-aware + active link + magnetic CTA.
- `components/ui/WaitlistForm.tsx` — fire confetti on success.

---

## Conventions for this plan

- **TDD applies to pure logic** (Task 2 helpers, Task 3 easing). Write the failing test first, watch it fail, implement, watch it pass.
- **Visual/CSS tasks have no meaningful unit test.** Their "test" is the verify step: `npx tsc --noEmit && npx next lint && npm run build` plus a dev-server look. Do not write fake assertions for CSS.
- **Every task ends by running** `npx tsc --noEmit` and `npx next lint` and committing.
- **Reduced motion**: every animation must be neutralized under `@media (prefers-reduced-motion: reduce)` (CSS) or a `matchMedia('(prefers-reduced-motion: reduce)').matches` check (JS).
- Commit messages: `feat:`/`refactor:`/`style:` as appropriate. End with the Co-Authored-By trailer the environment requires.

---

## Task 1: Foundation — motion lib, tokens, global reveal layer, scroll-progress

**Files:**
- Modify: `package.json` (+ install)
- Modify: `styles/tokens.css` (append a motion block, before the base-resets section)
- Modify: `app/globals.css` (append utilities)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install `motion`**

Run: `npm install motion`
Expected: `motion` added to `dependencies` in `package.json`; `package-lock.json` updated.
Note: confirm the React entry path after install — `node -e "require('fs').accessSync('node_modules/motion/react.mjs')||0"` or check `node_modules/motion/package.json` `exports` for `"./react"`. The import used later is `import { ... } from 'motion/react'`.

- [ ] **Step 2: Add motion tokens + `@property` to `styles/tokens.css`**

Insert this block immediately before the `/* ===== Base resets + body ===== */` divider (around line 116):

```css
  /* ---------------------------------------------------------------
     Motion — scroll-driven reveal + beam (additions)
     --------------------------------------------------------------- */
  --reveal-dur:       640ms;
  --reveal-rise:      16px;
  --reveal-blur:      6px;
  --beam-dur:         1100ms;
}

/* Animatable angle for the one-pass border-beam (must be registered). */
@property --beam-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* re-open :root is not needed; the block above closed :root intentionally. */
```

> Note to engineer: the snippet closes `:root`. Make sure you are inserting *inside* the existing `:root{…}` and that exactly one closing `}` remains. Simplest: paste the `--reveal-*`/`--beam-dur` lines just before the final `}` of `:root`, then add the `@property` rule after `:root`'s closing brace.

- [ ] **Step 3: Add the reveal/scroll-progress/sheen utilities to `app/globals.css`**

Append:

```css
/* =================================================================
   Motion layer — scroll-driven reveals, scroll progress, accent sheen
   All progressively enhanced: no support / reduced-motion => final state.
   ================================================================= */

/* Per-element reveal. Each element animates as IT enters the viewport,
   which yields organic stagger without delay math. */
.reveal {
  animation: reveal-in var(--reveal-dur) var(--ease) both;
  animation-timeline: view();
  animation-range: entry 0% cover 22%;
}
@keyframes reveal-in {
  from { opacity: 0; transform: translateY(var(--reveal-rise)); filter: blur(var(--reveal-blur)); }
  to   { opacity: 1; transform: none; filter: none; }
}

/* Top scroll-progress hairline (the one blue). */
.scrollProgress {
  position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 100;
  background: var(--accent); transform-origin: 0 50%; transform: scaleX(0);
  animation: progress-grow linear both;
  animation-timeline: scroll(root);
}
@keyframes progress-grow { to { transform: scaleX(1); } }

/* One-pass sheen for accent words (runs on load, does not loop). */
.sheen {
  background: linear-gradient(100deg,
    var(--accent) 0%, var(--accent) 38%,
    color-mix(in srgb, var(--accent) 45%, white) 50%,
    var(--accent) 62%, var(--accent) 100%);
  background-size: 220% 100%;
  background-clip: text; -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: sheen-sweep 1100ms var(--ease) 240ms 1 both;
}
@keyframes sheen-sweep { from { background-position: 120% 0; } to { background-position: -40% 0; } }

@supports not (animation-timeline: view()) {
  .reveal { opacity: 1; transform: none; filter: none; animation: none; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal, .scrollProgress, .sheen { animation: none !important; }
  .reveal { opacity: 1; transform: none; filter: none; }
  .scrollProgress { transform: scaleX(0); }
  .sheen { -webkit-text-fill-color: var(--accent); background: none; }
}
```

- [ ] **Step 4: Mount the scroll-progress bar in `app/layout.tsx`**

In the `<body>`, render the bar before `{children}`:

```tsx
      <body>
        <div className="scrollProgress" aria-hidden />
        {children}
      </body>
```

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit && npx next lint && npm run build`
Expected: all pass; build succeeds.
```bash
git add package.json package-lock.json styles/tokens.css app/globals.css app/layout.tsx
git commit -m "feat: add motion foundation — reveal utilities, scroll progress, accent sheen, motion lib"
```

---

## Task 2: LiveDemo personalization helpers (pure logic, TDD)

**Files:**
- Modify: `components/LiveDemo/liveDemoMachine.ts` (append exports; do not touch existing ones)
- Test: `components/LiveDemo/liveDemoMachine.test.ts` (append a describe block)

- [ ] **Step 1: Write failing tests** — append to `liveDemoMachine.test.ts`:

```ts
import { normalizeDomain, domainMonogram, domainAccent, faviconUrl } from './liveDemoMachine';

describe('personalization helpers', () => {
  it('normalizes valid domains and strips scheme/path/www', () => {
    expect(normalizeDomain('https://www.Stripe.com/pricing')).toBe('stripe.com');
    expect(normalizeDomain('linear.app')).toBe('linear.app');
    expect(normalizeDomain('  notion.so  ')).toBe('notion.so');
  });
  it('rejects junk', () => {
    expect(normalizeDomain('')).toBeNull();
    expect(normalizeDomain('not a domain')).toBeNull();
    expect(normalizeDomain('localhost')).toBeNull();
  });
  it('derives a single uppercase monogram from the main label', () => {
    expect(domainMonogram('stripe.com')).toBe('S');
    expect(domainMonogram('linear.app')).toBe('L');
  });
  it('derives a deterministic hsl accent', () => {
    expect(domainAccent('stripe.com')).toBe(domainAccent('stripe.com'));
    expect(domainAccent('stripe.com')).toMatch(/^hsl\(\d+(\.\d+)? \d+% \d+%\)$/);
  });
  it('builds a favicon url', () => {
    expect(faviconUrl('stripe.com')).toBe('https://www.google.com/s2/favicons?domain=stripe.com&sz=128');
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npx vitest run components/LiveDemo/liveDemoMachine.test.ts` → FAIL (exports missing).

- [ ] **Step 3: Implement** — append to `liveDemoMachine.ts`:

```ts
/** Strip scheme/path/www, lowercase, validate "label.tld". Returns null if implausible. */
export function normalizeDomain(input: string): string | null {
  const raw = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const host = raw.split(/[/?#]/)[0];
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return null;
  return host;
}

/** First letter of the main label, uppercased. "stripe.com" -> "S". */
export function domainMonogram(domain: string): string {
  return (domain[0] ?? '?').toUpperCase();
}

/** Deterministic decorative hue from the string. Saturation/lightness fixed for legibility. */
export function domainAccent(domain: string): string {
  let h = 0;
  for (let i = 0; i < domain.length; i++) h = (h * 31 + domain.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 72% 52%)`;
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
```

- [ ] **Step 4: Run, verify pass** — `npx vitest run components/LiveDemo/liveDemoMachine.test.ts` → PASS (existing reducer tests still green).

- [ ] **Step 5: Commit**
```bash
git add components/LiveDemo/liveDemoMachine.ts components/LiveDemo/liveDemoMachine.test.ts
git commit -m "feat: add pure domain personalization helpers for the live demo"
```

---

## Task 3: Counter primitive (number-ticker)

**Files:**
- Create: `components/ui/Counter.tsx`
- Test: `components/ui/Counter.test.ts`

- [ ] **Step 1: Write failing test** (`Counter.test.ts`):

```ts
import { easeOutCubic } from './Counter';
describe('easeOutCubic', () => {
  it('clamps endpoints', () => { expect(easeOutCubic(0)).toBe(0); expect(easeOutCubic(1)).toBe(1); });
  it('eases out (past midpoint by 0.5)', () => { expect(easeOutCubic(0.5)).toBeGreaterThan(0.5); });
});
```

- [ ] **Step 2: Run, verify fail** — `npx vitest run components/ui/Counter.test.ts` → FAIL.

- [ ] **Step 3: Implement `Counter.tsx`:**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}

export function Counter({
  value, durationMs = 1400, format = (n) => Math.round(n).toLocaleString(), className,
}: {
  value: number; durationMs?: number; format?: (n: number) => string; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDisplay(format(value)); return; }

    let raf = 0; let start = 0; let ran = false;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = easeOutCubic((now - start) / durationMs);
      setDisplay(format(value * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !ran) { ran = true; raf = requestAnimationFrame(tick); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, durationMs, format]);

  return <span ref={ref} className={className}>{display}</span>;
}
```

- [ ] **Step 4: Run, verify pass** — `npx vitest run components/ui/Counter.test.ts` → PASS.
- [ ] **Step 5: Commit** — `git add components/ui/Counter.tsx components/ui/Counter.test.ts && git commit -m "feat: add Counter number-ticker primitive"`

---

## Task 4: SpotlightCard primitive

**Files:** Create `components/ui/SpotlightCard.tsx` + `SpotlightCard.module.css`

- [ ] **Step 1: Implement `SpotlightCard.tsx`:**

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import styles from './SpotlightCard.module.css';

export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  }
  return (
    <div ref={ref} onPointerMove={onMove} className={`${styles.card} ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Implement `SpotlightCard.module.css`:**

```css
.card { position: relative; isolation: isolate; transition: border-color var(--dur-base) var(--ease); }
.card::before {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  border-radius: inherit; opacity: 0; transition: opacity var(--dur-base) var(--ease);
  background: radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0),
    color-mix(in srgb, var(--accent) 9%, transparent), transparent 60%);
}
.card:hover::before { opacity: 1; }
.card:hover { border-color: var(--fg); }
@media (prefers-reduced-motion: reduce) { .card::before { transition: none; } }
```

- [ ] **Step 3: Verify + commit** — `npx tsc --noEmit && npx next lint` → pass. `git add components/ui/SpotlightCard.* && git commit -m "feat: add SpotlightCard pointer-follow primitive"`

---

## Task 5: MagneticButton primitive (motion spring)

**Files:** Create `components/ui/MagneticButton.tsx` + `MagneticButton.module.css`

> Mirrors the `Button` API (`href`, `primary`, `sm`, `className`) so it is a drop-in for primary CTAs. Reuses the existing `Button.module.css` classes is not possible across modules, so this file restates the button surface (kept identical to `ui/Button.module.css`). Open `components/ui/Button.module.css` and copy its `.btn/.primary/.sm` rules into `MagneticButton.module.css` under the same class names, then add the transform wrapper below.

- [ ] **Step 1: Implement `MagneticButton.tsx`:**

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './MagneticButton.module.css';

export function MagneticButton({
  href, children, primary = false, sm = false, className,
}: { href: string; children: ReactNode; primary?: boolean; sm?: boolean; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const classes = [styles.btn, primary ? styles.primary : '', sm ? styles.sm : '', className ?? '']
    .filter(Boolean).join(' ');

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  }
  function reset() { x.set(0); y.set(0); }

  return (
    <motion.a ref={ref} href={href} className={classes}
      style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 2: Implement `MagneticButton.module.css`** — paste the `.btn`, `.primary`, `.sm` rules verbatim from `components/ui/Button.module.css` (read it first), then append:

```css
.btn { will-change: transform; }
```

- [ ] **Step 3: Verify + commit** — `npx tsc --noEmit && npx next lint && npm run build` → pass (confirms `motion/react` import resolves and bundle builds). `git add components/ui/MagneticButton.* && git commit -m "feat: add MagneticButton spring CTA primitive"`

---

## Task 6: Confetti utility (no dependency)

**Files:** Create `lib/confetti.ts`

- [ ] **Step 1: Implement `lib/confetti.ts`:**

```ts
const BRAND = ['#1a3df0', '#0a0a0a', '#dcd4c1', '#1f6b3a'];

/** Brief brand-colored burst. No-ops on the server, in jsdom (no 2d ctx), or under reduced motion. */
export function fireConfetti(): void {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '200',
  });
  ctx.scale(dpr, dpr);
  document.body.appendChild(canvas);

  const N = 90;
  const parts = Array.from({ length: N }, () => ({
    x: W / 2, y: H * 0.42, r: 3 + Math.sin(Date.now() + Math.random()) * 2 + Math.random() * 3,
    vx: (Math.random() - 0.5) * 11, vy: -6 - Math.random() * 9,
    color: BRAND[(Math.random() * BRAND.length) | 0], rot: Math.random() * Math.PI, life: 0,
  }));

  let raf = 0; const start = performance.now();
  function frame(now: number) {
    const t = now - start;
    ctx!.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.rot += 0.1; p.life = t;
      ctx!.save(); ctx!.translate(p.x, p.y); ctx!.rotate(p.rot);
      ctx!.globalAlpha = Math.max(0, 1 - t / 1500);
      ctx!.fillStyle = p.color; ctx!.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.4);
      ctx!.restore();
    }
    if (t < 1500) raf = requestAnimationFrame(frame);
    else { cancelAnimationFrame(raf); canvas.remove(); }
  }
  raf = requestAnimationFrame(frame);
}
```

- [ ] **Step 2: Verify + commit** — `npx tsc --noEmit && npx next lint` → pass. `git add lib/confetti.ts && git commit -m "feat: add self-contained brand confetti util"`

---

## WAVE C — sections & integration (parallel; each task owns disjoint files)

### Task 7: Problem — reveals + verdict hover

**Files:** Modify `components/Problem/Problem.tsx`, `components/Problem/Problem.module.css`

- [ ] **Step 1** In `Problem.tsx`, add `reveal` to each cell. Change `<div className={styles.cell} key={o.tag}>` to:
  `<div className={`${styles.cell} reveal`} key={o.tag}>`
- [ ] **Step 2** In `Problem.module.css`, append a hover that reinforces "none of these work":
```css
.cell { transition: border-color var(--dur-base) var(--ease); }
.cell:hover { border-color: var(--fg); }
.verdict { transition: color var(--dur-base) var(--ease), opacity var(--dur-base) var(--ease); }
.cell:hover .verdict { color: var(--bya-rust); opacity: 1; }
```
  (If `.cell`/`.verdict` already declare these properties, merge rather than duplicate — read the file first.)
- [ ] **Step 3** Verify + commit — `npx tsc --noEmit && npx next lint` → pass. Commit `style: animate Problem cells on scroll + verdict hover`.

### Task 8: Compare — reveal + us-column underline draw + row hover

**Files:** Modify `components/Compare/Compare.tsx`, `components/Compare/Compare.module.css`

- [ ] **Step 1** In `Compare.tsx`, add `reveal` to each data row: change the mapped `<div className={styles.row} key={label}>` to `<div className={`${styles.row} reveal`} key={label}>`.
- [ ] **Step 2** In `Compare.module.css` append:
```css
.row { transition: background var(--dur-fast) var(--ease); }
.row:not(.header):hover { background: var(--bg-raised); }
.us { position: relative; }
.row:not(.header) .us::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 6px; height: 2px;
  background: var(--accent); transform: scaleX(0); transform-origin: 0 50%;
  animation: us-underline var(--reveal-dur) var(--ease) both;
  animation-timeline: view(); animation-range: entry 10% cover 26%;
}
@keyframes us-underline { to { transform: scaleX(1); } }
@supports not (animation-timeline: view()) { .row .us::after { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .row .us::after { animation: none; transform: scaleX(1); } }
```
- [ ] **Step 3** Verify + commit — `style: animate Compare rows + highlight the us column`.

### Task 9: PilotProof — reveal + spotlight + border-beam

**Files:** Modify `components/PilotProof/PilotProof.tsx`, `components/PilotProof/PilotProof.module.css`

- [ ] **Step 1** In `PilotProof.tsx`: `import { SpotlightCard } from '@/components/ui/SpotlightCard';` Replace the card wrapper `<div className={styles.card} key={p.num}>…</div>` with `<SpotlightCard className={`${styles.card} ${styles.beam} reveal`} key={p.num}>…</SpotlightCard>`.
- [ ] **Step 2** In `PilotProof.module.css` append the one-pass border-beam (one blue, runs when card scrolls in):
```css
.beam { position: relative; }
.beam::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
  background: conic-gradient(from var(--beam-angle), transparent 0deg, var(--accent) 40deg, transparent 80deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: beam-travel var(--beam-dur) var(--ease) 1 both;
  animation-timeline: view(); animation-range: entry 0% entry 80%;
}
@keyframes beam-travel { from { --beam-angle: 0deg; } to { --beam-angle: 360deg; } }
@supports not (animation-timeline: view()) { .beam::after { display: none; } }
@media (prefers-reduced-motion: reduce) { .beam::after { display: none; } }
```
- [ ] **Step 3** Verify + commit — `feat: spotlight + reveal + border-beam on pilot cards`.

### Task 10: Pricing — reveal + featured beam/spotlight + magnetic primary CTAs

**Files:** Modify `components/Pricing/Pricing.tsx`, `components/Pricing/Pricing.module.css`

- [ ] **Step 1** In `Pricing.tsx`: import `SpotlightCard` and `MagneticButton`. Wrap the featured card (`<div className={`${styles.card} ${styles.featured}`}>`) as `<SpotlightCard className={`${styles.card} ${styles.featured} ${styles.beam} reveal`}>`. Add `reveal` to the founder card too. Replace the two `primary` CTAs (`<Button href="#waitlist" primary …>`) with `<MagneticButton href="#waitlist" primary …>` (keep `sm`/`className` props identical; non-primary `Button`s stay as-is).
- [ ] **Step 2** In `Pricing.module.css` append the same `.beam` block from Task 9 (Step 2) verbatim (it is scoped to this module).
- [ ] **Step 3** Verify + commit — `feat: highlight featured pricing tier with beam/spotlight + magnetic CTA`.

### Task 11: FAQ — exclusive accordion + animated open + icon flip

**Files:** Modify `components/Faq/Faq.tsx`, `components/Faq/Faq.module.css`

- [ ] **Step 1** In `Faq.tsx`, give the `<details>` a shared name so only one stays open: change `<details className={styles.item} key={f.q} open={i === 0}>` to add `name="faq"`: `<details className={styles.item} name="faq" key={f.q} open={i === 0}>`.
- [ ] **Step 2** In `Faq.module.css` append (modern `::details-content` animation, gracefully instant where unsupported):
```css
.item .toggle { transition: transform var(--dur-base) var(--ease); }
.item[open] .toggle { transform: rotate(45deg); }     /* "+" becomes "×" */
@supports (interpolate-size: allow-keywords) {
  :root { interpolate-size: allow-keywords; }
  .item::details-content {
    block-size: 0; overflow: hidden;
    transition: block-size var(--dur-slow) var(--ease), content-visibility var(--dur-slow) allow-discrete;
  }
  .item[open]::details-content { block-size: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .item .toggle { transition: none; }
  .item::details-content { transition: none; }
}
```
- [ ] **Step 3** Verify + commit — `feat: exclusive FAQ accordion with animated disclosure`.

### Task 12: OptimizeChart — animated bar fills + counters

**Files:** Modify `components/HowItWorks/OptimizeChart.tsx`, `components/HowItWorks/OptimizeChart.module.css`

- [ ] **Step 1** In `OptimizeChart.tsx`: add `'use client';` at the very top (Counter is a client component). Import Counter: `import { Counter } from '@/components/ui/Counter';`. Replace the bare `{r.signups}` in `.signups` with `<Counter value={r.signups} />`. Replace the foot `<span>127 signups · $2,841 mrr</span>` with:
```tsx
        <span><Counter value={127} /> signups · <Counter value={2841} format={(n) => `$${Math.round(n).toLocaleString()}`} /> mrr</span>
```
  Keep the `ROWS` data and winner logic unchanged.
- [ ] **Step 2** In `OptimizeChart.module.css`: make `.fill` animate its width from 0 on scroll-in. Find the `.fill` rule (width is set inline via `style`). Add:
```css
.fill { transform-origin: 0 50%; animation: bar-grow var(--reveal-dur) var(--ease) both; animation-timeline: view(); animation-range: entry 0% cover 24%; }
@keyframes bar-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@supports not (animation-timeline: view()) { .fill { animation: none; } }
@media (prefers-reduced-motion: reduce) { .fill { animation: none; } }
```
  Note: width stays the inline `%`; we animate `transform: scaleX` so the label text isn't squashed. Ensure `.barLabel` is not a child that scales — if `.barLabel` lives inside `.bar` (sibling of `.fill`), scaleX on `.fill` only affects the fill. Read the CSS to confirm; if `.barLabel` is inside `.fill`, move the animation to a `width` keyframe instead: `@keyframes bar-grow { from { width: 0; } }` applied with the inline width as the `to`.
- [ ] **Step 3** Verify + commit — `npx tsc --noEmit && npx next lint && npm run build`. Commit `feat: animate optimize chart bars + count up signups/MRR`.

### Task 12b: HowItWorks — step beam + clickable AnglePicker

**Files:** Modify `components/HowItWorks/HowItWorks.tsx`, `components/HowItWorks/HowItWorks.module.css`; Create `components/HowItWorks/AnglePicker.tsx` + `AnglePicker.module.css`

- [ ] **Step 1** Create `AnglePicker.tsx` (client) — port the static `VisualLaunch` markup into a stateful picker. Read the current `VisualLaunch` in `HowItWorks.tsx` for the exact angle data/markup, then:
```tsx
'use client';
import { useState } from 'react';
import styles from './AnglePicker.module.css';

const ANGLES = [
  { title: 'ship without the standup.', tag: 'process' },
  { title: 'speed is the feature.', tag: 'manifesto' },
  { title: 'the issue tracker for shipping.', tag: 'category' },
];

export function AnglePicker() {
  const [sel, setSel] = useState(0);
  return (
    <div className={styles.launch}>
      <div className={styles.launchHead}>5 angles · pick or ship all</div>
      {ANGLES.map((a, i) => (
        <button type="button" key={a.tag} onClick={() => setSel(i)}
          className={`${styles.angle} ${i === sel ? styles.angleSelected : ''}`} aria-pressed={i === sel}>
          <span className={styles.radio}>{i === sel ? <span className={styles.radioDot} /> : null}</span>
          <span className={styles.angleText}>
            <span className={styles.angleTitle}>{a.title}</span>
            <span className={styles.angleTag}>{a.tag}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
```
- [ ] **Step 2** Create `AnglePicker.module.css` — copy the `.launch/.launchHead/.angle/.angleSelected/.radio/.radioDot/.angleText/.angleTitle/.angleTag` rules verbatim from `HowItWorks.module.css` (read it), then add:
```css
.angle { width: 100%; text-align: left; background: none; border: inherit; cursor: pointer; font: inherit; transition: background var(--dur-fast) var(--ease); }
.angle:hover { background: var(--bg-raised); }
```
- [ ] **Step 3** In `HowItWorks.tsx`: delete the local `VisualLaunch` function and its usage; import and render `AnglePicker` in step 02's `.visual`: `import { AnglePicker } from './AnglePicker';` then `<AnglePicker />`. Add `reveal` to each `.step` wrapper. Remove the now-unused `VisualLaunch` (lint will fail on dead code otherwise).
- [ ] **Step 4** In `HowItWorks.module.css` append the vertical step-beam that draws on scroll:
```css
.steps { position: relative; }
.steps::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--border-hairline);
}
.steps::after {
  content: ''; position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: var(--accent);
  transform-origin: 50% 0; transform: scaleY(0);
  animation: beam-draw linear both; animation-timeline: view(--steps-view, block); animation-range: cover 0% cover 70%;
}
@keyframes beam-draw { to { transform: scaleY(1); } }
@supports not (animation-timeline: view()) { .steps::after { display: none; } }
@media (prefers-reduced-motion: reduce) { .steps::after { display: none; } }
```
  Note: if `.steps` already has left padding/grid that conflicts with an absolute rail, place the rail inside the existing left gutter or add `padding-left: var(--space-5)` to `.steps` and position the rail at `left: 0`. Read the existing `.steps`/`.step` layout first and adapt so the rail sits in the gutter, not over text.
- [ ] **Step 5** Verify + commit — `npx tsc --noEmit && npx next lint && npm run build`. Commit `feat: clickable angle picker + scroll-drawn step beam`.

### Task 13: StickyCta — sticky waitlist bar

**Files:** Create `components/StickyCta/StickyCta.tsx` + `StickyCta.module.css`; Modify `app/layout.tsx`

- [ ] **Step 1** Create `StickyCta.tsx`:
```tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './StickyCta.module.css';

export function StickyCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('section'); // first section = hero
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  if (dismissed) return null;
  return (
    <div className={`${styles.bar} ${show ? styles.show : ''}`} aria-hidden={!show}>
      <span className={styles.copy}>Meta ads, run for you — <strong>first month free</strong>.</span>
      <a className={styles.cta} href="#waitlist">join the waitlist →</a>
      <button className={styles.close} onClick={() => setDismissed(true)} aria-label="dismiss">×</button>
    </div>
  );
}
```
- [ ] **Step 2** Create `StickyCta.module.css` (cream surface, ink hairline top, blue CTA; slides up; hidden until `.show`):
```css
.bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  display: flex; align-items: center; gap: var(--space-4);
  padding: 12px max(env(safe-area-inset-left), 20px);
  background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(8px);
  border-top: 1px solid var(--fg);
  transform: translateY(110%); transition: transform var(--dur-slow) var(--ease);
}
.bar.show { transform: translateY(0); }
.copy { font-size: var(--size-14); color: var(--fg-2); flex: 1; }
.cta { color: var(--accent); font-weight: 600; text-decoration: none; white-space: nowrap; }
.close { background: none; border: 0; font-size: 20px; line-height: 1; color: var(--fg-3); cursor: pointer; }
@media (prefers-reduced-motion: reduce) { .bar { transition: none; } }
@media (min-width: 760px) { .copy { font-size: var(--size-16); } }
```
- [ ] **Step 3** In `app/layout.tsx`, import and mount after `{children}`: `import { StickyCta } from '@/components/StickyCta/StickyCta';` and render `<StickyCta />` just before `</body>`.
- [ ] **Step 4** Verify + commit — `npx tsc --noEmit && npx next lint && npm run build`. Commit `feat: sticky waitlist bar after hero`.

### Task 14: Hero — interactive demo + magnetic CTA + headline sheen

**Files:** Modify `components/Hero/Hero.tsx`, `components/Hero/Hero.module.css`, `components/LiveDemo/LiveDemo.tsx`, `components/LiveDemo/LiveDemo.module.css`

- [ ] **Step 1 — headline sheen + magnetic CTA in `Hero.tsx`:** change the headline accent span to use the sheen: `<span className="accent sheen">run for you</span>`. (Keep `.accent` for color fallback; `.sheen` from globals adds the one-pass sweep.) The Hero's waitlist CTA is the `WaitlistForm` submit, not a `Button` — leave `WaitlistForm` as-is here (its magnetic treatment is Task 15). No other change.
- [ ] **Step 2 — make the demo interactive in `LiveDemo.tsx`:** Read the file first. Add state for a user-entered domain and a "personalized" flag. Add an `onSubmit` form around the existing `.urlRow` so a visitor can type a domain; on valid submit, set the domain and restart the cycle personalized. Use the Task-2 helpers. Concretely:
  - Import helpers: `import { DEMO_URL, …, normalizeDomain, domainMonogram, domainAccent, faviconUrl } from './liveDemoMachine';`
  - Add `const [domain, setDomain] = useState<string | null>(null);` and `const [draft, setDraft] = useState('');`
  - Derive the active domain: `const activeDomain = domain ?? DEMO_URL;`
  - Make the typed-out URL show `activeDomain` instead of `DEMO_URL` in the autoplay typing loop (replace `DEMO_URL.length`/`DEMO_URL.slice` references with `activeDomain`). The `useEffect` cycle should depend on `activeDomain` so it restarts when the visitor submits.
  - Turn the static `.urlInput` area into a real `<form>` with an `<input>` (placeholder `your-saas.com`) + the existing generate button as the submit. On submit: `const d = normalizeDomain(draft); if (d) { setDomain(d); }` else shake/ignore.
  - In the canvas, when `domain` is set, render the favicon (`<img src={faviconUrl(domain)} … onError={fallbackToMonogram}>`) and use `domainAccent(domain)` for a decorative accent ring/monogram fallback (`domainMonogram(domain)`). Keep the existing scripted `clickup` visuals as the default when `domain` is null.
  - Honesty: keep the audit/customer/concept feed lines as the existing illustrative copy (do NOT claim real analysis of their site). Label the input area subtly, e.g. a small caption "preview — see it run on your site".
  - Preserve the pure reducer + timeline machine and the existing test. Do not change `liveDemoMachine.ts` exports except those added in Task 2.
- [ ] **Step 3 — `LiveDemo.module.css`:** add styles for the new `<input>` (transparent, inherits mono/url styling, focus ring uses `:focus-visible` from tokens) and the favicon/monogram in the canvas (small rounded mark, 1px ink border). Keep within tokens. Add a `prefers-reduced-motion` guard for any new transition.
- [ ] **Step 4 — Verify:** `npx tsc --noEmit && npx next lint && npx vitest run components/LiveDemo && npm run build` → all pass (reducer test still green). Commit `feat: make hero ad-generator interactive (type your own URL) + headline sheen`.

### Task 15: Nav + FinalCta + WaitlistForm — magnetic CTAs, active link, confetti

**Files:** Modify `components/Nav/Nav.tsx`, `components/Nav/Nav.module.css`, `components/FinalCta/FinalCta.tsx`, `components/FinalCta/FinalCta.module.css`, `components/ui/WaitlistForm.tsx`

- [ ] **Step 1 — Nav scroll-aware + active link:** Convert `Nav` to a small client island (add `'use client';`). Add a `scrolled` state via a scroll listener (or IntersectionObserver sentinel) and apply `styles.scrolled` past ~80px; add active-section highlighting via IntersectionObserver over the section ids (`how`, `compare`, `pricing`, `faq`) toggling an `styles.active` class on the matching link. Replace the primary nav CTA `<Button href="#waitlist" primary sm>` with `<MagneticButton href="#waitlist" primary sm>`. In `Nav.module.css` append:
```css
.nav { transition: background var(--dur-base) var(--ease), border-color var(--dur-base) var(--ease); }
.scrolled { background: color-mix(in srgb, var(--bg) 82%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border-hairline); }
.links a.active { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .nav { transition: none; } }
```
- [ ] **Step 2 — FinalCta:** add the sheen to the accent word (`<span className="accent sheen">shipping</span>`). Pass an `onDone` to the form so the confetti fires (see Step 3). Add `reveal` to the heading/sub if desired.
- [ ] **Step 3 — WaitlistForm confetti:** in `components/ui/WaitlistForm.tsx`, import `import { fireConfetti } from '@/lib/confetti';` and call it inside `handleSubmit` right after `setDone(true)`. Because `fireConfetti` no-ops in jsdom (no 2d ctx), `WaitlistForm.test.tsx` stays green. Run `npx vitest run components/ui/WaitlistForm.test.tsx` to confirm.
- [ ] **Step 4 — Verify + commit:** `npx tsc --noEmit && npx next lint && npx vitest run && npm run build` → all pass. Commit `feat: magnetic nav CTA + active-link nav + confetti on waitlist success`.

---

## Task 16: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1** `npx tsc --noEmit` → clean.
- [ ] **Step 2** `npx next lint` → clean (no unused vars/imports — magnetic refactors must not leave dead `Button` imports).
- [ ] **Step 3** `npx vitest run` → all green (reducer, helpers, counter, waitlist).
- [ ] **Step 4** `npm run build` → succeeds; eyeball the route's First Load JS in the build output and confirm it is still small (motion only in client islands).
- [ ] **Step 5** `npm run dev`, then with the webapp-testing/Playwright tooling capture full-page screenshots at 1280px and 390px of: hero (and the interactive demo after typing a domain), how-it-works (chart mid/after animation), pricing, final-cta + confetti. Save under a scratch dir.
- [ ] **Step 6** Re-load with `prefers-reduced-motion: reduce` emulated; confirm every section is static, fully visible, and legible (no hidden `.reveal` content, no beams, no sheen sweep, no confetti).
- [ ] **Step 7** Brand audit against the screenshots: exactly one blue per screen, borders-over-shadows intact, no new hues/gradients beyond the demo canvas, copy meaning unchanged.
- [ ] **Step 8** Commit any screenshot scratch removal / final tidy. Report results to the user (what changed, build size, screenshots).

---

## Self-review notes (author)

- **Spec coverage:** scroll progress (T1), section reveals (T1+T7–T14), scroll-aware nav + active link (T15), interactive hero (T14, T2), elevated PilotProof (T9), Problem hover (T7), animated OptimizeChart + counters (T12), step beam + clickable angles (T12b), Compare highlight (T8), Pricing featured beam/spotlight (T10), FAQ accordion (T11), FinalCta sheen + confetti + magnetic (T15, T6), sticky CTA (T13), reduced-motion everywhere, Motion only in MagneticButton (T5). Dropped credibility strip honored (not built). Number-tickers only in OptimizeChart/hero (honest). All spec sections map to a task.
- **Placeholder scan:** crux code is complete; integration steps that say "read the file first" are required because exact line numbers shift — paths and the precise edits are given.
- **Type/name consistency:** helper names (`normalizeDomain`, `domainMonogram`, `domainAccent`, `faviconUrl`) defined in T2 and consumed in T14; `Counter`/`easeOutCubic` defined T3, used T12; `SpotlightCard` T4 used T9/T10; `MagneticButton` T5 used T10/T15; `fireConfetti` T6 used T15; `.reveal`/`.sheen`/`.scrollProgress`/`@property --beam-angle` defined T1, used throughout; `.beam` block intentionally duplicated per-module (CSS Modules are scoped).
