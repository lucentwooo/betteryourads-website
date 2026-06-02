'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './MetricMorph.module.css';

/* MetricMorph — the Compare section's hook.

   A small dashboard that morphs between the metrics ecom-trained tools chase
   (ROAS, add-to-cart, CPM) and the metrics that actually matter for SaaS
   (trial signups, CAC payback, MRR). It auto-flips ecom → SaaS once when
   scrolled into view — greys to accent — making the "built for SaaS, not
   ecommerce" point without a word; a toggle lets you compare either way.

   SSR-safe: deterministic 'ecom' initial render (no useReducedMotion branch).
   Post-mount, reduced-motion jumps straight to the SaaS set with no animation;
   otherwise an IntersectionObserver triggers the morph. */

type Mode = 'ecom' | 'saas';

const METRICS: Record<Mode, { label: string; value: string; note: string }[]> = {
  ecom: [
    { label: 'ROAS', value: '3.2×', note: 'return on ad spend' },
    { label: 'add-to-cart', value: '4.8%', note: 'cart rate' },
    { label: 'CPM', value: '$14', note: 'cost per 1k views' },
  ],
  saas: [
    { label: 'trial signups', value: '131', note: 'this week' },
    { label: 'CAC payback', value: '4.2 mo', note: 'months to recoup' },
    { label: 'MRR added', value: '$2,841', note: 'new recurring' },
  ],
};

const TABS: { id: Mode; label: string }[] = [
  { id: 'ecom', label: 'ecommerce' },
  { id: 'saas', label: 'SaaS' },
];

export function MetricMorph() {
  const [mode, setMode] = useState<Mode>('ecom');
  // Gate the entrance animation behind a post-mount flag so the FIRST render
  // is always static (initial={false}) and matches the SSR HTML byte-for-byte
  // — regardless of the user's reduced-motion setting. Only morphs animate.
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const settled = useRef(false); // auto-flip (or a user click) has happened

  useEffect(() => {
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // Defer state out of the effect body (react-hooks/set-state-in-effect).
    const r = requestAnimationFrame(() => {
      setReady(true);
      setReduced(isReduced);
    });

    if (isReduced) {
      // Show the metrics that matter, no morph.
      const id = requestAnimationFrame(() => setMode('saas'));
      return () => {
        cancelAnimationFrame(r);
        cancelAnimationFrame(id);
      };
    }

    const el = ref.current;
    if (!el) return () => cancelAnimationFrame(r);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !settled.current) {
          settled.current = true;
          io.disconnect();
          setMode('saas'); // morph ecom → ours, in view
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(r);
      io.disconnect();
    };
  }, []);

  const metrics = METRICS[mode];
  const saas = mode === 'saas';
  // Animate the per-tile morph only after mount, and only when motion is allowed.
  const animateMorph = ready && !reduced;

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.bar}>
        <span className={styles.barLabel}>
          {saas ? 'what we optimize for' : 'what ecom tools optimize for'}
        </span>
        <div className={styles.toggle} role="group" aria-label="Metric set">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${mode === t.id ? styles.tabOn : ''}`}
              aria-pressed={mode === t.id}
              onClick={() => {
                settled.current = true; // user takes over; cancel auto-flip
                setMode(t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.tiles} ${saas ? styles.tilesSaas : ''}`}>
        {metrics.map((m, i) => (
          <div className={styles.tile} key={i}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={mode}
                className={styles.tileInner}
                initial={animateMorph ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={
                  animateMorph
                    ? { duration: 0.5, ease: [0.2, 0, 0, 1], delay: i * 0.07 }
                    : { duration: 0 }
                }
              >
                <span className={styles.value}>{m.value}</span>
                <span className={styles.label}>{m.label}</span>
                <span className={styles.note}>{m.note}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
