import { Fragment } from 'react';
import styles from './Ribbon.module.css';

const STEPS = [
  {
    n: '1',
    h: 'Drop in the client’s site',
    p: 'Add their website plus anything they gave you - a deck, call notes, an old brief. Loopy builds the brand profile in about two minutes.',
  },
  {
    n: '2',
    h: 'Tick the concepts worth running',
    p: 'Ranked ad concepts by angle and awareness stage. Pick your winners and Loopy cuts a client-ready brief you can export.',
  },
  {
    n: '3',
    h: 'Hand it off or render it',
    p: 'Send the brief to your design team - or let Loopy render finished statics in feed and story sizes. Promote a winner to remix it.',
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
