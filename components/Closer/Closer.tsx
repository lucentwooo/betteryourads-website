import { CAL_URL } from '@/lib/site';
import styles from './Closer.module.css';

export function Closer() {
  return (
    <section className={styles.closer}>
      <div>
        <p className={`eyebrow ${styles.eyebrowViolet}`}>beta · the loop</p>
        <h2 className={styles.h2}>And it learns from your results.</h2>
        <p className={styles.body}>
          Connect your Meta and Google Analytics accounts, read-only, and Loopy studies what actually ran well for you.
          Every lesson feeds the next batch. It&apos;s early, it&apos;s live, and it&apos;s the reason we called it
          Loopy.
        </p>
      </div>
      <div className={styles.note}>
        <p className={`eyebrow ${styles.eyebrowMuted}`}>why we built this</p>
        <p className={styles.noteBody}>
          We ran Meta ads for our own software, and every AI tool gave us the same thing: our logo on someone
          else&apos;s design, with a dashboard our product doesn&apos;t have. So we built the one that copies the real
          site and never invents pixels. You&apos;ll talk to us, not a funnel.
        </p>
        <p className={styles.signoff}>the Loopy founders</p>
        <a className={`signal ${styles.noteLink}`} href={CAL_URL}>
          want us to run it for you? talk to the founders ↗
        </a>
      </div>
    </section>
  );
}
