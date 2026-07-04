'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import styles from './LoopScrub.module.css';

/* =================================================================
   LoopScrub — the optimization loop as a pinned, scroll-scrubbed
   film (the Apple treatment, on paper).

   A tall scroll zone (~380vh) pins a single product window while
   scroll progress steps through four moments of the loop:

     01 · analyze   — two ads, opposite stories (CTR vs trial→paid)
     02 · explain   — the granular "why" behind each result
     03 · remember  — learnings committed to the account's memory
     04 · compound  — every batch starts where the last one finished

   A circular loop dial on the left fills with raw scroll progress
   (the one scroll-linked MotionValue — passed straight to the SVG,
   no derived transforms; motion promotes derived values to native
   scroll-timeline animations with broken ranges). Everything else is
   phase STATE + CSS transitions, so scrubbing backwards replays the
   film in reverse.

   SSR + reduced-motion + narrow viewports (Manifesto discipline):
   first paint is a static stacked list of all four moments in their
   FINISHED state — no timers, no scroll math, no hydration branch.
   The pinned scrub only mounts after rAF, when motion is allowed,
   and when the viewport is wide enough to hold the stage.
   ================================================================= */

interface Phase {
  key: string;
  n: string;
  label: string;
  color: string;
  title: string;
  body: string;
  visHead: string;
}

const PHASES: Phase[] = [
  {
    key: 'analyze',
    n: '01',
    label: 'analyze',
    color: 'var(--s1)',
    title: 'Same product. Opposite stories.',
    body: 'Ad one gets the clicks and no buyers. Ad two converts quietly. A dashboard calls that a tie. The loop reads creative and revenue as one picture.',
    visHead: 'performance read · last 7 days',
  },
  {
    key: 'explain',
    n: '02',
    label: 'explain',
    color: 'var(--s2)',
    title: 'We find the why.',
    body: 'Not “creative fatigue”. Specifics: which hook, which image, which claim moved real buyers, and which one just collected clicks.',
    visHead: 'why ad 02 won',
  },
  {
    key: 'remember',
    n: '03',
    label: 'remember',
    color: 'var(--s4)',
    title: 'Your account writes it down.',
    body: 'Every read is saved to your account’s memory. What works for your buyers, on your funnel. Not a generic benchmark.',
    visHead: 'account memory · 3 new entries',
  },
  {
    key: 'compound',
    n: '04',
    label: 'compound',
    color: 'var(--s5)',
    title: 'Week one is the floor.',
    body: 'The next batch starts from everything the last one learned. It compounds, and it’s specific to your account.',
    visHead: 'with the loop vs without',
  },
];

export function LoopScrub() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const apply = () => setWide(mq.matches);
    const raf = requestAnimationFrame(apply);
    mq.addEventListener('change', apply);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener('change', apply);
    };
  }, []);

  const scrub = mounted && !reduce && wide;
  return scrub ? <ScrubStage /> : <StaticPhases />;
}

/* ================= pinned scrub stage (desktop, motion) ============ */

function ScrubStage() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: zoneRef,
    offset: ['start start', 'end end'],
  });
  const [phase, setPhase] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPhase(Math.min(3, Math.max(0, Math.floor(v * 4))));
  });

  return (
    <div ref={zoneRef} className={styles.zone}>
      <div className={styles.sticky}>
        <div className={styles.window}>
          {/* slim status bar — mirrors the hero film's chrome */}
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.barDot} />
            <span className={styles.barLabel}>
              the loop · {PHASES[phase].label}
            </span>
            <span className={styles.progress}>
              {PHASES.map((p, i) => (
                <span
                  key={p.key}
                  className={`${styles.seg} ${i === phase ? styles.segOn : ''} ${
                    i < phase ? styles.segDone : ''
                  }`}
                />
              ))}
            </span>
          </div>

          <div className={styles.stageGrid}>
            <Dial progress={scrollYProgress} phase={phase} />
            <div className={styles.stack}>
              {PHASES.map((p, i) => (
                <div
                  key={p.key}
                  className={`${styles.pane} ${i === phase ? styles.paneOn : ''}`}
                  style={{ '--accent-c': p.color } as React.CSSProperties}
                >
                  <span className={styles.phaseN}>
                    {p.n} · {p.label}
                  </span>
                  <h3 className={styles.phaseTitle}>{p.title}</h3>
                  <p className={styles.phaseBody}>{p.body}</p>
                  <div className={styles.visualBox}>
                    <Frame label={p.visHead}>
                      <PhaseVisual i={i} />
                    </Frame>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.hint} aria-hidden="true">
          keep scrolling · the loop runs on your account’s own data
        </p>
      </div>
    </div>
  );
}

