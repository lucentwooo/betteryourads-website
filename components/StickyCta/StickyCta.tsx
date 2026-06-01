'use client';
import { useEffect, useState } from 'react';
import styles from './StickyCta.module.css';

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
    <div className={`${styles.bar} ${show ? styles.show : ''}`} aria-hidden={!show}>
      <span className={styles.copy}>Meta ads, run for you — <strong>first month free</strong>.</span>
      <a className={styles.cta} href="#waitlist">join the waitlist →</a>
      <button className={styles.close} onClick={() => setDismissed(true)} aria-label="dismiss">×</button>
    </div>
  );
}
