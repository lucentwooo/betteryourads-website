/* =================================================================
   BatchDemo v2 — pure phase / timing logic.

   The demo is a calm, cinematic LOOP that shows the core USP:
   one reference ad → eight on-brand variations (batch creation).

   All timing, labels and the reveal-stagger math live here so they
   can be unit-tested without a DOM. BatchDemo.tsx is a thin
   timer/render shell over this.
   ================================================================= */

import { VARIATION_COUNT } from '@/lib/demoAds';

/** Loop phases, in order. */
export const enum Phase {
  Reference = 0, // 1 · your reference ad
  Generate = 1, //  2 · generating variations
  Reveal = 2, //    3 · one becomes eight (staggered reveal)
  Hold = 3, //      4 · the 4×2 grid rests
}

export const PHASE_COUNT = 4;

/**
 * Per-phase dwell times (ms). Deliberately SLOW and legible — the
 * founder's note was the old reel felt "too fast and glitchy".
 *   reference 2.0s · generate 1.3s · reveal 3.0s · hold 3.0s  => 9.3s loop.
 */
export const PHASE_MS: Record<Phase, number> = {
  [Phase.Reference]: 2000,
  [Phase.Generate]: 1300,
  [Phase.Reveal]: 3000,
  [Phase.Hold]: 3000,
};

/** Total loop duration in ms. */
export const LOOP_MS = (Object.values(PHASE_MS) as number[]).reduce(
  (a, b) => a + b,
  0,
);

/** Cumulative start offset (ms) of a phase from the top of the loop. */
export function phaseStartMs(phase: Phase): number {
  let acc = 0;
  for (let p = Phase.Reference; p < phase; p++) acc += PHASE_MS[p as Phase];
  return acc;
}

/** Phase label rendered above the stage. */
export function phaseLabel(phase: Phase): string {
  switch (phase) {
    case Phase.Reference:
      return '1 · your reference ad';
    case Phase.Generate:
      return '2 · generating variations';
    case Phase.Reveal:
      return '3 · 8 on-brand variations';
    case Phase.Hold:
      return '3 · 8 on-brand variations';
  }
}

/** Whether the grid of variations is (at least partly) on screen for a phase. */
export function showsGrid(phase: Phase): boolean {
  return phase >= Phase.Reveal;
}

/* ----- The reveal cascade (phase 3) ----------------------------- */

/**
 * Per-cell stagger (ms) for the reveal. Each variation settles into the
 * grid ~260ms after the previous — "one becomes eight", legibly slow.
 */
export const REVEAL_STAGGER_MS = 260;

/**
 * How many of the 8 variations have settled into the grid `elapsed` ms
 * into the Reveal phase. Cell `i` (0-based) appears at `i * stagger`.
 * Clamps to [0, VARIATION_COUNT]. Pure — drives both the cells and the
 * live counter, and is unit-tested without a DOM.
 */
export function revealedCountAt(elapsedMs: number): number {
  if (elapsedMs < 0) return 0;
  const n = Math.floor(elapsedMs / REVEAL_STAGGER_MS) + 1;
  return Math.min(VARIATION_COUNT, Math.max(0, n));
}

/** The reveal delay (ms, from the start of the Reveal phase) for cell `i`. */
export function revealDelayMs(i: number): number {
  return i * REVEAL_STAGGER_MS;
}

/** Footer caption. Same honest line throughout the loop. */
export function footerLine(): string {
  return 'one reference → eight angles · batch-generated, on-brand';
}
