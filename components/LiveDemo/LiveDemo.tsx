'use client';

import { useEffect, useReducer } from 'react';
import Image from 'next/image';
import {
  DEMO_URL,
  DEMO_PALETTE,
  FEED_DEFS,
  statusText,
  feedRowState,
  stepLabel,
  canvasOpacities,
} from './liveDemoMachine';
import styles from './LiveDemo.module.css';

interface State { phase: number; typedChars: number; progress: number; }
type Action =
  | { type: 'reset' }
  | { type: 'typed'; n: number }
  | { type: 'phase'; p: number }
  | { type: 'progress'; v: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset': return { phase: 0, typedChars: 0, progress: 0 };
    case 'typed': return { ...state, typedChars: action.n };
    case 'phase': return { ...state, phase: action.p };
    case 'progress': return { ...state, progress: action.v };
  }
}

// Timeline constants, copied from legacy liveDemo() (lines 579-581).
const TYPE_MS = 700;
const T = { typed: 950, audit: 1750, cust: 2550, brand: 3350, concept: 4150, render: 4950, shipped: 7050, cycle: 9300 };
const RENDER_STEPS = 28;

export function LiveDemo() {
  const [state, dispatch] = useReducer(reducer, { phase: 0, typedChars: 0, progress: 0 });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    function runCycle() {
      dispatch({ type: 'reset' });
      for (let i = 1; i <= DEMO_URL.length; i++) {
        at((TYPE_MS * i) / DEMO_URL.length, () => dispatch({ type: 'typed', n: i }));
      }
      at(T.typed, () => dispatch({ type: 'phase', p: 1 }));
      at(T.audit, () => dispatch({ type: 'phase', p: 2 }));
      at(T.cust, () => dispatch({ type: 'phase', p: 3 }));
      at(T.brand, () => dispatch({ type: 'phase', p: 4 }));
      at(T.concept, () => dispatch({ type: 'phase', p: 5 }));
      at(T.render, () => dispatch({ type: 'phase', p: 6 }));
      for (let i = 1; i <= RENDER_STEPS; i++) {
        at(T.concept + i * 70, () => dispatch({ type: 'progress', v: i / RENDER_STEPS }));
      }
      at(T.shipped, () => dispatch({ type: 'phase', p: 7 }));
      at(T.cycle, runCycle);
    }

    runCycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  const { phase, typedChars, progress } = state;
  const generated = phase >= 1;
  const { wire, grad, img } = canvasOpacities(progress);

  const gradStyle = `linear-gradient(135deg, ${DEMO_PALETTE[0]} 0%, ${DEMO_PALETTE[1]} 50%, ${DEMO_PALETTE[2]} 100%)`;

  return (
    <div className={styles.ldg}>
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#febc2e' }} />
          <span style={{ background: '#28c840' }} />
        </div>
        <div className={styles.appUrl}>app.betteryourads.com</div>
        <div className={styles.live}><span className={styles.tick} />live</div>
      </div>

      <div className={styles.urlRow}>
        <div className={styles.urlLabel}>your site</div>
        <div className={styles.urlInput}>
          <span className={styles.urlScheme}>https://</span>
          <span className={styles.urlTyped}>{DEMO_URL.slice(0, typedChars)}</span>
          {phase === 0 ? <span className={styles.caret} /> : null}
        </div>
        <div className={`${styles.analyzeBtn} ${generated ? styles.done : ''}`.trim()}>
          {generated ? <Check /> : 'generate'}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.feed}>
          {FEED_DEFS.map((def) => {
            const rs = feedRowState(def, phase);
            return (
              <div key={def.label} className={`${styles.feedRow} ${styles[rs]}`}>
                <div className={styles.feedMark}>
                  {rs === 'done' ? <Check />
                    : rs === 'active' ? <span className={styles.feedPulse} />
                    : <span className={styles.feedEmpty} />}
                </div>
                <div className={styles.feedContent}>
                  <div className={styles.feedLabel}>{def.label}</div>
                  <div className={styles.feedValue}>
                    {rs === 'idle' ? <span className={styles.feedWait}>·</span>
                      : def.value(phase) === '__PALETTE__' ? <Palette />
                      : def.value(phase)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.canvasWrap}>
          <div className={styles.canvas}>
            <div className={styles.wire} style={{ opacity: wire }}>
              <div className={styles.wireBar} style={{ width: '30%', top: '16%' }} />
              <div className={styles.wireBar} style={{ width: '62%', top: '44%', height: '10%' }} />
              <div className={styles.wireBar} style={{ width: '46%', top: '58%', height: '5%' }} />
              <div className={styles.wireBar} style={{ width: '26%', bottom: '16%', height: '11%' }} />
            </div>
            <div className={styles.canvasBg} style={{ background: gradStyle, opacity: grad }} />
            <Image
              className={`${styles.canvasImg} ${img > 0.6 ? styles.in : ''}`.trim()}
              style={{ opacity: img }}
              src="/demo-clickup-ad.jpg"
              alt="clickup ad mockup"
              width={240}
              height={240}
            />
            {phase === 7 ? (
              <div className={styles.canvasBadge}>
                <span className={styles.tick} />running on meta
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <span
          className={styles.statusDot}
          style={{ background: phase === 7 ? 'var(--bya-forest)' : 'var(--accent)' }}
        />
        <span className={styles.statusText}>{statusText(phase)}</span>
        <span className={styles.footMeta}>{stepLabel(phase)}</span>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Palette() {
  return (
    <span className={styles.feedPalette}>
      {DEMO_PALETTE.map((c, i) => (
        <span key={c} style={{ background: c, transitionDelay: `${i * 80}ms` }} />
      ))}
      <span className={styles.feedPaletteText}>+ bold all-caps</span>
    </span>
  );
}
