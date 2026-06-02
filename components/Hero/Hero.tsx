import { BatchCascade } from '@/components/Hero/BatchCascade';
import { TrustStrip } from '@/components/Hero/TrustStrip';
import { BookCallButton } from '@/components/ui/BookCallButton';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
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
            <span>done-for-you meta ads · for b2b saas</span>
          </div>

          <h1 className={styles.title}>
            Meta ads, <span className="accent sheen">run for you</span>.
          </h1>

          <p className={`lead ${styles.subhead}`}>
            More trial signups for B2B SaaS — without touching your ad account,
            hiring an agency, or opening Canva. We learn your product, batch the
            creative, and run it on Facebook &amp; Instagram.
          </p>

          <div className={styles.ctaRow}>
            <BookCallButton />
            <a href="#waitlist" className={styles.secondary}>
              or join the waitlist
            </a>
          </div>

          <WaitlistForm center id="waitlist" />

          <p className={styles.micro}>
            first month free · 30 ads on us · no card required
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
