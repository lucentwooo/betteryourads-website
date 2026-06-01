'use client';

import { useEffect, useReducer } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { REFERENCE_AD, VARIATION_ADS, VARIATION_COUNT } from '@/lib/demoAds';
import {
  Phase,
  PHASE_MS,
  phaseLabel,
  showsGrid,
  revealDelayMs,
  footerLine,
} from './batchDemoMachine';
import styles from './BatchDemo.module.css';

/* =================================================================
   BatchDemo v2 — calm, cinematic loop built from REAL ad creatives.

   one reference ad → eight on-brand variations (batch creation).

   The stage is CONTINUOUS: the reference and all 8 variation cells are
   mounted the whole time. We never use AnimatePresence mode="wait" (its
   exit-then-enter gap caused the old "glitchy" jumps). Instead each
   element animates opacity / scale / position based on the current phase.
   On REVEAL the 8 cells fan out from the reference's centre into a 4×2
   grid, staggered — so it reads as "the one ad multiplied into eight".
   ================================================================= */

interface State {
  phase: Phase;
  /** Set once, post-mount, for prefers-reduced-motion users. */
  still: boolean;
}

type Action = { type: 'phase'; phase: Phase } | { type: 'still' };

// DETERMINISTIC initial state — identical on server and first client
// render, so there is no hydration mismatch. Reduced-motion is applied
// in a post-mount effect below (client-only), never in this initializer.
const INITIAL: State = { phase: Phase.Reference, still: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'phase':
      return { ...state, phase: action.phase };
    case 'still':
      return { ...state, still: true };
  }
}

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 } as const;

