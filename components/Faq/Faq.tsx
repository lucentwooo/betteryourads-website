import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'Is it really done for me?',
    a: 'Completely. Right now, for our early clients, we run it like your own personal Meta ads agency: fully done-for-you, end to end, covering angles, creative, launch, and weekly iteration. We’re doing this hands-on because we want the data, which means you get far more attention than a normal customer would. Our software does the heavy lifting; you stay a founder.',
  },
  {
    q: 'What do I actually learn from this?',
    a: 'Your winning angle is customer research. When one message out-converts the rest, that’s your market telling you what it cares about most. You can point your positioning, your site, and your roadmap at it, not just your ads.',
  },
  {
    q: 'What is the optimization loop?',
    a: 'The next layer of the product. We pair each creative with its own performance data, work out why it won or lost (the hook, the image, the claim), and save that to your account’s memory so every new batch starts smarter. We’re building it with our pilot founders now; the waitlist gets it next.',
  },
  {
    q: 'What does it cost?',
    a: "One flat monthly price. No % of your ad spend, no per-asset fees. Your first month is free with 30 ads on us, and we'll walk through pricing on the pilot call.",
  },
  {
    q: 'Why SaaS only?',
    a: 'SaaS sells on long, considered cycles, not impulse add-to-carts. Every angle and metric we optimize is built for paying customers and CAC payback, not ecommerce ROAS.',
  },
  {
    q: 'What do you need from me?',
    a: 'Your URL and ad-account access. No briefing docs, no creative direction. We extract positioning, ICP, and palette automatically.',
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
        <SectionHead
          eyebrow="questions, mostly heard twice"
          eyebrowTag="var(--s1)"
          title="Frequently asked."
        />
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
