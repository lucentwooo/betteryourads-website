import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'Do I run the ads, or do you?',
    a: 'You run it. Loopy does the heavy lifting: it learns your brand, batches the ads, launches them, and shows you what’s working. You keep control of your account and your data. And while we’re in early access you also get us on a call whenever you want a hand, so you’re never stuck.',
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
    a: "One flat monthly price. No % of your ad spend, no per-asset fees. Your first month is free with 30 ads on us, and we'll walk through pricing when you get access.",
  },
  {
    q: 'Who do you work with?',
    a: 'Any business that runs Meta ads: B2B software, apps, ecommerce, DTC. The method is the same everywhere. We optimize for paying customers and revenue, not vanity clicks, and learn which angle wins so it compounds.',
  },
  {
    q: 'What do you need from me?',
    a: 'Your URL and ad-account access. No briefing docs, no creative direction. We extract positioning, ICP, and palette automatically.',
  },
  {
    q: 'When can I start?',
    a: "We're in early access and opening seats in waves. Grab a call and we'll get you set up and tell you the next opening.",
  },
  {
    q: 'How are you different from an agency or a freelancer?',
    a: 'One flat monthly price, no percentage of your ad spend and no per-asset fees. You get unlimited on-brand variations per brief, not a handful of one-offs, with the first ads live in hours instead of weeks of onboarding. Every batch is optimized for paying customers, not cheap clicks.',
  },
  {
    q: 'How fast can you get ads live?',
    a: 'Hours, not weeks. Drop your URL and we extract your positioning, angles, and palette automatically, then batch and launch, with no briefing docs or onboarding calls.',
  },
];

// FAQPage structured data, generated from the same source as the rendered
// list so the two never drift. Google deprecated FAQ rich results, but the
// markup still makes the Q&A pairs cleanly machine-parseable for AI engines.
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function Faq() {
  return (
    <section className="section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }}
      />
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
