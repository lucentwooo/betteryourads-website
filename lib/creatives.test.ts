import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { WORKED_EXAMPLE, HERO_BRAND, WALL_BRANDS, allWallAds } from './creatives';

describe('creatives catalogue', () => {
  it('pipeline worked example is Notion with 4 ads', () => {
    expect(WORKED_EXAMPLE.brand).toBe('notion');
    expect(WORKED_EXAMPLE.ads).toHaveLength(4);
  });
  it('hero brand is Zoom: a reference + 4 variations', () => {
    expect(HERO_BRAND.brand).toBe('zoom');
    expect(HERO_BRAND.ads).toHaveLength(5);
  });
  it('wall excludes both the hero (zoom) and pipeline (notion) brands', () => {
    expect(WALL_BRANDS.length).toBeGreaterThanOrEqual(8);
    expect(WALL_BRANDS.some((b) => b.brand === 'notion')).toBe(false);
    expect(WALL_BRANDS.some((b) => b.brand === 'zoom')).toBe(false);
  });
  it('skips the weak zapier creative (ad-03)', () => {
    const zapier = WALL_BRANDS.find((b) => b.brand === 'zapier');
    expect(zapier?.ads.some((a) => a.src.includes('zapier/ad-03'))).toBe(false);
  });
  it('every catalogued file exists in public/', () => {
    for (const ad of [...WORKED_EXAMPLE.ads, ...HERO_BRAND.ads, ...allWallAds()]) {
      expect(existsSync(join('public', ad.src))).toBe(true);
    }
  });
});
