'use client';
import { useState } from 'react';
import styles from './AnglePicker.module.css';

// One ad angle per stage of awareness (Eugene Schwartz). The picker shows a
// representative spread of the five; the founder tests them all and lets real
// signups pick the winner.
const ANGLES = [
  { title: 'standups are killing your velocity.', tag: 'problem-aware' },
  { title: 'the tracker built for shipping speed.', tag: 'solution-aware' },
  { title: 'start free — ship faster this week.', tag: 'most-aware' },
];

export function AnglePicker() {
  const [sel, setSel] = useState(0);
  return (
    <div className={styles.launch}>
      <div className={styles.launchHead}>5 angles · one per awareness stage</div>
      {ANGLES.map((a, i) => (
        <button
          type="button"
          key={a.tag}
          onClick={() => setSel(i)}
          className={`${styles.angle} ${i === sel ? styles.angleSelected : ''}`}
          aria-pressed={i === sel}
        >
          <span className={styles.radio}>
            {i === sel ? <span className={styles.radioDot} /> : null}
          </span>
          <span className={styles.angleText}>
            <span className={styles.angleTitle}>{a.title}</span>
            <span className={styles.angleTag}>{a.tag}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
