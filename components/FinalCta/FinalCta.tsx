import { Eyebrow } from '@/components/ui/Eyebrow';
import { BookCallButton } from '@/components/ui/BookCallButton';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { ManifestoLine } from '@/components/Manifesto/ManifestoLine';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={`section ${styles.finalCta}`}>
      <div className="wrap-narrow">

        {/* 1 — Eyebrow */}
        <Eyebrow accent className={styles.kicker}>
          book a pilot call
        </Eyebrow>

        {/* 2 — H2 */}
        <h2 className={`reveal ${styles.headline}`}>
          Stop guessing.
          <br />
          Start <span className="accent sheen">shipping</span>.
        </h2>

        {/* 3 — Manifesto word-reveal sign-off */}
        <div className={styles.manifesto}>
          <ManifestoLine />
        </div>

        {/* 4 — Primary CTA + fallback */}
        <div className={styles.ctas}>
          <BookCallButton />
          <span className={styles.or}>or</span>
          <a href="#waitlist" className={styles.fallbackLink}>
            join the waitlist
          </a>
        </div>

        {/* Waitlist form (hidden until anchor navigates here) */}
        <div id="waitlist" className={styles.waitlist}>
          <WaitlistForm center />
        </div>

        {/* 5 — Micro line */}
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
