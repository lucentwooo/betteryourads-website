import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// lastModified should reflect when the page's content actually changed, not
// the build time - crawlers learn to ignore a lastmod that moves every deploy.
// Update the date when you materially edit a page.
const PAGES: { path: string; lastModified: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
  { path: '/', lastModified: '2026-08-22', changeFrequency: 'weekly', priority: 1 },
  { path: '/ad-creative-brief-template', lastModified: '2026-08-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing', lastModified: '2026-08-22', changeFrequency: 'monthly', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: p.lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
