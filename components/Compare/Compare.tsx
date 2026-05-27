import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Compare.module.css';

const ROWS = [
  ['What it optimizes for', 'whatever you brief', 'add-to-cart, ROAS', 'trial signups, MRR, CAC payback'],
  ['Time to first ad live', 'weeks', 'a few days', 'about 90 seconds'],
  ['Reports you actually read', 'a monthly deck', 'clicks, CPM, impressions', 'signups, cost per signup, MRR added'],
  ["How it's priced", 'retainer + creative hours', 'subscription + your hours', 'flat monthly, month-to-month'],
] as const;

export function Compare() {
  return (
    <section className="section" id="compare">
      <div className="wrap">
        <SectionHead
          eyebrow="why we exist"
          title={
            <>
              Built for SaaS funnels.
              <br />
              Not for ecommerce.
            </>
          }
          sub='Most "AI ads" tools were trained on Shopify stores. Most agencies grew up on ecom retainers. SaaS sells differently. Long cycles, multi-stakeholder, trial-to-paid. Your ads need to know that.'
        />
        <div className={`${styles.compare} ${styles.four}`}>
          <div className={`${styles.row} ${styles.header}`}>
            <div />
            <div>meta-ads agency</div>
            <div>ecom-trained ai tools</div>
            <div className={styles.us}>betteryourads</div>
          </div>
          {ROWS.map(([label, them1, them2, us]) => (
            <div className={styles.row} key={label}>
              <div>{label}</div>
              <div className={styles.them}>{them1}</div>
              <div className={styles.them}>{them2}</div>
              <div className={styles.us}>{us}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
