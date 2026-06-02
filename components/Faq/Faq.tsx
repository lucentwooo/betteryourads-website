import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'Is it really done for me?',
    a: 'Yes. You book a call, share your product, and we run the ads end-to-end — angles, creative, launch, and weekly iteration. Our software does the heavy lifting; you stay a founder.',
  },
  {
    q: 'What does it cost?',
    a: "Flat monthly, no retainer and no per-creative hours. Your first month is free with 30 ads on us — we'll walk through pricing on the pilot call.",
  },
  {
    q: 'Why SaaS only?',
    a: 'SaaS sells on trials and long cycles, not add-to-carts. Every angle and metric we optimize is built for trial-to-paid — not ecommerce ROAS.',
  },
  {
    q: 'What do you need from me?',
    a: 'Your URL and ad-account access. No briefing docs, no creative direction — we extract positioning, ICP, and palette automatically.',
  },
  {
    q: 'When can I start?',
    a: "We're running two pilots now and opening seats in waves. Book a call and we'll tell you the next opening.",
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