export function BatchDemo() {
  const reduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Imperative restart for the ↻ replay control. Bumping the nonce re-runs
  // the loop effect, which clears pending timers and starts over.
  const [nonce, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (reduce) {
      // Post-mount only (client) → no SSR involvement, no hydration mismatch.
      // Deferred out of the effect body for react-hooks/set-state-in-effect.
      const id = requestAnimationFrame(() => dispatch({ type: 'still' }));
      return () => cancelAnimationFrame(id);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    function runLoop() {
      dispatch({ type: 'phase', phase: Phase.Reference });

      let t = PHASE_MS[Phase.Reference];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Generate }));
      t += PHASE_MS[Phase.Generate];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Reveal }));
      t += PHASE_MS[Phase.Reveal];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Hold }));
      t += PHASE_MS[Phase.Hold];
      at(t, runLoop); // smooth crossfade back — nothing unmounts.
    }

    // Defer the first dispatch out of the synchronous effect body
    // (react-hooks/set-state-in-effect); everything after runs in timers.
    const kickoff = requestAnimationFrame(runLoop);
    return () => {
      cancelAnimationFrame(kickoff);
      timers.forEach(clearTimeout);
    };
  }, [reduce, nonce]);

  const { phase, still } = state;
  const gridVisible = still || showsGrid(phase);
  const generating = phase === Phase.Generate;
  // The reference fades out as the grid takes over (reveal onward / still).
  const referenceVisible = !gridVisible;

  function replay() {
    if (reduce) return;
    bump();
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.window}
        role="img"
        aria-label="A short demo: one reference ad becomes eight on-brand variations, batch-generated."
      >
        {/* ----- chrome bar ----- */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true">
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#febc2e' }} />
            <span style={{ background: '#28c840' }} />
          </div>
          <div className={styles.appUrl} aria-hidden="true">
            app.betteryourads.com
          </div>
          <div className={styles.auto} aria-hidden="true">
            <span className={styles.autoTick} />
            auto
          </div>
        </div>

        {/* ----- phase label ----- */}
        <div className={styles.phaseRow} aria-hidden="true">
          <span className={styles.phaseLabel}>
            {still ? phaseLabel(Phase.Hold) : phaseLabel(phase)}
          </span>
          {gridVisible ? (
            <span className={styles.counter}>{VARIATION_COUNT} variations</span>
          ) : (
            <span className={styles.counterGhost}>1 reference</span>
          )}
        </div>

        {/* ----- body — the continuous animated stage ----- */}
        <div className={styles.stage} aria-hidden="true">
          {/* The reference ad — large, centred. Fades/scales away as the
              grid takes over; the cells visually emerge from right here. */}
          <motion.div
            className={styles.referenceLayer}
            initial={false}
            animate={{
              opacity: referenceVisible ? 1 : 0,
              scale: referenceVisible ? 1 : 0.9,
            }}
            transition={
              still ? { duration: 0 } : { duration: 0.6, ease: [0.2, 0, 0, 1] }
            }
            style={{ pointerEvents: 'none' }}
          >
            <div className={styles.referenceFrame}>
              <Image
                src={REFERENCE_AD.src}
                alt={REFERENCE_AD.alt}
                fill
                sizes="(max-width: 960px) 60vw, 260px"
                className={styles.img}
                preload
              />
              {/* scanning / processing cue for the GENERATE beat */}
              <motion.div
                className={styles.scan}
                initial={false}
                animate={{ opacity: generating ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              >
                <motion.span
                  className={styles.scanLine}
                  animate={
                    generating
                      ? { y: ['-6%', '106%'] }
                      : { y: '-6%' }
                  }
                  transition={
                    generating
                      ? { duration: 1.1, ease: 'easeInOut', repeat: Infinity }
                      : { duration: 0 }
                  }
                />
              </motion.div>
            </div>
            <motion.span
              className={styles.genChip}
              initial={false}
              animate={{
                opacity: generating ? 1 : 0,
                y: generating ? 0 : 6,
              }}
              transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
            >
              <span className={styles.genDot} />
              generating…
            </motion.span>
          </motion.div>

          {/* The 4×2 grid of 8 real variations. ALWAYS mounted. Before the
              reveal each cell sits stacked at the reference's centre
              (scaled down, invisible); on reveal each springs into its
              grid slot, staggered — "one becomes eight". */}
          <div className={styles.grid}>
            {VARIATION_ADS.map((ad, i) => (
              <motion.div
                key={ad.src}
                className={styles.cell}
                initial={false}
                animate={
                  gridVisible
                    ? { opacity: 1, scale: 1, x: '0%', y: '0%' }
                    : {
                        // collapsed onto the reference's centre
                        opacity: 0,
                        scale: 0.34,
                        x: cellCollapseX(i),
                        y: cellCollapseY(i),
                      }
                }
                transition={
                  still
                    ? { duration: 0 }
                    : { ...SPRING, delay: gridVisible ? revealDelaySec(i) : 0 }
                }
              >
                <div className={styles.cellFrame}>
                  <Image
                    src={ad.src}
                    alt={ad.alt}
                    fill
                    sizes="(max-width: 960px) 40vw, 130px"
                    className={styles.img}
                  />
                </div>
                <span className={styles.angle}>{ad.angle}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ----- footer ----- */}
        <div className={styles.foot}>
          <span className={styles.footDot} aria-hidden="true" />
          <span className={styles.footText}>{footerLine()}</span>
          <button
            type="button"
            className={styles.replay}
            onClick={replay}
            aria-label="Replay the demo"
          >
            <ReplayIcon /> replay
          </button>
        </div>
      </div>

      <p className={styles.caption}>
        one reference ad in, eight on-brand variations out — batch-created,
        ready to ship. built for SaaS, tuned for trial signups.
      </p>
    </div>
  );
}

/* ----- reveal geometry / timing helpers ------------------------- */

/** Reveal spring delay (seconds) for cell `i`, from the machine's ms. */
function revealDelaySec(i: number): number {
  return revealDelayMs(i) / 1000;
}

/**
 * Pre-reveal collapse offset (% of the cell's own box) that nudges every
 * cell toward the centre of the 4×2 grid, so the stack reads as sitting
 * under the reference before it fans out. Columns 0..3, rows 0..1.
 */
function cellCollapseX(i: number): string {
  const col = i % 4; // 0..3
  // centre of the 4-col grid is between col 1 and 2 → offset toward 1.5
  return `${(1.5 - col) * 105}%`;
}
function cellCollapseY(i: number): string {
  const row = Math.floor(i / 4); // 0..1
  // centre of the 2-row grid is between row 0 and 1 → offset toward 0.5
  return `${(0.5 - row) * 105}%`;
}

/* ----- icons ---------------------------------------------------- */

function ReplayIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 3 3 6 6 6" />
    </svg>
  );
}
