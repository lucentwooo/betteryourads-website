import { Eyebrow } from '@/components/ui/Eyebrow';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className="wrap-narrow">
        <Eyebrow accent className={styles.kicker}>
          join the waitlist
        </Eyebrow>
        <h2 className="reveal">
          Stop guessing.
          <br />
          Start <span className="accent sheen">shipping</span>.
        </h2>
        <p className="sub" style={{ maxWidth: 580, margin: '0 auto 36px' }}>
          First month free. 30 ads on us. We email you when your seat is ready.
        </p>
        <WaitlistForm center />
        <div className={styles.micro}>
          <span>no card required</span>
          <span className={styles.sep}>·</span>
          <span>seats released in waves</span>
          <span className={styles.sep}>·</span>
          <span>b2b saas only</span>
        </div>
      </div>
    </section>
  );
}
