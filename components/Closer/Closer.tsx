import { CAL_URL } from '@/lib/site';
import styles from './Closer.module.css';

export function Closer() {
  return (
    <section className={styles.closer}>
      <div>
        <p className={`eyebrow ${styles.eyebrowViolet}`}>beta - the loop</p>
        <h2 className={styles.h2}>And it learns from your results.</h2>
        <p className={styles.body}>
          Connect your Meta and Google Analytics accounts, read-only, and Loopy studies what actually ran well for you.
          Every lesson feeds the next batch. It&apos;s early, it&apos;s live, and it&apos;s the reason we called it
          Loopy.
        </p>
      </div>
      <div className={styles.note}>
        <p className={`eyebrow ${styles.eyebrowMuted}`}>what we kept hearing</p>
        <p className={styles.noteBody}>
          We&apos;ve talked to hundreds of founders and agencies, and they all say the same thing: AI-generated ads
          just aren&apos;t there yet. Off-brand colors, made-up product shots, that same template look everyone can
          spot. That&apos;s the problem we fixed - Loopy copies your real site and never invents pixels. You&apos;ll
          talk to us, not a funnel.
        </p>
        <p className={styles.signoff}>the Loopy founders</p>
        <a className={`signal ${styles.noteLink}`} href={CAL_URL}>
          want us to run it for you? talk to the founders ↗
        </a>
      </div>
    </section>
  );
}
