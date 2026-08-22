import Link from 'next/link';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { ProofBand } from '@/components/ProofBand/ProofBand';
import { Mechanism } from '@/components/Mechanism/Mechanism';
import { BatchGrid } from '@/components/BatchGrid/BatchGrid';
import { WhoFor } from '@/components/WhoFor/WhoFor';
import { Ribbon } from '@/components/Ribbon/Ribbon';
import { Closer } from '@/components/Closer/Closer';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { FinalCta } from '@/components/FinalCta/FinalCta';
import { Footer } from '@/components/Footer/Footer';

const FAQS: FaqItem[] = [
  {
    q: 'Is this just another AI template tool?',
    a: 'No prompt box, no template picker. A real browser loads your client’s live site and measures the actual hex colors, fonts and logo on it; the angles come from real customer research and a competitor library ranked by how long Meta kept each ad running. Templates guess. We do the homework.',
  },
  {
    q: 'Will it invent things about my client’s brand?',
    a: 'No. The brand comes from their live site - measured colors, fonts and tokens - plus whatever they handed you: a deck, a design brief, call notes. Product screenshots are placed exactly as provided, never redrawn or imagined. If a reference ad’s look conflicts with the client’s brand, the client’s brand wins.',
  },
  {
    q: 'What actually happens on the call?',
    a: 'Twenty minutes with the founders. We drop in one of your client’s websites, you watch the research and first brief get built live, and we ask what part of your workflow eats the most time - your answers shape what we build next. Answering those earns your first client brief free, no card. If it’s not for you, you leave with the brief.',
  },
  {
    q: 'What formats do I get?',
    a: 'A client-ready creative brief you can export - concepts organized by awareness stage with full ad copy and references - plus finished static ads in feed and story sizes, auto-saved to your library.',
  },
  {
    q: 'Can we shape the roadmap?',
    a: 'That’s the point. We’re building this alongside a small group of agency design partners: you tell us which part of running creative eats the most hours, we automate it next. Design partners shape the roadmap and get direct line to the founders.',
  },
  {
    q: 'What does it cost?',
    a: (
      <>
        Your first client brief is free on a real client, no card. After that, plans start at $249 per month - quarterly
        billing takes 7.5% off and annual takes 15% -{' '}
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
      <ProofBand />
      <Mechanism />
      <BatchGrid />
      <WhoFor />
      <Ribbon />
      <Closer />
      <Faq title="Fair questions." items={FAQS} />
      <FinalCta />
      <Footer />
    </>
  );
}
