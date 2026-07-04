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
            <span>done-for-you meta ads · for businesses that run them</span>
          </div>

          <h1 className={styles.title}>
            Meta ads, <span className="accent sheen">run for you</span>.
          </h1>

          <p className={`lead ${styles.subhead}`}>
            <strong className={styles.subStrong}>More paying customers</strong>{' '}
            for your business, fully done for you. We learn your product, create
            the ads, and run them on Facebook and Instagram.
          </p>

          <div className={styles.ctaRow}>
            <BookCallButton lg />
          </div>

          <p className={styles.micro}>
            a 15-minute call ·{' '}
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
