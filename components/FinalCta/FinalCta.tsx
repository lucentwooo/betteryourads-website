import { Eyebrow } from '@/components/ui/Eyebrow';
import { BookCallButton } from '@/components/ui/BookCallButton';
import { ManifestoLine } from '@/components/Manifesto/ManifestoLine';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={`section ${styles.finalCta}`} id="book">
      <div className="wrap-narrow">
        <div className={`${styles.panel} reveal`}>
          {/* 1 — Eyebrow */}
          <Eyebrow accent tag="var(--s4)" className={styles.kicker}>
            book a pilot call
          </Eyebrow>

          {/* 2 — H2 */}
          <h2 className={styles.headline}>
            Stop guessing.
            <br />
            Start <span className="accent sheen">shipping</span>.
          </h2>

          {/* 3 — Manifesto word-reveal sign-off */}
          <div className={styles.manifesto}>
            <ManifestoLine />
          </div>

          {/* 4 — Primary CTA */}
          <div className={styles.ctas}>
            <BookCallButton />
          </div>

          {/* 5 — Micro line */}
          <div className={styles.micro}>
            <span>no card required</span>
            <span className={styles.sep}>·</span>
            <span>seats released in waves</span>
            <span className={styles.sep}>·</span>
            <span>saas only</span>
          </div>
        </div>
      </div>
    </section>
  );
}
