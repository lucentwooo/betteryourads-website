import type { Metadata } from 'next';
import { Nav } from '@/components/Nav/Nav';
import { Pricing } from '@/components/Pricing/Pricing';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { Footer } from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'Pricing — Loopy · founding rates, locked in',
  description:
    'Try Loopy free: 5 finished Meta ads on your real brand, no card. Founding rates from $149/month: 50 on-brand ads a month, locked in for as long as you stay.',
  alternates: { canonical: '/pricing' },
};

const FAQS: FaqItem[] = [
  {
    q: 'What’s a founding rate?',
    a: 'The price you join at is the price you keep, for as long as you stay subscribed - even as the product grows and public pricing goes up. Genuinely early-customer pricing, nothing synthetic.',
  },
  {
    q: 'What counts as an ad?',
    a: 'One finished rendered image. Every render auto-saves to your library - generating is saving, there’s no approve step and no charge for re-downloads.',
  },
  {
    q: 'Why do I have to book a call?',
    a: 'We’re onboarding founding customers by hand while the product is early - it keeps quality high and gets you set up in one sitting. You’ll watch your first batch render, answer a few basic market research questions, and keep 10 ads free.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel at the end of the cycle; you keep everything in your library. The founding rate only lapses if you leave.',
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav page="pricing" />
      <Pricing />
      <Faq title="Pricing questions." items={FAQS} variant="pricing" />
      <Footer page="pricing" />
    </div>
  );
}
