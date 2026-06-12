'use client';

import { useEffect, useRef, useState } from 'react';
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
  { cap: 'Optimized for paying customers, not cheap signups' },
  { cap: 'Finds the winning angle that tells you what your market wants' },
  { cap: 'Unlimited on-brand ad variations per brief' },
  { cap: 'First ads live in hours, not weeks of onboarding' },
  { cap: 'One flat price, no % of ad spend or per-asset fees' },
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
  const [revealed, setRevealed] = useState(false);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Drive the resolve from an explicit IntersectionObserver instead of motion's
  // whileInView. Crucially, a safety timeout also flips `revealed` to true so the
  // matrix can NEVER be stranded mid-animation with cells stuck at opacity 0 —
  // even if the observer never fires (Safari + smooth-scroll edge cases).
  useEffect(() => {
    if (!mounted || reduce) return;
    const el = tableRef.current;
    if (!el) return;

    const reveal = () => setRevealed(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    const fallback = window.setTimeout(reveal, 1600); // never leave cells blank
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [mounted, reduce]);

  const animate = mounted && !reduce;

  // When animating, drive every cell from a single parent that flips to "shown"
  // once revealed. When not animating, no motion props are attached and the
  // markup renders at its final static state (full marks, BYA column lit).
  const viewProps = animate
    ? ({
        initial: 'hidden',
        animate: revealed ? 'shown' : 'hidden',
      } as const)
    : {};

  return (
    <section className="section" id="why">
      <div className="wrap">
        <SectionHead
          eyebrow="what actually matters"
          eyebrowTag="var(--s1)"
          title={
            <>
              Cheap signups are easy.
              <br />
              Ones that pay are the job.
            </>
          }
          sub="A low cost-per-signup looks great in a dashboard and can still do nothing for revenue. Most trials never even activate. For SaaS, success is paying customers at a CAC that pays back, and learning which message won them. Here’s where we’re built differently."
        />

        <motion.div ref={tableRef} className={styles.table} {...viewProps}>
          <div className={`${styles.row} ${styles.header}`}>
            <div className={styles.cap} />
            <div className={styles.col}>
              <span>typical agency</span>
              <span className={styles.colSub}>retainer + % of spend</span>
            </div>
            <div className={styles.col}>
              <span>freelancer / DIY</span>
              <span className={styles.colSub}>one-off · manual</span>
            </div>
            <div className={`${styles.col} ${styles.us}`}>
              <span className={styles.usBadge}>does all five</span>
              <span>betteryourads</span>
              <span className={styles.colSub}>built for trial → paid</span>
            </div>
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
