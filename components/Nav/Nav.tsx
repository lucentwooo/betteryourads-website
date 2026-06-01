'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './Nav.module.css';

const SECTION_IDS = ['how', 'compare', 'pricing', 'faq'] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // Scroll-aware: set initial value via rAF to avoid synchronous setState in effect body
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

  // Active-link detection via IntersectionObserver
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio among currently intersecting entries
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) {
          setActiveId(best.target.id);
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-10% 0px -60% 0px' },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
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
        <div className={styles.links}>
          <a href="#how" className={activeId === 'how' ? styles.active : ''}>
            how it works
          </a>
          <a href="#compare" className={activeId === 'compare' ? styles.active : ''}>
            compare
          </a>
          <a href="#pricing" className={activeId === 'pricing' ? styles.active : ''}>
            pricing
          </a>
          <a href="#faq" className={activeId === 'faq' ? styles.active : ''}>
            faq
          </a>
        </div>
        <div className={styles.ctaGroup}>
          <MagneticButton href="#waitlist" primary sm>
            join the waitlist →
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}
