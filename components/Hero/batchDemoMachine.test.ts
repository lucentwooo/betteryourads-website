import { describe, it, expect } from 'vitest';
import { VARIATION_COUNT } from '@/lib/demoAds';
import {
  Phase,
  PHASE_COUNT,
  PHASE_MS,
  LOOP_MS,
  phaseStartMs,
  phaseLabel,
  showsGrid,
  REVEAL_STAGGER_MS,
  revealedCountAt,
  revealDelayMs,
  footerLine,
} from './batchDemoMachine';

describe('phase timeline', () => {
  it('has 4 phases that sum to the loop length', () => {
    expect(PHASE_COUNT).toBe(4);
    const sum = (Object.values(PHASE_MS) as number[]).reduce((a, b) => a + b, 0);
    expect(LOOP_MS).toBe(sum);
    // Deliberately slow + legible: the whole loop sits in the ~9–10s window.
    expect(LOOP_MS).toBeGreaterThanOrEqual(9000);
    expect(LOOP_MS).toBeLessThanOrEqual(10000);
  });

  it('holds each beat long enough to read (reference + hold are generous)', () => {
    expect(PHASE_MS[Phase.Reference]).toBeGreaterThanOrEqual(2000);
    expect(PHASE_MS[Phase.Hold]).toBeGreaterThanOrEqual(3000);
  });

  it('computes cumulative phase start offsets', () => {
    expect(phaseStartMs(Phase.Reference)).toBe(0);
    expect(phaseStartMs(Phase.Generate)).toBe(PHASE_MS[Phase.Reference]);
    expect(phaseStartMs(Phase.Reveal)).toBe(
      PHASE_MS[Phase.Reference] + PHASE_MS[Phase.Generate],
    );
    expect(phaseStartMs(Phase.Hold)).toBe(LOOP_MS - PHASE_MS[Phase.Hold]);
  });

  it('labels every phase with its honest copy', () => {
    expect(phaseLabel(Phase.Reference)).toBe('1 · your reference ad');
    expect(phaseLabel(Phase.Generate)).toBe('2 · generating variations');
    expect(phaseLabel(Phase.Reveal)).toBe('3 · 8 on-brand variations');
    // Reveal and Hold share the "8 on-brand variations" label (continuous beat).
    expect(phaseLabel(Phase.Hold)).toBe(phaseLabel(Phase.Reveal));
  });
});

describe('grid visibility', () => {
  it('shows the grid from the Reveal phase onward', () => {
    expect(showsGrid(Phase.Reference)).toBe(false);
    expect(showsGrid(Phase.Generate)).toBe(false);
    expect(showsGrid(Phase.Reveal)).toBe(true);
    expect(showsGrid(Phase.Hold)).toBe(true);
  });
});

describe('reveal cascade', () => {
  it('reveals one cell per stagger step and clamps at 8', () => {
    expect(revealedCountAt(-1)).toBe(0);
    expect(revealedCountAt(0)).toBe(1); // first cell is in from t=0
    expect(revealedCountAt(REVEAL_STAGGER_MS - 1)).toBe(1);
    expect(revealedCountAt(REVEAL_STAGGER_MS)).toBe(2);
    expect(revealedCountAt(REVEAL_STAGGER_MS * 3)).toBe(4);
    // The 8th (last) cell is in by its delay.
    expect(revealedCountAt(REVEAL_STAGGER_MS * (VARIATION_COUNT - 1))).toBe(
      VARIATION_COUNT,
    );
    // Well past the cascade: clamps to the full count, never more.
    expect(revealedCountAt(REVEAL_STAGGER_MS * 50)).toBe(VARIATION_COUNT);
    expect(revealedCountAt(999999)).toBe(VARIATION_COUNT);
  });

  it('matches revealDelayMs — a cell is counted once its delay has elapsed', () => {
    for (let i = 0; i < VARIATION_COUNT; i++) {
      // At exactly the cell's delay it should be counted (>= i + 1 revealed).
      expect(revealedCountAt(revealDelayMs(i))).toBeGreaterThanOrEqual(i + 1);
    }
    expect(revealDelayMs(0)).toBe(0);
    expect(revealDelayMs(1)).toBe(REVEAL_STAGGER_MS);
  });

  it('finishes the cascade within the Reveal phase, leaving a beat to rest', () => {
    const lastDelay = revealDelayMs(VARIATION_COUNT - 1);
    // The last cell starts animating before the Reveal phase ends.
    expect(lastDelay).toBeLessThan(PHASE_MS[Phase.Reveal]);
  });
});

describe('footer', () => {
  it('states the one→eight USP honestly', () => {
    const line = footerLine();
    expect(line).toContain('one reference');
    expect(line).toContain('eight');
    expect(line).toContain('on-brand');
    // Honest: no fabricated precise stat like "8 ads in 12 seconds".
    expect(line).not.toMatch(/\d+\s*ads?\s*in\s*\d+/i);
  });
});
