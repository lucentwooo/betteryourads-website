/* =================================================================
   BatchDemo — pure phase/selection logic.

   The showreel is a 6-phase loop. All timing, labels and the
   pick-cascade math live here so they can be unit-tested without a
   DOM. The component (BatchDemo.tsx) is a thin timer/render shell
   over this.
   ================================================================= */

/** Showreel phases, in order. Phase 0 is the brief "blank" before brand. */
export const enum Phase {
  Brand = 0, // 1 · learns your brand
  Concepts = 1, // 2 · 12 concepts
  Pick = 2, // 3 · pick what you want
  Batch = 3, // 4 · batch
  Wall = 4, // 5 · the wall of ads
  Payoff = 5, // 6 · competitor-contrast payoff beat
}

export const PHASE_COUNT = 6;

/**
 * Per-phase dwell times (ms). Sum is the full loop length.
 * Tuned to the brief: ~1s brand, ~0.7s concepts, ~1.2s pick,
 * ~0.5s batch, ~1.4s wall, ~1.8s payoff  => ~6.6s loop.
 */
export const PHASE_MS: Record<Phase, number> = {
  [Phase.Brand]: 1000,
  [Phase.Concepts]: 700,
  [Phase.Pick]: 1200,
  [Phase.Batch]: 500,
  [Phase.Wall]: 1400,
  [Phase.Payoff]: 1800,
};

/** Total loop duration in ms. */
export const LOOP_MS = (Object.values(PHASE_MS) as number[]).reduce((a, b) => a + b, 0);

/** Cumulative start offset (ms) of each phase from the top of the loop. */
export function phaseStartMs(phase: Phase): number {
  let acc = 0;
  for (let p = Phase.Brand; p < phase; p++) acc += PHASE_MS[p as Phase];
  return acc;
}

/** Small label rendered top-left of the card body for each phase. */
export function phaseLabel(phase: Phase): string {
  switch (phase) {
    case Phase.Brand:
      return '1 · learns your brand';
    case Phase.Concepts:
      return '2 · 12 concepts';
    case Phase.Pick:
      return '3 · pick what you want';
    case Phase.Batch:
      return '4 · batch';
    case Phase.Wall:
      return '5 · 10 on-brand ads, ready to ship';
    case Phase.Payoff:
      return '6 · ready to ship';
  }
}

/* ----- Concepts (phase 2) + the pick cascade (phase 3) ---------- */

/** The 12 concept tiles offered in phase 2. */
export const CONCEPTS = [
  'process',
  'proof',
  'category',
  'manifesto',
  'rebuttal',
  'comparison',
  'founder',
  'before/after',
  'stat',
  'testimonial',
  'objection',
  'use-case',
] as const;

export const CONCEPT_COUNT = CONCEPTS.length; // 12

/**
 * Indices (into CONCEPTS) the viewer "picks" in phase 3 — 10 of 12.
 * Two are intentionally left unselected (rebuttal #4, objection #10) to
 * imply real choice. Order here = cascade order.
 */
export const SELECTED_ORDER = [0, 1, 2, 3, 5, 6, 7, 8, 9, 11];

export const SELECTED_COUNT = SELECTED_ORDER.length; // 10

/** Per-tile stagger (ms) for the phase-3 selection cascade. */
export const PICK_STEP_MS = 80;

/**
 * How many tiles are selected `elapsed` ms into the Pick phase.
 * Clamps to [0, SELECTED_COUNT]. Used both to drive the live counter
 * and to test the cascade timing without a DOM.
 */
export function selectedCountAt(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const n = Math.floor(elapsedMs / PICK_STEP_MS) + 1;
  return Math.min(SELECTED_COUNT, Math.max(0, n));
}

/** The set of selected concept indices after `elapsed` ms of the Pick cascade. */
export function selectedSetAt(elapsedMs: number): Set<number> {
  return new Set(SELECTED_ORDER.slice(0, selectedCountAt(elapsedMs)));
}

/**
 * Whether the wall + its labels should be shown for a given phase.
 * (Phase.Wall onward — i.e. the wall persists through the payoff beat.)
 */
export function showsWall(phase: Phase): boolean {
  return phase >= Phase.Wall;
}

/** Footer line. Swaps to the honest competitor contrast on the payoff beat. */
export function footerLine(phase: Phase): string {
  if (phase === Phase.Payoff) {
    return 'agencies: weeks for a handful. betteryourads: a full batch, on-brand, in minutes.';
  }
  return 'pick concepts → batch → a wall of on-brand ads.';
}

/* ----- The ad wall (phase 5) ------------------------------------ */

/**
 * Layout kinds for the 10 distinct mini ad creatives. The component maps
 * each to a bespoke CSS layout; keeping the list here lets a test assert
 * we render the full, varied set (not 10 identical boxes).
 */
export type AdKind =
  | 'headline' // bold headline + accent underline
  | 'stat' // big "2.4×" metric
  | 'quote' // short testimonial
  | 'beforeAfter' // mini before/after bars
  | 'logo' // logo-lockup + tagline
  | 'question' // question hook
  | 'features' // 3-tick feature list
  | 'manifesto' // all-caps manifesto
  | 'compare' // us vs them
  | 'cta'; // start free CTA

export interface AdDef {
  kind: AdKind;
  /** Creative tint: which brand-ish color anchors this mockup. */
  tint: 'accent' | 'forest' | 'rust' | 'paper' | 'ink';
}

/** The 10 ads on the wall, in render order. Distinct kinds + varied tints. */
export const AD_WALL: AdDef[] = [
  { kind: 'headline', tint: 'paper' },
  { kind: 'stat', tint: 'accent' },
  { kind: 'quote', tint: 'paper' },
  { kind: 'beforeAfter', tint: 'forest' },
  { kind: 'logo', tint: 'ink' },
  { kind: 'question', tint: 'rust' },
  { kind: 'features', tint: 'paper' },
  { kind: 'manifesto', tint: 'ink' },
  { kind: 'compare', tint: 'paper' },
  { kind: 'cta', tint: 'accent' },
];

export const AD_COUNT = AD_WALL.length; // 10

/** Per-ad stagger (ms) for the wall snap-in. Fast, so it reads as "boom". */
export const WALL_STEP_MS = 42;
