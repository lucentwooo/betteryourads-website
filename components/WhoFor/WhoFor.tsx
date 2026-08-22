import { CAL_URL } from '@/lib/site';
import styles from './WhoFor.module.css';

export function WhoFor() {
  return (
    <section className={styles.section}>
      <p className="eyebrow">who it&rsquo;s for</p>
      <h2 className={styles.h2}>The work before the creative work.</h2>
      <p className={styles.lede}>Every client, every round: days of homework before anyone designs anything.</p>

      <div className={styles.split}>
        <div className={styles.half}>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>the research</span>
          <h3 className={styles.h3}>Per-client research is quietly eating your week.</h3>
          <p className={styles.body}>
            Read the site. Dig through reviews and community threads. Pull competitor ads from the archive. Work out
            what to say. Hours per client, repeated forever - the least leveraged work in the building.
          </p>
          <p className={styles.payoff}>
            Drop in the client&rsquo;s URL and Loopy does the reading - ranked ad concepts by angle and awareness
            stage, in minutes.
          </p>
          <a className={`signal ${styles.link}`} href={CAL_URL}>
            see it on a client&rsquo;s brand ↗
          </a>
        </div>
        <div className={styles.rule} aria-hidden="true" />
        <div className={styles.half}>
          <span className={`${styles.badge} ${styles.badgeCoral}`}>the brief</span>
          <h3 className={styles.h3}>Design waits on a brief nobody has time to write.</h3>
          <p className={styles.body}>
            Nothing starts until someone chases assets, references and specs, then turns it all into something a
            designer or a client can actually run with.
          </p>
          <p className={styles.payoff}>
            Tick the concepts worth running and export a client-ready brief your team can start from immediately -
            renders included if you want them.
          </p>
          <a className={`signal ${styles.link}`} href={CAL_URL}>
            get a brief you can send ↗
          </a>
        </div>
      </div>
    </section>
  );
}
