import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Compare.module.css';

// Capability comparison — BetterYourAds is the first (and only all-✓) column;
// the alternatives sit to its right. have = [betteryourads, agency, ecom-ai].
const ROWS: { cap: string; have: [boolean, boolean, boolean] }[] = [
  { cap: 'Built for SaaS funnels, not ecommerce', have: [true, false, false] },
  { cap: 'A full batch of on-brand angles at once', have: [true, false, false] },
  { cap: 'Optimizes for trial signups, not ROAS', have: [true, false, false] },
  { cap: 'First ads live in about 90 seconds', have: [true, false, false] },
  { cap: 'Flat monthly — no retainer, no creative hours', have: [true, false, false] },
];

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
          sub='Most "AI ads" tools were trained on Shopify stores. Most agencies grew up on ecom retainers. SaaS sells differently — long cycles, multi-stakeholder, trial-to-paid. Your ads need to know that.'
        />
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.header}`}>
            <div className={styles.cap} />
            <div className={`${styles.col} ${styles.us}`}>betteryourads</div>
            <div className={styles.col}>meta-ads agency</div>
            <div className={styles.col}>ecom-trained ai</div>
          </div>
          {ROWS.map(({ cap, have }) => (
            <div className={`${styles.row} reveal`} key={cap}>
              <div className={styles.cap}>{cap}</div>
              <div className={`${styles.col} ${styles.us}`}>
                {have[0] ? <Check /> : <Cross />}
              </div>
              <div className={styles.col}>{have[1] ? <Check /> : <Cross />}</div>
              <div className={styles.col}>{have[2] ? <Check /> : <Cross />}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="yes"
      className={styles.check}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="no"
      className={styles.cross}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
