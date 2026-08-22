import type { Metadata } from 'next';
import { Nav } from '@/components/Nav/Nav';
import { Pricing } from '@/components/Pricing/Pricing';
import { Faq, type FaqItem } from '@/components/Faq/Faq';
import { Footer } from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'Pricing - Loopy · free first brief, plans from $249/mo',
  description:
    'Try Loopy free on a real client: research, ranked ad concepts and a ready-to-send creative brief, no card. Starter $249/mo, Agency $499/mo. Quarterly −7.5%, annual −15%.',
  alternates: { canonical: '/pricing' },
};

const FAQS: FaqItem[] = [
  {
    q: 'Do you offer discounts?',
    a: (
      <>
        Yes - quarterly billing takes 7.5% off every paid plan and annual billing takes 15% off. The toggle at the top
        of the pricing table shows the exact monthly-equivalent price for each.
      </>
    ),
  },
  {
    q: 'What counts as an ad?',
    a: 'One finished rendered image. Every render auto-saves to your library - generating is saving, there’s no approve step and no charge for re-downloads.',
  },
  {
    q: 'Why do I have to book a call?',
    a: 'We’re onboarding agencies by hand while the product is early - it keeps quality high and gets you set up in one sitting. You bring a client’s URL, watch their first brief get built, answer a few questions about your workflow, and keep that first brief free.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel at the end of the cycle; you keep everything in your library.',
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
