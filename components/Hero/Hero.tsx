import { BatchCascade } from '@/components/Hero/BatchCascade';
import { TrustStrip } from '@/components/Hero/TrustStrip';
import { BookCallButton } from '@/components/ui/BookCallButton';
import styles from './Hero.module.css';

/* =================================================================
   Hero — direction B: centered editorial.

   A single, centred column (~720px content) with generous air. The
   copy leads with the outcome; the BatchCascade island below is the
   signature visual (one reference → an on-brand batch). Server
   Component wrapper; the islands inside handle their own motion.
   ================================================================= */

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.col}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            <span>fresh meta ad creative, automated · for businesses that run them</span>
          </div>

          <h1 className={styles.title}>
            Never run out of{' '}
            <span className="accent sheen">Meta ad creative</span>.
          </h1>

          <p className={`lead ${styles.subhead}`}>
            <strong className={styles.subStrong}>
              Creative fatigue kills Meta ads.
            </strong>{' '}
            Loopy learns your brand and batches a fresh set of on-brand ads
            whenever you need them, launches them on Facebook and Instagram, and
            shows you what’s winning. More paying customers, no agency. You run
            it, you own the account.
          </p>

          <div className={styles.ctaRow}>
            <BookCallButton lg />
          </div>

          <p className={styles.micro}>
            20 minutes with the founders ·{' '}
            <b className={styles.microPop}>first month free, 30 ads on us</b> ·
            no card required
          </p>

          <TrustStrip />
        </div>

        <div className={styles.visual}>
          <BatchCascade />
        </div>
      </div>
    </section>
  );
}