/* The loop dial — a circle that fills with scroll; one node per moment.
   The raw scrollYProgress drives pathLength directly (no useTransform —
   derived scroll values get mis-promoted to native scroll timelines).
   The arc and the centre numeral take the active phase's color. */
const NODE_POS = [
  { x: 60, y: 12 },
  { x: 108, y: 60 },
  { x: 60, y: 108 },
  { x: 12, y: 60 },
];

function Dial({
  progress,
  phase,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  phase: number;
}) {
  return (
    <div
      className={styles.dial}
      style={{ '--dial-c': PHASES[phase].color } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.dialWrap}>
        <svg viewBox="0 0 120 120" className={styles.dialSvg}>
          <circle cx="60" cy="60" r="48" className={styles.dialTrack} />
          <motion.circle
            cx="60"
            cy="60"
            r="48"
            className={styles.dialFill}
            style={{ pathLength: progress }}
            transform="rotate(-90 60 60)"
          />
          {NODE_POS.map((pos, i) => (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="6"
              className={`${styles.dialNode} ${i <= phase ? styles.dialNodeOn : ''}`}
              style={{ '--accent-c': PHASES[i].color } as React.CSSProperties}
            />
          ))}
        </svg>
        <span className={styles.dialCenter}>{PHASES[phase].n}</span>
      </div>
      <ol className={styles.dialList}>
        {PHASES.map((p, i) => (
          <li
            key={p.key}
            className={`${styles.dialItem} ${i === phase ? styles.dialItemOn : ''}`}
            style={{ '--accent-c': p.color } as React.CSSProperties}
          >
            <span className={styles.dialItemDot} />
            {p.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ================= static fallback (SSR, reduced motion, narrow) ==== */

function StaticPhases() {
  return (
    <div className={styles.staticList}>
      {PHASES.map((p, i) => (
        <article
          key={p.key}
          className={`${styles.staticItem} reveal`}
          style={{ '--accent-c': p.color } as React.CSSProperties}
        >
          <div className={styles.staticText}>
            <span className={styles.phaseN}>
              {p.n} · {p.label}
            </span>
            <h3 className={styles.phaseTitle}>{p.title}</h3>
            <p className={styles.phaseBody}>{p.body}</p>
          </div>
          <div className={styles.visualBox}>
            <Frame label={p.visHead}>
              <PhaseVisual i={i} />
            </Frame>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ================= the four visuals ================================ */
/* Pure presentational. Their FINISHED state is the default; while a
   scrub pane is inactive, CSS (.pane:not(.paneOn)) holds bars empty,
   rows hidden, and the curve undrawn, so activating a phase plays the
   reveal — and scrolling back rewinds it. */

/* Shared chrome: a slim header strip above each visual. */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.visHead}>
        <span className={styles.visHeadDot} />
        {label}
      </div>
      <div className={styles.frameBody}>{children}</div>
    </div>
  );
}

function PhaseVisual({ i }: { i: number }) {
  switch (i) {
    case 0:
      return <VisualAnalyze />;
    case 1:
      return <VisualExplain />;
    case 2:
      return <VisualRemember />;
    default:
      return <VisualCompound />;
  }
}

/* 01 — two ads, opposite stories. CTR vs trial→paid bars. */
const ADS = [
  {
    name: 'ad 01',
    verdict: 'clicks, no buyers',
    win: false,
    bars: [
      { label: 'ctr', val: '3.1%', w: 86, tone: 'neutral' as const },
      { label: 'clicks → paid', val: '0.4%', w: 9, tone: 'bad' as const },
    ],
  },
  {
    name: 'ad 02',
    verdict: 'quiet, converts',
    win: true,
    bars: [
      { label: 'ctr', val: '1.4%', w: 40, tone: 'neutral' as const },
      { label: 'clicks → paid', val: '2.8%', w: 72, tone: 'good' as const },
    ],
  },
];

function VisualAnalyze() {
  return (
    <div className={styles.compareGrid}>
      {ADS.map((ad) => (
        <div key={ad.name} className={styles.adTile}>
          <div className={styles.adHead}>
            <span className={styles.adName}>{ad.name}</span>
            <span className={`${styles.adVerdict} ${ad.win ? styles.adWin : styles.adLoss}`}>
              {ad.verdict}
            </span>
          </div>
          {ad.bars.map((b) => (
            <div key={b.label} className={styles.metric}>
              <span className={styles.metricLabel}>{b.label}</span>
              <span className={styles.metricTrack}>
                <span
                  className={`${styles.metricFill} ${
                    b.tone === 'good' ? styles.fillGood : b.tone === 'bad' ? styles.fillBad : ''
                  }`}
                  style={{ width: `${b.w}%` }}
                />
              </span>
              <span className={styles.metricVal}>{b.val}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* 02 — the why, line by line. */
const FINDINGS = [
  { tag: 'hook', text: 'pricing up front filtered the tire-kickers', meta: '+1.9% conv' },
  { tag: 'image', text: 'product close-up beat the lifestyle shot', meta: '+0.8% conv' },
  { tag: 'claim', text: 'problem-first beat feature-first on cold traffic', meta: '-24% cpa' },
];

function VisualExplain() {
  return (
    <ul className={styles.rows}>
      {FINDINGS.map((f) => (
        <li key={f.tag} className={styles.row}>
          <span className={styles.rowTag}>{f.tag}</span>
          <span className={styles.rowText}>{f.text}</span>
          <span className={styles.rowMeta}>{f.meta}</span>
        </li>
      ))}
    </ul>
  );
}

/* 03 — committed to memory. */
const MEMORIES = [
  { text: 'lead with pricing for cold traffic', meta: 'wk 02' },
  { text: 'default to product close-ups', meta: 'wk 03' },
  { text: 'retire lifestyle shots for prospecting', meta: 'wk 03' },
];

function VisualRemember() {
  return (
    <ul className={styles.rows}>
      {MEMORIES.map((m) => (
        <li key={m.text} className={styles.row}>
          <span className={`${styles.rowTag} ${styles.rowTagMem}`}>saved</span>
          <span className={styles.rowText}>{m.text}</span>
          <span className={styles.rowMeta}>{m.meta}</span>
          <svg
            className={styles.rowTick}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/* 04 — the compounding curve: smooth rise with a gradient wash, batch
   dots, and a flat "without the loop" baseline for contrast.
   pathLength=1 normalises the dash math so CSS can draw/rewind the
   curve with a single stroke-dashoffset transition. */
const BATCH_DOTS: [number, number][] = [
  [12, 116],
  [60, 108],
  [108, 92],
  [156, 72],
  [204, 50],
];

function VisualCompound() {
  return (
    <div className={styles.chart}>
      <svg viewBox="0 0 260 140" className={styles.chartSvg} aria-hidden="true">
        <defs>
          <linearGradient id="loopAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={styles.gradTop} />
            <stop offset="1" className={styles.gradBottom} />
          </linearGradient>
        </defs>

        {/* dotted gridlines */}
        <line x1="12" y1="44" x2="248" y2="44" className={styles.chartGrid} />
        <line x1="12" y1="76" x2="248" y2="76" className={styles.chartGrid} />
        <line x1="12" y1="108" x2="248" y2="108" className={styles.chartGrid} />

        {/* without-the-loop baseline */}
        <path d="M12 119 C 70 118.5 160 117 248 113" className={styles.chartBase} pathLength={1} />

        {/* gradient wash under the curve */}
        <path
          d="M12 116 C 28 114 44 112 60 108 C 76 104 92 99 108 92 C 124 85 140 79 156 72 C 172 65 188 58 204 50 C 220 43 234 36 248 30 L248 132 L12 132 Z"
          className={styles.chartArea}
        />

        {/* the compounding curve */}
        <path
          d="M12 116 C 28 114 44 112 60 108 C 76 104 92 99 108 92 C 124 85 140 79 156 72 C 172 65 188 58 204 50 C 220 43 234 36 248 30"
          className={styles.chartLine}
          pathLength={1}
        />

        {/* batch dots + the emphasised endpoint */}
        {BATCH_DOTS.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="3.2" className={styles.chartDot} />
        ))}
        <circle cx="248" cy="30" r="8.5" className={styles.chartDotRing} />
        <circle cx="248" cy="30" r="4.4" className={styles.chartDotEnd} />
      </svg>

      <span className={styles.chartChip}>batch 06 · best yet</span>
      <span className={styles.chartBaseLabel}>without the loop</span>

      <div className={styles.chartMeta}>
        <span>batch 01 → 06</span>
        <span className={styles.chartKey}>clicks → paid, per batch</span>
      </div>
    </div>
  );
}
