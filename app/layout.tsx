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

export const metadata: Metadata = {
  title: 'betteryourads — meta ads, built for b2b saas',
  description:
    'We learn your product, write the angles, ship the creative, and run the Meta ads. Built for SaaS funnels — not ecommerce.',
  icons: { icon: '/favicon.svg' },
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
