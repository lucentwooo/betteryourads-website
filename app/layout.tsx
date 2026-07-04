import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { StickyCta } from '@/components/StickyCta/StickyCta';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryloopy.io';
const TITLE = 'loopy · never run out of meta ad creative';
const DESCRIPTION =
  'Creative fatigue kills Meta ads. Loopy learns your brand and batches fresh on-brand ads whenever you need them, launches them on Facebook and Instagram, and shows you what’s winning. More paying customers, no agency. You run it, you own the account.';

// Entity-identity structured data. Per current evidence JSON-LD does not lift
// AI citations, but Organization + WebSite help engines identify Loopy as a
// distinct entity. Add sameAs (LinkedIn / Crunchbase / X) once those exist.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Loopy',
      url: SITE_URL,
      logo: `${SITE_URL}/loopy-logo.png`,
      description: DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Loopy',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      description: DESCRIPTION,
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
    siteName: 'loopy',
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
        <div className="scrollProgress" aria-hidden />
        {children}
        <StickyCta />
      </body>
    </html>
  );
}
