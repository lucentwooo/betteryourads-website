'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './WhySaas.module.css';

/* =================================================================
   WhySaas — Problem + Compare merged into one section with a
   signature "Resolve" motion.

   A 4-column capability matrix: capability · meta-ads agency ·
   freelancer/DIY · betteryourads. The BYA column is the highlighted
   `.us` column (electric blue). On scroll-in, the competitor ✗ cells
   sweep in top-to-bottom, then the BYA ✓ column fills and lights up
   electric-blue, landing LAST — the resolve.

   SSR-safe (Manifesto discipline): first paint and reduced-motion
   users see the FULL final state statically — every mark visible, the
   BYA column already blue. Motion props are only attached after mount
   and never under prefers-reduced-motion, so there is no animation
   branch in the server markup that could mismatch on hydration.
   ================================================================= */

const ROWS: { cap: string }[] = [
  { cap: 'Built for SaaS funnels, not ecommerce' },
  { cap: 'A full batch of on-brand angles at once' },
  { cap: 'Optimizes for trial signups, not ROAS' },
  { cap: 'First ads live in about 90 seconds' },
  { cap: 'Flat monthly — no retainer, no creative hours' },
];

// Stagger ~75ms/row for the crosses; the BYA column lands a beat after
// the last cross resolves.
const ROW_STAGGER = 0.075;
const CROSS_LEAD = 0.16; // delay before the first cross appears
const US_BEAT = 0.18; // pause after last cross before the BYA column lights

const crossVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: CROSS_LEAD + i * ROW_STAGGER,
      duration: 0.34,
      ease: [0.2, 0, 0, 1],
    },
  }),
};

const usColDelay = CROSS_LEAD + (ROWS.length - 1) * ROW_STAGGER + US_BEAT;

const usColVariants: Variants = {
  hidden: { opacity: 0 },
  shown: {
    opacity: 1,
    transition: { delay: usColDelay, duration: 0.45, ease: [0.2, 0, 0, 1] },
  },
};

const usMarkVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  shown: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: usColDelay + 0.08 + i * ROW_STAGGER,
      duration: 0.34,
      ease: [0.2, 0, 0, 1],
    },
  }),
};

export function WhySaas() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = mounted && !reduce;

  // When animating, drive every cell from a single parent whileInView so
  // the whole matrix shares one trigger. When not animating, no motion
  // props are attached and the markup renders at its final static state.
  const viewProps = animate
    ? ({
        initial: 'hidden' as const,
        whileInView: 'shown' as const,
        viewport: { once: true, amount: 0.4 },
      })
    : {};

  return (
    <section className="section" id="why">
      <div className="wrap">
        <SectionHead
          eyebrow="why nothing else works"
          title={
            <>
              Three ways to run paid social.
              <br />
              None built for SaaS.
            </>
          }
          sub="Agencies are ecom-trained and slow. Freelancers ship once. DIY is Canva at midnight. We’re the only one built for SaaS trial-to-paid funnels."
        />

        <motion.div className={styles.table} {...viewProps}>
          <div className={`${styles.row} ${styles.header}`}>
            <div className={styles.cap} />
            <div className={styles.col}>meta-ads agency</div>
            <div className={styles.col}>freelancer / DIY</div>
            <div className={`${styles.col} ${styles.us}`}>betteryourads</div>
          </div>

          {/* The BYA column highlight overlay — lights up electric-blue last. */}
          <motion.div
            className={styles.usGlow}
            aria-hidden
            variants={animate ? usColVariants : undefined}
          />

          {ROWS.map(({ cap }, i) => (
            <div className={styles.row} key={cap}>
              <div className={styles.cap}>{cap}</div>

              <div className={styles.col}>
                <motion.span
                  className={styles.markWrap}
                  variants={animate ? crossVariants : undefined}
                  custom={i}
                >
                  <Cross />
                </motion.span>
              </div>

              <div className={styles.col}>
                <motion.span
                  className={styles.markWrap}
                  variants={animate ? crossVariants : undefined}
                  custom={i}
                >
                  <Cross />
                </motion.span>
              </div>

              <div className={`${styles.col} ${styles.us}`}>
                <motion.span
                  className={styles.markWrap}
                  variants={animate ? usMarkVariants : undefined}
                  custom={i}
                >
                  <Check />
                </motion.span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="yes"
      className={styles.check}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="no"
      className={styles.cross}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
