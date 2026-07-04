'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookCallButton } from '@/components/ui/BookCallButton';
import buttonStyles from '@/components/ui/MagneticButton.module.css';
import styles from './Nav.module.css';

const LINKS = [
  ['why loopy', '#why'],
  ['how it works', '#how'],
  ['the loop', '#loop'],
  ['faq', '#faq'],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    // Initial value without synchronous setState in effect body
    const raf = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 40);
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
        <a className={styles.brand} href="#" aria-label="Loopy — home">
          <Image
            className={styles.logo}
            src="/loopy-logo.png"
            alt="Loopy"
            width={65}
            height={26}
            priority
          />
        </a>
        <div className={styles.links}>
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <div className={styles.ctaGroup}>
          <BookCallButton sm>
            get early access <span className={buttonStyles.arrow}>↗</span>
          </BookCallButton>
        </div>
      </div>
    </nav>
  );
}
