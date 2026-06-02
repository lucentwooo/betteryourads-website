'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { REFERENCE_AD, VARIATION_ADS, VARIATION_COUNT } from '@/lib/demoAds';
import styles from './Showcase.module.css';

/**
 * Showcase — the mid-page "see the real output" payoff.
 *
 * Reproduces the Aceternity "Container Scroll Animation" on-brand: a 3D-tilted
 * app window that rotates flat (rotateX 22deg → 0) and scales (1.04 → 1) as the
 * user scrolls, revealing the eight real ad variations in a large 4×2 grid.
 *
 * SSR-safety: the first paint is DETERMINISTIC and flat — no transforms, no
 * useReducedMotion-dependent markup. Scroll-driven transforms are only applied
 * after mount (the `mounted` gate), and never under prefers-reduced-motion.
 * This mirrors the hero BatchDemo pattern and avoids the hydration bug that
 * previously bit this project.
 */
export function Showcase() {
  const reduce = useReducedMotion();

  // Gate scroll-driven transforms behind a post-mount flag. The server and the
  // first client render both produce the flat, static screen (mounted=false),
  // so there is no hydration mismatch. We flip it on after paint.
  const [mounted, setMounted] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 when the section's top hits the viewport bottom,
  // 1 when the section's bottom hits the viewport top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smooth the raw scroll into ONE eased progress value that drives BOTH the
  // 3D flatten and the tile cascade — so the whole section moves as a single
  // fluid, momentum-eased system instead of tracking the wheel 1:1. Lenis
  // already smooths the scroll; this rounds the section's own motion on top,
  // which is what makes the reveal feel seamless rather than mechanical.
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    restDelta: 0.001,
  });

  // The flatten completes gradually (by ~0.5 of the section's travel) so the
  // user watches the screen settle while it's comfortably pinned in view, then
  // reads the ads. rotateX: 22deg (tilted back) → 0 (flat). scale: 1.04 → 1.
  const rotateX = useTransform(progress, [0.05, 0.5], [22, 0]);
  const scale = useTransform(progress, [0.05, 0.5], [1.04, 1]);
  // Title lifts and fades in slightly as the screen approaches flat.
  const titleY = useTransform(progress, [0.05, 0.5], [40, 0]);
  const titleOpacity = useTransform(progress, [0.05, 0.34], [0.4, 1]);

  useEffect(() => {
    // Post-mount only (client). Deferred out of the effect body for
    // react-hooks/set-state-in-effect. No SSR involvement → no mismatch.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Animate only when mounted AND motion is allowed. Otherwise render flat.
  const animate = mounted && !reduce;

  return (
    <section ref={ref} className={`section ${styles.section}`} id="showcase">
      <div className={styles.sticky}>
        <div className="wrap">
          {/* ----- Section head (lifts/fades with scroll when animating) ----- */}
          <motion.div
            className={styles.head}
            style={animate ? { y: titleY, opacity: titleOpacity } : undefined}
          >
            <Eyebrow>real output, not mockups</Eyebrow>
            <h2 className={styles.title}>
              One brand. Eight angles.
              <br />
              One batch.
            </h2>
            <p className={styles.sub}>
              These are real, on-brand ad variations — the kind we batch-generate
              and ship to Meta. Pick the winners; we optimise spend toward signups.
            </p>
          </motion.div>

          {/* ----- The perspective stage holding the tilting screen ----- */}
          <div className={styles.perspective}>
            <motion.div
              className={styles.screen}
              style={
                animate
                  ? { rotateX, scale }
                  : // Deterministic first paint + reduced-motion state: flat.
                    { rotateX: 0, scale: 1 }
              }
            >
              {/* chrome bar — purely decorative */}
              <div className={styles.chrome} aria-hidden="true">
                <div className={styles.dots}>
                  <span style={{ background: '#ff5f57' }} />
                  <span style={{ background: '#febc2e' }} />
                  <span style={{ background: '#28c840' }} />
                </div>
                <div className={styles.appUrl}>app.betteryourads.com / batch</div>
                <div className={styles.count}>
                  <span className={styles.countDot} />
                  {VARIATION_COUNT} variations
                </div>
              </div>

              {/* results header — reference → batch */}
              <div className={styles.resultsBar}>
                <div className={styles.refLockup}>
                  <span className={styles.refLabel}>reference</span>
                  <span className={styles.refThumb}>
                    <Image
                      src={REFERENCE_AD.src}
                      alt={REFERENCE_AD.alt}
                      fill
                      sizes="56px"
                      className={styles.refImg}
                    />
                  </span>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowIcon />
                </span>
                <span className={styles.batchLabel}>
                  {VARIATION_COUNT} on-brand variations
                </span>
              </div>

              {/* THE GRID — 4×2 large, the real output payoff. Each tile
                  zoom-parallaxes in on scroll (staggered cascade) so the
                  batch visibly populates as you read down the section. */}
              <div className={styles.grid}>
                {VARIATION_ADS.map((ad, i) => (
                  <ZoomTile
                    key={ad.src}
                    ad={ad}
                    index={i}
                    progress={progress}
                    animate={animate}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- Zoom-parallax tile -------------------------------------------
   Each real ad scales + rises + fades in as the section scrolls, on a
   staggered range so the eight tiles cascade into view — a Lenis-smooth
   "the batch populates as you scroll" reveal. `useTransform` is always
   called (hooks rule); the parent only APPLIES the style when animating,
   so the first paint AND reduced-motion both render the full static grid
   (no hydration branch). All ranges finish by ~0.6 of the section travel,
   safely inside the pinned-visible window. */
function ZoomTile({
  ad,
  index,
  progress,
  animate,
}: {
  ad: (typeof VARIATION_ADS)[number];
  index: number;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const start = 0.1 + index * 0.045;
  const end = start + 0.26;
  const scale = useTransform(progress, [start, end], [0.74, 1]);
  const opacity = useTransform(progress, [start, end - 0.08], [0, 1]);
  const y = useTransform(progress, [start, end], [26, 0]);

  return (
    <motion.figure
      className={styles.cell}
      style={animate ? { scale, opacity, y } : undefined}
    >
      <Image
        src={ad.src}
        alt={ad.alt}
        fill
        sizes="(max-width: 560px) 50vw, (max-width: 960px) 25vw, 240px"
        className={styles.adImg}
      />
      <figcaption className={styles.angle}>{ad.angle}</figcaption>
    </motion.figure>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}
