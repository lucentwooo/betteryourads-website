import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { WORKED_EXAMPLE, WALL_BRANDS, allWallAds } from './creatives';

describe('creatives catalogue', () => {
  it('worked example is Notion with 4 ads', () => {
    expect(WORKED_EXAMPLE.brand).toBe('notion');
    expect(WORKED_EXAMPLE.ads).toHaveLength(4);
  });
  it('wall has at least 8 brands and excludes the worked example', () => {
    expect(WALL_BRANDS.length).toBeGreaterThanOrEqual(8);
    expect(WALL_BRANDS.some((b) => b.brand === 'notion')).toBe(false);
  });
  it('every catalogued file exists in public/', () => {
    for (const ad of [...WORKED_EXAMPLE.ads, ...allWallAds()]) {
      expect(existsSync(join('public', ad.src))).toBe(true);
    }
  });
});
