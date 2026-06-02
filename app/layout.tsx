import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { StickyCta } from '@/components/StickyCta/StickyCta';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://betteryourads.com';
const TITLE = 'betteryourads — meta ads, run for you';
const DESCRIPTION =
  'Done-for-you Meta ads for B2B SaaS. We learn your product, batch the creative, and run it on Facebook & Instagram — built for trial signups, not add-to-carts.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'betteryourads',
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
        <SmoothScroll />
        <div className="scrollProgress" aria-hidden />
        {children}
        <StickyCta />
      </body>
    </html>
  );
}
