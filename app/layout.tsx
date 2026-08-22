import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import { FREE_PLAN, PAID_PLANS } from '@/lib/billing-catalog';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const TITLE = 'Meta ad research, briefs & creative, automated for agencies - Loopy';
const DESCRIPTION =
  "Drop in a client's website. Loopy reads the real brand, researches customers and competitors, and turns it into ranked ad concepts and a client-ready creative brief in minutes - then renders the on-brand creative too. First client brief free.";

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
        "Loopy automates the research and brief work behind an agency's Meta ads: drop in a client's website, and it reads the real brand, researches customers and competitors, then turns it into ranked ad concepts and a client-ready creative brief - with on-brand renders attached.",
      offers: [
        {
          '@type': 'Offer',
          name: FREE_PLAN.name,
          price: '0',
          priceCurrency: 'USD',
        },
        ...PAID_PLANS.map((plan) => ({
          '@type': 'Offer',
          name: plan.name,
          price: String(plan.monthlyPrice),
          priceCurrency: 'USD',
        })),
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
