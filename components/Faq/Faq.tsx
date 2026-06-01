import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'When does it actually launch?',
    a: "We're in private beta now and opening seats in waves through 2026. Waitlist signups get the next available seat, plus the first-month-free and 30-ads offer. We email you when your seat is ready. You only pay when you connect your Meta account and ship your first ad.",
  },
  {
    q: 'What metric does it optimize for?',
    a: "Trial signups by default, demo bookings if you're sales-led, paid conversions if you have self-serve checkout. We track cost per signup, MRR added per angle, and CAC payback. The numbers a founder actually defends in a board meeting. CTR and impressions are in the dashboard, just not what we tune against.",
  },
  {
    q: 'How is this different from a Meta-ads agency?',
    a: "We're a product, not a people business. Agencies bill for meetings, decks, and slow creative cycles. We bill for ads that ship and the signups they drive. The work that takes an agency weeks happens here in about 90 seconds, and the system gets better at your brand every time you use it.",
  },
  {
    q: 'Will this actually work for SaaS, or is it ecom dressed up?',
    a: "Built for SaaS funnels from day one. The angles, the audience model, the attribution window (28-day click, 7-day view), the conversion event (signup, not add-to-cart). All tuned for high-consideration software sales. We don't do shopify ads. If you sell shoes, you're in the wrong place.",
  },
  {
    q: 'What does it do with my Meta account?',
    a: "We connect via Meta's official Marketing API. We create campaigns, ad sets, and creative inside your account. You own everything. You can pull our access any time and the ads keep running. We never touch budget beyond the daily cap you set.",
  },
];

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap-narrow">
        <SectionHead eyebrow="questions, mostly heard twice" title="Frequently asked." />
        <div className={styles.list}>
          {FAQS.map((f, i) => (
            <details className={styles.item} name="faq" key={f.q} open={i === 0}>
              <summary className={styles.q}>
                <span>{f.q}</span>
                <span className={styles.toggle}>+</span>
              </summary>
              <p className={styles.a}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
