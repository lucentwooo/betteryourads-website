import { CAL_URL } from '@/lib/site';
import styles from './WhoFor.module.css';

export function WhoFor() {
  return (
    <section className={styles.section}>
      <p className="eyebrow">who it&rsquo;s for</p>
      <h2 className={styles.h2}>Two kinds of people book the call.</h2>
      <p className={styles.lede}>Meta wants new creative and there are no new creatives.</p>

      <div className={styles.split}>
        <div className={styles.half}>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>you run a brand</span>
          <h3 className={styles.h3}>Your winning ad fatigued. No designer to call.</h3>
          <p className={styles.body}>
            Results dip every few weeks while you rebuild creatives by hand, late, in a tool that fights you.
          </p>
          <p className={styles.payoff}>
            Paste your URL and making creatives runs on a system - fresh on-brand statics, automatically.
          </p>
          <a className={`signal ${styles.link}`} href={CAL_URL}>
            see it on your brand ↗
          </a>
        </div>
        <div className={styles.rule} aria-hidden="true" />
        <div className={styles.half}>
          <span className={`${styles.badge} ${styles.badgeCoral}`}>you run an agency</span>
          <h3 className={styles.h3}>Every new ad waits on a brief nobody has written.</h3>
          <p className={styles.body}>
            Design can&rsquo;t start until someone chases brand assets, references and specs - and that someone is you.
          </p>
          <p className={styles.payoff}>
            Paste the client&rsquo;s URL and get an instant, ready-to-send brief your design team can run with.
          </p>
          <a className={`signal ${styles.link}`} href={CAL_URL}>
            see it on a client&rsquo;s brand ↗
          </a>
        </div>
      </div>
    </section>
  );
}
