import { SectionHead } from '@/components/ui/SectionHead';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './Problem.module.css';

const OPTIONS = [
  {
    tag: 'option a',
    title: 'Hire a Meta-ads agency',
    body: 'Weeks to onboard. Creative from someone who ran shopify ads last quarter. You pay for a monthly status call, not for ads.',
    verdict: 'slow · ecom-trained · status-call shaped',
  },
  {
    tag: 'option b',
    title: 'Hire a freelance designer',
    body: 'Great ads, once. No system, no second round. Next quarter you brief from zero and the angles that worked are stale.',
    verdict: 'one-off · no system · no learning',
  },
  {
    tag: 'option c',
    title: 'Do it yourself',
    body: "Canva on a Sunday night. Two ads ship, both perform the same, you can't tell which one drove the signups in Stripe.",
    verdict: 'no time · no expertise · no signal',
  },
] as const;

export function Problem() {
  return (
    <section className="section" id="problem">
      <div className="wrap">
        <SectionHead
          eyebrow="the status quo"
          title={
            <>
              Three ways to run paid social.
              <br />
              None built for SaaS.
            </>
          }
          sub="You're a founder, not a creative director. Every option for Meta ads burns money, burns time, or leaves you guessing."
        />
        <div className={styles.grid}>
          {OPTIONS.map((o) => (
            <div className={`${styles.cell} reveal`} key={o.tag}>
              <Eyebrow>{o.tag}</Eyebrow>
              <div className={styles.title}>{o.title}</div>
              <div className={styles.body}>{o.body}</div>
              <div className={styles.verdict}>{o.verdict}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
