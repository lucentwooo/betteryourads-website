'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookCallButton } from '@/components/ui/BookCallButton';
import styles from './Nav.module.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }

    // Initial value without synchronous setState in effect body
    const raf = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 80);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <nav className={`${styles.nav}${scrolled ? ` ${styles.scrolled}` : ''}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#">
          <Image className={styles.mark} src="/logo-mark.png" alt="" width={26} height={26} />
          <span className={styles.wordmark}>
            betteryour<span className={styles.ads}>ads</span>
          </span>
        </a>
        <div className={styles.ctaGroup}>
          <BookCallButton sm />
        </div>
      </div>
    </nav>
  );
}
