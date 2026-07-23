import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/site';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const TITLE = 'AI Meta ad generator from your URL — Loopy';
const DESCRIPTION =
  'Paste your URL. Loopy reads your live site (real colors, fonts, logo) and turns proven ad layouts into finished, on-brand Meta ads in minutes. First 10 ads free.';

// Entity-identity structured data: Organization + WebSite identify Loopy as a
// distinct entity; SoftwareApplication carries the plan offers.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Loopy',
      url: SITE_URL,
      logo: `${SITE_URL}/loopy-logo.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Loopy',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Loopy',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description:
        "Loopy turns a website URL into finished, on-brand static Meta ads: a real browser measures the site's actual colors, fonts and logo, then reskins proven ad layouts with them.",
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Early Access', price: '149', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro', price: '249', priceCurrency: 'USD' },
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Favicon comes from the app/icon.png file convention (the real Loopy
  // logomark). Next auto-injects the <link rel="icon"> tag, so no manual
  // icons config is needed here.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Loopy',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-KWJK7YVM44" />
    </html>
  );
}
