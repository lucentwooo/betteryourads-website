import { CAL_URL } from '@/lib/site';
import styles from './Closer.module.css';

export function Closer() {
  return (
    <section className={styles.closer}>
      <div>
        <p className={`eyebrow ${styles.eyebrowViolet}`}>beta - the loop</p>
        <h2 className={styles.h2}>And it learns from your clients&rsquo; results.</h2>
        <p className={styles.body}>
          Connect each client&rsquo;s Meta and Google Analytics accounts, read-only, and Loopy studies what actually
          ran well on that account. Every lesson feeds the next brief. It&apos;s early, it&apos;s live, and it&apos;s
          the reason we called it Loopy.
        </p>
      </div>
      <div className={styles.note}>
        <p className={`eyebrow ${styles.eyebrowMuted}`}>what we kept hearing</p>
        <p className={styles.noteBody}>
          We&apos;ve talked to hundreds of agency operators, and they all say the same thing: AI-generated ads just
          aren&apos;t there yet. Off-brand colors, made-up product shots, that same template look everyone can spot.
          That&apos;s the problem we fixed - Loopy copies your client&apos;s real site and never invents pixels.
        </p>
        <p className={styles.noteBody}>
          Our design partner runs ads for brands from 7 to 9 figures, with some accounts spending $50k-$100k a month
          on Meta. It was built against their bar - tell us which part of your workflow eats the most hours, and
          that&apos;s what we automate next.
        </p>
        <p className={styles.signoff}>the Loopy founders</p>
        <a className={`signal ${styles.noteLink}`} href={CAL_URL}>
          want in? talk to the founders ↗
        </a>
      </div>
    </section>
  );
}
