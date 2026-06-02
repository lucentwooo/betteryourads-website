'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { HERO_BRAND } from '@/lib/creatives';
import styles from './BatchCascade.module.css';

/* =================================================================
   BatchCascade — the signature hero moment.

   One reference creative (Zoom Workplace) fans out into a 2×2 batch of
   four hand-picked on-brand variations — the USP in ~2 seconds.

   The reference is shown on its own (left); the batch on the right is
   the variations — the reference never repeats inside the batch.

   SSR + reduced-motion (Manifesto discipline): FIRST PAINT renders the
   final composed grid statically and deterministically. The reveal
   motion applies ONLY after mount and NEVER under useReducedMotion();
   the generating shimmer is CSS and is disabled under reduced motion.

   The reference is the LCP image → priority. Borders over shadows;
   cream / ink / one blue only.
   ================================================================= */

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];
const STAGGER = 0.08; // ~80ms between cards
const RISE = 16; // matches --reveal-rise
const BLUR = 6; // matches --reveal-blur

export function BatchCascade() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = mounted && !reduce;

  const [reference, ...variations] = HERO_BRAND.ads; // batch excludes the reference

  function reveal(i: number) {
    return {
      initial: animate ? { opacity: 0, y: RISE, filter: `blur(${BLUR}px)` } : false,
      animate: animate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
      transition: animate ? { duration: 0.64, ease: EASE, delay: i * STAGGER } : undefined,
    };
  }

  return (
    <figure className={styles.root}>
      <div className={styles.board}>
        {/* ----- the reference creative ----- */}
        <div className={styles.referenceCol}>
          <span className={styles.tag}>reference</span>
          <div className={styles.referenceFrame}>
            <Image
              src={reference.src}
              alt={reference.alt}
              fill
              priority
              sizes="(max-width: 720px) 60vw, 300px"
              className={styles.img}
            />
          </div>
        </div>

        {/* ----- the fan-out arrow ----- */}
        <div className={styles.bridge} aria-hidden="true">
          <span className={styles.bridgeLabel}>batch</span>
          <FanIcon />
        </div>

        {/* ----- the on-brand batch (real variations + generating cells) ----- */}
        <div className={styles.batchCol}>
          <div className={styles.grid}>
            {variations.map((ad, i) => (
              <motion.div key={ad.src} className={styles.cell} {...reveal(i)}>
                <div className={styles.cellFrame}>
                  <Image
                    src={ad.src}
                    alt={ad.alt}
                    fill
                    sizes="(max-width: 720px) 40vw, 150px"
                    className={styles.img}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.live} aria-hidden="true" />
        one reference → unlimited on-brand variations
      </figcaption>
    </figure>
  );
}

function FanIcon() {
  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12 H30" />
      <path d="M22 5 L30 12 L22 19" />
    </svg>
  );
}
