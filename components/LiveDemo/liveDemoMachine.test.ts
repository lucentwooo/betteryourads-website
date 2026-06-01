import { describe, it, expect } from 'vitest';
import {
  statusText,
  feedRowState,
  stepLabel,
  canvasOpacities,
  FEED_DEFS,
  normalizeDomain,
  domainMonogram,
  domainAccent,
  faviconUrl,
} from './liveDemoMachine';

describe('statusText', () => {
  it('maps each phase to its label', () => {
    expect(statusText(0)).toBe('type a url to begin');
    expect(statusText(1)).toBe('auditing your site');
    expect(statusText(3)).toBe('extracting brand');
    expect(statusText(4)).toBe('extracting brand');
    expect(statusText(7)).toBe('shipped to meta, day 1 of 30');
  });
});

describe('feedRowState', () => {
  it('marks the audit row active at phase 1 and done after', () => {
    expect(feedRowState(FEED_DEFS[0], 1)).toBe('active');
    expect(feedRowState(FEED_DEFS[0], 2)).toBe('done');
    expect(feedRowState(FEED_DEFS[0], 0)).toBe('idle');
  });
  it('keeps brand active across phases 3 and 4', () => {
    expect(feedRowState(FEED_DEFS[2], 3)).toBe('active');
    expect(feedRowState(FEED_DEFS[2], 4)).toBe('active');
    expect(feedRowState(FEED_DEFS[2], 5)).toBe('done');
  });
  it('creative is done only at phase 7', () => {
    expect(feedRowState(FEED_DEFS[4], 6)).toBe('active');
    expect(feedRowState(FEED_DEFS[4], 7)).toBe('done');
  });
});

describe('stepLabel', () => {
  it('clamps to "step N of 6"', () => {
    expect(stepLabel(0)).toBe('step 0 of 6');
    expect(stepLabel(3)).toBe('step 3 of 6');
    expect(stepLabel(7)).toBe('step 6 of 6');
  });
});

describe('canvasOpacities', () => {
  it('wire fades out as progress rises; image fades in late', () => {
    const start = canvasOpacities(0);
    expect(start.wire).toBe(1);
    expect(start.img).toBe(0);
    const end = canvasOpacities(1);
    expect(end.wire).toBe(0);
    expect(end.img).toBeGreaterThan(0.9);
  });
});

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
