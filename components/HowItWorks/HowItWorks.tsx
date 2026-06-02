'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { SectionHead } from '@/components/ui/SectionHead';
import { AnglePicker } from './AnglePicker';
import { VARIATION_ADS, VARIATION_COUNT } from '@/lib/demoAds';
import styles from './HowItWorks.module.css';

/* HowItWorks — the done-for-you pipeline as scroll-driven narrative.

   A sticky left rail tracks five stages (learn → angles → BATCH → ship →
   optimize) while a column of stage panels scrolls past on the right. An
   IntersectionObserver lights up the active rail step and fills the progress
   spine. The BATCH stage is the centrepiece: one brief becomes eight real ads
   — the thing agencies and DIY tools structurally can't do.

   SSR-safe: the active step starts at 0 (deterministic, no useReducedMotion
   branch); the observer only refines it after mount. Reduced motion keeps the
   rail and panels fully legible — the only thing it drops is the spine's fill
   transition and the panels' scroll-reveal (handled in CSS). */

interface Stage {
  key: string;
  rail: string;
  n: string;
  title: string;
  desc: string;
  visual: ReactNode;
}

const STAGES: Stage[] = [
  {
    key: 'learn',
    rail: 'learn the brand',
    n: '01',
    title: 'We read your site.',
    desc: 'Drop your URL. We extract positioning, category, ICP, and palette in about twelve seconds. No briefing call, no questionnaire.',
    visual: <VisualLearn />,
  },
  {
    key: 'angles',
    rail: 'generate the angles',
    n: '02',
    title: 'We generate angles to test.',
    desc: 'One angle for each of the five stages of awareness — unaware to most-aware. You don’t guess which message lands; you test the whole spread and let signups pick the winner.',
    visual: <AnglePicker />,
  },
  {
    key: 'batch',
    rail: 'batch the creative',
    n: '03',
    title: 'One brief becomes eight ads.',
    desc: 'Every angle renders on-brand, in your palette and voice — a whole batch at once, not one ad at a time. This is the part agencies and DIY tools can’t do.',
    visual: <VisualBatch />,
  },
  {
    key: 'ship',
    rail: 'ship to Meta',
    n: '04',
    title: 'We launch on Facebook & Instagram.',
    desc: 'One click and the batch goes live as real Meta placements — no ad-account wrangling, no creative handoff.',
    visual: <VisualShip />,
  },
  {
    key: 'optimize',
    rail: 'analyze & iterate',
    n: '05',
    title: 'We find what’s working — and why.',
    desc: 'Each week we analyze performance and show you why a creative is winning — the hook, the angle, the proof — then generate fresh variations off the winners so iterating is one click. Fully autonomous optimization is on the way.',
    visual: <VisualOptimize />,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Light up whichever panel is crossing the viewport's centre band.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.i);
            setActive(i); // in an observer callback, not the sync effect body
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const el of panels.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section" id="how">
      <div className="wrap">
        <SectionHead
          eyebrow="how it works"
          eyebrowAccent
          title="Learns. Batches. Launches. Optimizes for signups."
          sub="Five stages, about 90 seconds per ad, fully done for you. Tuned for what shows up in your Stripe dashboard — not your CTR column."
        />

        <div className={styles.grid}>
          {/* Sticky rail — the pipeline tracker */}
          <ol className={styles.rail} aria-hidden="true">
            {STAGES.map((s, i) => (
              <li
                key={s.key}
                className={`${styles.railItem} ${i <= active ? styles.railOn : ''}`}
              >
                <span className={styles.railDot} />
                <span className={styles.railLabel}>{s.rail}</span>
              </li>
            ))}
          </ol>

          {/* Scrolling stage panels */}
          <div className={styles.panels}>
            {STAGES.map((s, i) => (
              <article
                key={s.key}
                data-i={i}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                className={`${styles.panel} reveal ${i === active ? styles.panelActive : ''}`}
              >
                <div className={styles.panelText}>
                  <span className={styles.panelN}>{`${s.n} //`}</span>
                  <h3 className={styles.panelTitle}>{s.title}</h3>
                  <p className={styles.panelDesc}>{s.desc}</p>
                </div>
                <div className={styles.visual}>{s.visual}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- Stage 01 — "We read your site" ----- */
function VisualLearn() {
  return (
    <div className={styles.learn}>
      <div className={styles.learnRow}>
        <div className={styles.learnDot} />
        <span className={styles.learnUrl}>https://yoursaas.com</span>
        <span className={styles.learnTime}>analyzed in 12s</span>
      </div>
      <div className={styles.learnGrid}>
        <span className={styles.learnKey}>positioning</span>
        <span>speed is the feature</span>
        <span className={styles.learnKey}>category</span>
        <span>project tracking</span>
        <span className={styles.learnKey}>icp</span>
        <span>technical founders, 10-200 eng</span>
        <span className={styles.learnKey}>palette</span>
        <span className={styles.learnSwatches}>
          <span className={styles.learnSwatch} style={{ background: '#5e6ad2' }} />
          <span className={styles.learnSwatch} style={{ background: '#0b0c10' }} />
          <span className={styles.learnSwatch} style={{ background: '#f4f5f8' }} />
          <span className={styles.learnSwatch} style={{ background: '#9aa0b4' }} />
        </span>
      </div>
      <div className={styles.learnFoot}>
        <span className={styles.learnFootKey}>5 angles generated</span>
        <span className={styles.learnFootAccent}>continue →</span>
      </div>
    </div>
  );
}

/* ----- Stage 03 — the BATCH: one brief becomes eight real ads ----- */
function VisualBatch() {
  return (
    <div className={styles.batch}>
      <div className={styles.batchHead}>
        <span className={styles.batchDot} />
        {VARIATION_COUNT} on-brand variations · one batch
      </div>
      <div className={styles.batchGrid}>
        {VARIATION_ADS.map((ad) => (
          <span className={styles.batchCell} key={ad.src}>
            <Image
              src={ad.src}
              alt={ad.alt}
              fill
              sizes="84px"
              className={styles.batchImg}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----- Stage 04 — ship to Meta: a real placement ----- */
function VisualShip() {
  const ad = VARIATION_ADS[0];
  return (
    <div className={styles.ship}>
      <div className={styles.shipBar}>
        <span className={styles.shipAvatar} />
        <span className={styles.shipName}>
          Your SaaS
          <span className={styles.shipMeta}>Sponsored · Meta</span>
        </span>
      </div>
      <div className={styles.shipMedia}>
        <div className={styles.shipMediaInner}>
          <Image
            src={ad.src}
            alt={ad.alt}
            fill
            sizes="280px"
            className={styles.shipImg}
          />
        </div>
      </div>
      <div className={styles.shipActions}>
        <span className={styles.shipAction}>Like</span>
        <span className={styles.shipAction}>Comment</span>
        <span className={styles.shipCta}>Start free trial</span>
      </div>
    </div>
  );
}

/* ----- Stage 05 visual: "this week's read" — analyze → why → re-generate.
   We don't touch spend (yet): we surface the winning creative, explain WHY it
   won, and generate fresh variations off it so the founder iterates in a click.
   Fully autonomous optimisation is the roadmap. ----- */
function VisualOptimize() {
  const ad = VARIATION_ADS[3];
  return (
    <div className={styles.read}>
      <div className={styles.readHead}>
        <span className={styles.readDot} />
        this week’s read
      </div>
      <div className={styles.readWinner}>
        <span className={styles.readThumb}>
          <Image
            src={ad.src}
            alt={ad.alt}
            fill
            sizes="48px"
            className={styles.readImg}
          />
        </span>
        <span className={styles.readWinText}>
          <span className={styles.readWinName}>
            “standups are killing your velocity”
          </span>
          <span className={styles.readWinSub}>your top performer · problem-aware</span>
        </span>
      </div>
      <ul className={styles.readWhy}>
        <li>
          <Tick /> names the pain in one line
        </li>
        <li>
          <Tick /> founder voice, not corporate
        </li>
        <li>
          <Tick /> proof point up front
        </li>
      </ul>
      <div className={styles.readFoot}>→ briefed + 3 fresh variations generated</div>
    </div>
  );
}

function Tick() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.tick}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
