import { describe, it, expect } from 'vitest';
import {
  Phase,
  PHASE_COUNT,
  PHASE_MS,
  LOOP_MS,
  phaseStartMs,
  phaseLabel,
  CONCEPTS,
  CONCEPT_COUNT,
  SELECTED_ORDER,
  SELECTED_COUNT,
  PICK_STEP_MS,
  selectedCountAt,
  selectedSetAt,
  showsWall,
  footerLine,
  AD_WALL,
  AD_COUNT,
} from './batchDemoMachine';

describe('phase timeline', () => {
  it('has 6 phases that sum to the loop length', () => {
    expect(PHASE_COUNT).toBe(6);
    const sum = (Object.values(PHASE_MS) as number[]).reduce((a, b) => a + b, 0);
    expect(LOOP_MS).toBe(sum);
    // Sanity: the whole loop sits in the intended ~6–7s window.
    expect(LOOP_MS).toBeGreaterThanOrEqual(6000);
    expect(LOOP_MS).toBeLessThanOrEqual(7000);
  });

  it('computes cumulative phase start offsets', () => {
    expect(phaseStartMs(Phase.Brand)).toBe(0);
    expect(phaseStartMs(Phase.Concepts)).toBe(PHASE_MS[Phase.Brand]);
    expect(phaseStartMs(Phase.Pick)).toBe(PHASE_MS[Phase.Brand] + PHASE_MS[Phase.Concepts]);
    expect(phaseStartMs(Phase.Payoff)).toBe(LOOP_MS - PHASE_MS[Phase.Payoff]);
  });

  it('labels every phase with its honest copy', () => {
    expect(phaseLabel(Phase.Brand)).toMatch(/^1 · learns your brand$/);
    expect(phaseLabel(Phase.Concepts)).toBe('2 · 12 concepts');
    expect(phaseLabel(Phase.Pick)).toBe('3 · pick what you want');
    expect(phaseLabel(Phase.Batch)).toBe('4 · batch');
    expect(phaseLabel(Phase.Wall)).toContain('10 on-brand ads');
  });
});

describe('concepts + pick cascade', () => {
  it('offers exactly 12 concepts and picks 10 of them', () => {
    expect(CONCEPT_COUNT).toBe(12);
    expect(CONCEPTS).toHaveLength(12);
    expect(SELECTED_COUNT).toBe(10);
    expect(SELECTED_ORDER).toHaveLength(10);
    // Two are left unselected to imply real choice.
    expect(CONCEPT_COUNT - SELECTED_COUNT).toBe(2);
  });

  it('only ever references valid, unique concept indices', () => {
    const unique = new Set(SELECTED_ORDER);
    expect(unique.size).toBe(SELECTED_ORDER.length);
    for (const i of SELECTED_ORDER) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(CONCEPT_COUNT);
    }
  });

  it('reveals selections one-per-step and clamps at 10', () => {
    expect(selectedCountAt(0)).toBe(0);
    expect(selectedCountAt(1)).toBe(1);
    expect(selectedCountAt(PICK_STEP_MS)).toBe(2);
    expect(selectedCountAt(PICK_STEP_MS * 4)).toBe(5);
    // Well past the cascade end: clamps to the full 10, never more.
    expect(selectedCountAt(PICK_STEP_MS * 50)).toBe(SELECTED_COUNT);
    expect(selectedCountAt(999999)).toBe(SELECTED_COUNT);
  });

  it('builds the selected set incrementally in cascade order', () => {
    expect(selectedSetAt(0).size).toBe(0);
    const mid = selectedSetAt(PICK_STEP_MS * 2); // 3 selected
    expect(mid.size).toBe(3);
    expect(mid).toEqual(new Set(SELECTED_ORDER.slice(0, 3)));
    expect(selectedSetAt(999999)).toEqual(new Set(SELECTED_ORDER));
  });
});

describe('wall visibility + footer', () => {
  it('shows the wall from the Wall phase onward', () => {
    expect(showsWall(Phase.Brand)).toBe(false);
    expect(showsWall(Phase.Pick)).toBe(false);
    expect(showsWall(Phase.Batch)).toBe(false);
    expect(showsWall(Phase.Wall)).toBe(true);
    expect(showsWall(Phase.Payoff)).toBe(true);
  });

  it('swaps the footer to the competitor contrast only on the payoff beat', () => {
    expect(footerLine(Phase.Wall)).not.toContain('agencies');
    const payoff = footerLine(Phase.Payoff);
    expect(payoff).toContain('agencies');
    expect(payoff).toContain('betteryourads');
    // Honest: no fabricated precise stat like "10 ads in 90 seconds".
    expect(payoff).not.toMatch(/\d+\s*ads?\s*in\s*\d+/i);
  });
});

describe('the ad wall', () => {
  it('renders 10 ads with distinct layout kinds', () => {
    expect(AD_COUNT).toBe(10);
    expect(AD_WALL).toHaveLength(10);
    const kinds = new Set(AD_WALL.map((a) => a.kind));
    // Every ad is a different layout — not 10 identical boxes.
    expect(kinds.size).toBe(10);
  });

  it('uses a varied but on-brand palette across the wall', () => {
    const tints = new Set(AD_WALL.map((a) => a.tint));
    // More than one tint in play, all from the allowed creative set.
    expect(tints.size).toBeGreaterThan(1);
    const allowed = new Set(['accent', 'forest', 'rust', 'paper', 'ink']);
    for (const t of tints) expect(allowed.has(t)).toBe(true);
  });
});
