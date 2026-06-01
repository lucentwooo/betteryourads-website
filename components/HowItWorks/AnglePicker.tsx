'use client';
import { useState } from 'react';
import styles from './AnglePicker.module.css';

const ANGLES = [
  { title: 'ship without the standup.', tag: 'process' },
  { title: 'speed is the feature.', tag: 'manifesto' },
  { title: 'the issue tracker for shipping.', tag: 'category' },
];

export function AnglePicker() {
  const [sel, setSel] = useState(0);
  return (
    <div className={styles.launch}>
      <div className={styles.launchHead}>5 angles · pick or ship all</div>
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
