'use client';

import { useEffect, useReducer } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Phase,
  PHASE_MS,
  phaseLabel,
  CONCEPTS,
  SELECTED_ORDER,
  SELECTED_COUNT,
  PICK_STEP_MS,
  footerLine,
  AD_WALL,
  AD_COUNT,
  WALL_STEP_MS,
  type AdDef,
} from './batchDemoMachine';
import styles from './BatchDemo.module.css';

/* ----- Loop state machine -------------------------------------- */

interface State {
  /** Bumped on every full restart; used as a React `key` to remount
   *  the animated subtree so motion replays cleanly. */
  cycle: number;
  phase: Phase;
  /** Tiles selected so far in the Pick cascade (0..SELECTED_COUNT). */
  picked: number;
  /** Whether the batch button has "fired" (ripple/flash). */
  fired: boolean;
}

type Action =
  | { type: 'restart' }
  | { type: 'phase'; phase: Phase }
  | { type: 'pick'; n: number }
  | { type: 'fire' }
  | { type: 'final' };

const FINAL: Omit<State, 'cycle'> = {
  phase: Phase.Payoff,
  picked: SELECTED_COUNT,
  fired: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'restart':
      return { cycle: state.cycle + 1, phase: Phase.Brand, picked: 0, fired: false };
    case 'phase':
      return { ...state, phase: action.phase };
    case 'pick':
      return { ...state, picked: action.n };
    case 'fire':
      return { ...state, fired: true };
    case 'final':
      return { ...state, ...FINAL };
  }
}

/* ----- Component ------------------------------------------------ */

export function BatchDemo() {
  const reduce = useReducedMotion();

  // Under reduced motion we render the final wall statically — the
  // reducer simply *starts* in the final state and the loop effect is
  // skipped, so no setState ever runs in an effect body.
  // Initial state is DETERMINISTIC — identical on the server and the first
  // client render — so there is no hydration mismatch. Reduced-motion users are
  // switched to the final wall in the post-mount effect below (client-only).
  const [state, dispatch] = useReducer(
    reducer,
    { cycle: 0, phase: Phase.Brand, picked: 0, fired: false },
  );

  // Imperative restart trigger for the ↻ replay control. Bumping the nonce
  // re-runs the loop effect, which clears pending timers and starts over.
  const [nonce, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (reduce) {
      // Post-mount only (client) → no SSR involvement, no hydration mismatch.
      // Deferred out of the effect body for react-hooks/set-state-in-effect.
      const id = requestAnimationFrame(() => dispatch({ type: 'final' }));
      return () => cancelAnimationFrame(id);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    function runLoop() {
      dispatch({ type: 'restart' });

      let t = 0;
      // Phase 1 · brand
      t += PHASE_MS[Phase.Brand];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Concepts }));
      // Phase 2 · concepts
      t += PHASE_MS[Phase.Concepts];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Pick }));
      // Phase 3 · pick — staggered cascade of 10 tiles
      const pickStart = t;
      for (let i = 1; i <= SELECTED_COUNT; i++) {
        at(pickStart + i * PICK_STEP_MS, () => dispatch({ type: 'pick', n: i }));
      }
      t += PHASE_MS[Phase.Pick];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Batch }));
      // Phase 4 · batch — let the button pulse, then "fire" near the end
      at(t + PHASE_MS[Phase.Batch] - 180, () => dispatch({ type: 'fire' }));
      t += PHASE_MS[Phase.Batch];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Wall }));
      // Phase 5 · the wall
      t += PHASE_MS[Phase.Wall];
      at(t, () => dispatch({ type: 'phase', phase: Phase.Payoff }));
      // Phase 6 · payoff, then loop
      t += PHASE_MS[Phase.Payoff];
      at(t, runLoop);
    }

    // Defer the first dispatch out of the synchronous effect body
    // (react-hooks/set-state-in-effect); everything after runs in timers.
    const kickoff = requestAnimationFrame(runLoop);
    return () => {
      cancelAnimationFrame(kickoff);
      timers.forEach(clearTimeout);
    };
  }, [reduce, nonce]);

  const { cycle, phase, picked, fired } = state;

  // Replay restarts the whole loop (or, under reduce, just stays final).
  function replay() {
    if (reduce) return;
    bump();
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.window}
        role="img"
        aria-label="A short demo: BetterYourAds learns your brand, you pick ad concepts, hit batch, and a wall of ten on-brand ads is generated at once."
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
          <span className={styles.phaseLabel}>{phaseLabel(phase)}</span>
          {phase === Phase.Pick ? (
            <span className={styles.counter}>
              {picked} selected
            </span>
          ) : phase >= Phase.Wall ? (
            <span className={styles.counter}>{AD_COUNT} ads</span>
          ) : null}
        </div>

        {/* ----- body — the animated stage ----- */}
        <div className={styles.stage} aria-hidden="true">
          <AnimatePresence mode="wait">
            <Stage
              key={`${cycle}-${phase}`}
              phase={phase}
              picked={picked}
              fired={fired}
              reduce={!!reduce}
            />
          </AnimatePresence>
        </div>

        {/* ----- footer ----- */}
        <div className={styles.foot}>
          <span
            className={styles.footDot}
            style={{
              background:
                phase >= Phase.Wall ? 'var(--bya-forest)' : 'var(--accent)',
            }}
            aria-hidden="true"
          />
          <span className={styles.footText} key={footerLine(phase)}>
            {footerLine(phase)}
          </span>
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
        a quick look at how it works — pick concepts, batch, ship. built for
        SaaS, tuned for trial signups.
      </p>
    </div>
  );
}

