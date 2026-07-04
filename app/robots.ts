import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryloopy.io';

// Allow every crawler, including AI answer-engine bots (GPTBot, ClaudeBot,
// PerplexityBot, OAI-SearchBot, Google-Extended). AI visibility depends on
// them being able to read the site, so we deliberately do not block them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
