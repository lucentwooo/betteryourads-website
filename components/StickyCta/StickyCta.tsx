'use client';
import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import styles from './StickyCta.module.css';

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'lucent-wu/15min';

export function StickyCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('section'); // first section = hero
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  if (dismissed) return null;
  return (
    <div className={`${styles.bar} ${show ? styles.show : ''}`} aria-hidden={!show} inert={!show || undefined}>
      <span className={styles.copy}>Meta ads, run for you. <strong>First month free</strong>.</span>
      <a
        className={styles.cta}
        role="button"
        tabIndex={0}
        data-cal-namespace="15min"
        data-cal-link={CAL_LINK}
        data-cal-config='{"layout":"month_view"}'
        onClick={() => track('book_call_click')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        book a pilot call →
      </a>
      <button className={styles.close} onClick={() => setDismissed(true)} aria-label="dismiss">×</button>
    </div>
  );
}
