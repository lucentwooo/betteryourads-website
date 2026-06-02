import styles from './TrustStrip.module.css';

/* =================================================================
   TrustStrip — one quiet, centred row of REAL signals.

   Hairline top border, tertiary type. It's trust, not a billboard:
   a live dot + who we're running for, then who backs us. No metrics
   we can't stand behind.
   ================================================================= */

export function TrustStrip() {
  return (
    <div className={styles.strip}>
      <span className={styles.item}>
        <span className={styles.live} aria-hidden="true" />
        Running ads right now for 2 funded B2B SaaS teams
      </span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <span className={styles.item}>
        Startmate &amp; University of Melbourne–backed
      </span>
    </div>
  );
}
