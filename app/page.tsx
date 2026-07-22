import Link from 'next/link';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { Mechanism } from '@/components/Mechanism/Mechanism';
import { BatchGrid } from '@/components/BatchGrid/BatchGrid';
import { Ribbon } from '@/components/Ribbon/Ribbon';
import { Closer } from '@/components/Closer/Closer';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { FinalCta } from '@/components/FinalCta/FinalCta';
import { Footer } from '@/components/Footer/Footer';

const FAQS: FaqItem[] = [
  {
    q: 'Is this just another AI template tool?',
    a: 'No prompt box, no template picker. A real browser loads your live site and measures the actual hex colors, fonts and logo on it; the layouts come from real competitor ads ranked by how long Meta kept them running. Templates guess. We measure.',
  },
  {
    q: 'Will it invent screenshots of my product?',
    a: 'Never. Your screenshots are placed exactly as you provide them - no redrawn dashboards, no imagined features. If the reference ad’s look conflicts with your brand, your brand wins.',
  },
  {
    q: 'What actually happens on the call?',
    a: 'Twenty minutes with the founders. We paste your URL, you watch your first batch get made, and you keep 5 ads free - no card. If it’s not for you, you leave with the ads.',
  },
  {
    q: 'What formats do I get?',
    a: 'Static Meta ads in feed and story sizes, rendered as finished images and auto-saved to your library. Short-form video is the next big build.',
  },
  {
    q: 'What does it cost?',
    a: (
      <>
        Your first 5 ads are free on your real brand, no card. Founding rates start at $149 per month and stay locked
        for as long as you stay -{' '}
        <Link href="/pricing" className="signal">
          full pricing here
        </Link>
        .
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Mechanism />
      <BatchGrid />
      <Ribbon />
      <Closer />
      <Faq title="Fair questions." items={FAQS} />
      <FinalCta />
      <Footer />
    </>
  );
}