/* ----- The animated stage (one phase at a time) ----------------- */

function Stage({
  phase,
  picked,
  fired,
  reduce,
}: {
  phase: Phase;
  picked: number;
  fired: boolean;
  reduce: boolean;
}) {
  if (phase === Phase.Brand) return <BrandKit />;
  if (phase === Phase.Concepts || phase === Phase.Pick)
    return <Concepts picked={picked} active={phase === Phase.Pick} />;
  if (phase === Phase.Batch) return <BatchButton fired={fired} />;
  return <Wall reduce={reduce} />; // Wall + Payoff both show the wall
}

/* ----- Phase 1 · brand kit -------------------------------------- */

const SWATCHES = ['var(--accent)', 'var(--bya-forest)', 'var(--bya-rust)', 'var(--bya-ink)'];

function BrandKit() {
  return (
    <motion.div
      className={styles.brandKit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
    >
      <div className={styles.brandMark} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M5 19 12 4l7 15" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.2 13h7.6" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <div className={styles.brandSwatches}>
        {SWATCHES.map((c, i) => (
          <motion.span
            key={c}
            style={{ background: c }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12 + i * 0.07, type: 'spring', stiffness: 480, damping: 22 }}
          />
        ))}
      </div>
      <div className={styles.brandType} aria-hidden="true">
        Aa
        <span className={styles.brandTypeMeta}>DM Sans · 500</span>
      </div>
    </motion.div>
  );
}

/* ----- Phases 2–3 · concept grid + pick cascade ----------------- */

