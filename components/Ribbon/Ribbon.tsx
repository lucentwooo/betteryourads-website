import { Fragment } from 'react';
import styles from './Ribbon.module.css';

const STEPS = [
  {
    n: '1',
    h: 'Paste your URL',
    p: 'Loopy reads your live site and builds your brand profile in about two minutes.',
  },
  {
    n: '2',
    h: 'Pick a proven layout',
    p: 'Choose from the ranked library or upload a reference. Exact to the layout, or loose to the vibe.',
  },
  {
    n: '3',
    h: 'Download and run',
    p: 'Finished statics in feed and story sizes, saved to your library. Promote a winner to remix it.',
  },
];

export function Ribbon() {
  return (
    <section className={styles.band}>
      <div className={styles.ribbon}>
        {STEPS.map((step, i) => (
          <Fragment key={step.n}>
            {i > 0 && (
              <span aria-hidden="true" className={styles.arrow}>
                →
              </span>
            )}
            <div className={styles.step}>
              <span className={styles.num}>{step.n}</span>
              <h3 className={styles.h3}>{step.h}</h3>
              <p className={styles.p}>{step.p}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
