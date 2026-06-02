'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { WORKED_EXAMPLE } from '@/lib/creatives';
import styles from './BatchCascade.module.css';

/* =================================================================
   BatchCascade — the signature hero moment.

   One reference creative fans out into a full batch of on-brand
   variations: the USP (batch creation) shown in ~2 seconds.

   Layout: a larger "reference" card on the left, then the four
   WORKED_EXAMPLE (Notion) ads revealing in a staggered cascade to
   the right — reference → batch, on-brand.

   SSR + reduced-motion (Manifesto discipline): FIRST PAINT renders
   the final composed grid statically and deterministically. Motion
   is applied ONLY after mount (requestAnimationFrame → setMounted)
   and NEVER under useReducedMotion(). Reduced-motion users — and the
   server render — get the finished batch, fully legible.

   The reference is the LCP image → priority. Borders over shadows;
   cream / ink / one blue only.
   ================================================================= */

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];
const STAGGER = 0.08; // ~80ms between variation cards

// `--reveal-rise` / `--reveal-blur` as raw values for the motion tween
// (matches globals.css reveal: 16px rise, 6px blur).
const RISE = 16;
const BLUR = 6;

export function BatchCascade() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = mounted && !reduce;

  const [reference] = WORKED_EXAMPLE.ads;
  const variations = WORKED_EXAMPLE.ads; // the full on-brand batch

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

        {/* ----- the on-brand batch ----- */}
        <div className={styles.batchCol}>
          <div className={styles.grid}>
            {variations.map((ad, i) => (
              <motion.div
                key={ad.src}
                className={styles.cell}
                // SSR + reduced-motion: final state (visible) is the default;
                // we only animate FROM hidden after mount on the motion path.
                initial={
                  animate ? { opacity: 0, y: RISE, filter: `blur(${BLUR}px)` } : false
                }
                animate={
                  animate
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : undefined
                }
                transition={
                  animate
                    ? { duration: 0.64, ease: EASE, delay: i * STAGGER }
                    : undefined
                }
              >
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
        one reference → a full batch, on-brand
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
