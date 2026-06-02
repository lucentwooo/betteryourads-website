import styles from './TrustStrip.module.css';

/* =================================================================
   TrustStrip — one quiet, centred row of REAL signals.

   Hairline top border, tertiary type. It's trust, not a billboard.
   NOTE: the backing belongs to the PILOT STARTUPS, not to us — the
   teams we run ads for are Startmate / Melbourne-accelerator backed.
   ================================================================= */

export function TrustStrip() {
  return (
    <div className={styles.strip}>
      <span className={styles.item}>
        <span className={styles.live} aria-hidden="true" />
        Running ads right now for 2 funded B2B SaaS startups
      </span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <span className={styles.item}>
        Both backed by Startmate &amp; a Melbourne accelerator
      </span>
    </div>
  );
}
