import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { HERO_WALL_A, HERO_WALL_B, CTA_MARQUEE } from './creatives';

describe('creatives catalogue', () => {
  it('hero wall has two columns of six', () => {
    expect(HERO_WALL_A).toHaveLength(6);
    expect(HERO_WALL_B).toHaveLength(6);
  });

  it('wall columns are disjoint (no ad appears twice in the hero)', () => {
    const a = new Set(HERO_WALL_A.map((c) => c.src));
    expect(HERO_WALL_B.some((c) => a.has(c.src))).toBe(false);
  });

  it('marquee covers all 11 brands and nothing else', () => {
    expect(CTA_MARQUEE).toHaveLength(11);
    expect(CTA_MARQUEE.every((c) => c.src.startsWith('/creatives/'))).toBe(true);
  });

  it('wall ads carry alt text; marquee ads are decorative', () => {
    for (const ad of [...HERO_WALL_A, ...HERO_WALL_B]) expect(ad.alt).not.toBe('');
    for (const ad of CTA_MARQUEE) expect(ad.alt).toBe('');
  });

  it('every catalogued file exists in public/', () => {
    for (const ad of [...HERO_WALL_A, ...HERO_WALL_B, ...CTA_MARQUEE]) {
      expect(existsSync(join('public', ad.src)), ad.src).toBe(true);
    }
  });
});

describe('brief template download', () => {
  it('ships the static Markdown file linked from TemplateTabs', () => {
    expect(existsSync(join(process.cwd(), 'public', 'ad-creative-brief-template.md'))).toBe(true);
  });
});