function Concepts({ picked, active }: { picked: number; active: boolean }) {
  // `picked` is the running count from the cascade; the selected set is the
  // first `picked` indices in SELECTED_ORDER. (selectedSetAt is the time-based
  // equivalent, unit-tested in batchDemo.test.ts.)
  const sel = active ? new Set(SELECTED_ORDER.slice(0, picked)) : new Set<number>();

  return (
    <motion.div
      className={styles.conceptGrid}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.03 } },
      }}
    >
      {CONCEPTS.map((label, i) => {
        const isSel = sel.has(i);
        return (
          <motion.div
            key={label}
            className={`${styles.concept} ${isSel ? styles.conceptSel : ''}`.trim()}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 520, damping: 26 }}
          >
            <span className={styles.conceptCheck} aria-hidden="true">
              {isSel ? <CheckIcon /> : null}
            </span>
            <span className={styles.conceptLabel}>{label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ----- Phase 4 · the batch button ------------------------------- */

function BatchButton({ fired }: { fired: boolean }) {
  return (
    <motion.div
      className={styles.batchWrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={styles.batchBtn}
        animate={
          fired
            ? { scale: [1, 0.95, 1.04, 1] }
            : { scale: [1, 1.04, 1] }
        }
        transition={
          fired
            ? { duration: 0.28, ease: [0.2, 0, 0, 1] }
            : { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <span className={styles.bolt} aria-hidden="true">⚡</span>
        batch create
        {fired ? <span className={styles.ripple} /> : null}
      </motion.div>
      <span className={styles.batchHint}>{SELECTED_COUNT} concepts queued</span>
    </motion.div>
  );
}

/* ----- Phase 5 · THE WALL --------------------------------------- */

function Wall({ reduce = false }: { reduce?: boolean }) {
  return (
    <motion.div
      className={styles.wall}
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: WALL_STEP_MS / 1000 } },
      }}
    >
      {AD_WALL.map((ad, i) => (
        <motion.div
          key={`${ad.kind}-${i}`}
          className={styles.adCell}
          variants={
            reduce
              ? undefined
              : {
                  hidden: { opacity: 0, scale: 0.82 },
                  show: { opacity: 1, scale: 1 },
                }
          }
          transition={{ type: 'spring', stiffness: 560, damping: 28 }}
        >
          <Ad ad={ad} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ----- The 10 distinct ad creatives ----------------------------- */

function Ad({ ad }: { ad: AdDef }) {
  const cls = `${styles.ad} ${styles[`tint_${ad.tint}`]}`;
  switch (ad.kind) {
    case 'headline':
      return (
        <div className={`${cls} ${styles.adHeadline}`}>
          <span className={styles.hl}>
            Ship ads
            <br />
            faster.
          </span>
          <span className={styles.hlRule} />
          <span className={styles.adFoot}>betteryourads</span>
        </div>
      );
    case 'stat':
      return (
        <div className={`${cls} ${styles.adStat}`}>
          <span className={styles.statBig}>2.4×</span>
          <span className={styles.statSub}>more trial signups</span>
          <span className={styles.adFootLight}>per ad spend</span>
        </div>
      );
    case 'quote':
      return (
        <div className={`${cls} ${styles.adQuote}`}>
          <span className={styles.quoteMark}>“</span>
          <span className={styles.quoteText}>Finally, a batch of ads that actually look on-brand.</span>
          <span className={styles.quoteWho}>— Head of Growth</span>
        </div>
      );
    case 'beforeAfter':
      return (
        <div className={`${cls} ${styles.adBA}`}>
          <span className={styles.baLabel}>before</span>
          <span className={styles.baBar}>
            <span className={styles.baFill} style={{ width: '28%' }} />
          </span>
          <span className={styles.baLabel}>after</span>
          <span className={styles.baBar}>
            <span className={`${styles.baFill} ${styles.baFillHi}`} style={{ width: '86%' }} />
          </span>
          <span className={styles.adFoot}>signup rate</span>
        </div>
      );
    case 'logo':
      return (
        <div className={`${cls} ${styles.adLogo}`}>
          <span className={styles.logoLock} aria-hidden="true">
            <span className={styles.logoGlyph}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M5 19 12 4l7 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.2 13h7.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            betteryourads
          </span>
          <span className={styles.logoTag}>meta ads, run for you.</span>
        </div>
      );
    case 'question':
      return (
        <div className={`${cls} ${styles.adQuestion}`}>
          <span className={styles.qText}>
            Still briefing
            <br />
            your agency?
          </span>
          <span className={styles.qArrow} aria-hidden="true">→</span>
        </div>
      );
    case 'features':
      return (
        <div className={`${cls} ${styles.adFeatures}`}>
          <span className={styles.featTitle}>One button.</span>
          <ul className={styles.featList}>
            <li>
              <CheckIcon /> on-brand
            </li>
            <li>
              <CheckIcon /> a full batch
            </li>
            <li>
              <CheckIcon /> ready to ship
            </li>
          </ul>
        </div>
      );
    case 'manifesto':
      return (
        <div className={`${cls} ${styles.adManifesto}`}>
          <span className={styles.manText}>
            MORE
            <br />
            ADS.
            <br />
            LESS
            <br />
            WAITING.
          </span>
        </div>
      );
    case 'compare':
      return (
        <div className={`${cls} ${styles.adCompare}`}>
          <div className={styles.cmpRow}>
            <span className={styles.cmpThem}>agency</span>
            <span className={styles.cmpThemV}>weeks</span>
          </div>
          <div className={`${styles.cmpRow} ${styles.cmpUsRow}`}>
            <span className={styles.cmpUs}>betteryourads</span>
            <span className={styles.cmpUsV}>minutes</span>
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className={`${cls} ${styles.adCta}`}>
          <span className={styles.ctaTop}>Your first 30 ads,</span>
          <span className={styles.ctaMid}>on us.</span>
          <span className={styles.ctaBtn}>start free →</span>
        </div>
      );
  }
}

/* ----- icons ---------------------------------------------------- */

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 3 3 6 6 6" />
    </svg>
  );
}
