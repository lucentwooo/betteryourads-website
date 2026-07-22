import type { ReactNode } from 'react';
import styles from './Faq.module.css';

export interface FaqItem {
  q: string;
  a: ReactNode;
}

/** Native-details accordion shared by the landing and pricing pages. */
export function Faq({
  title,
  items,
  variant = 'landing',
}: {
  title: string;
  items: FaqItem[];
  variant?: 'landing' | 'pricing';
}) {
  return (
    <section id="faq" className={`${styles.section} ${variant === 'pricing' ? styles.pricing : styles.landing}`}>
      <h2 className={styles.h2}>{title}</h2>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary className={styles.summary}>
            {item.q}
            <span className={styles.plus} aria-hidden="true">
              +
            </span>
          </summary>
          <p className={styles.answer}>{item.a}</p>
        </details>
      ))}
    </section>
  );
}
