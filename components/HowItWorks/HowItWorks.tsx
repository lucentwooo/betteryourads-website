'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { SectionHead } from '@/components/ui/SectionHead';
import { AnglePicker } from './AnglePicker';
import { WORKED_EXAMPLE } from '@/lib/creatives';

const CHIRP = WORKED_EXAMPLE.ads;
import styles from './HowItWorks.module.css';

/* HowItWorks — the self-serve creative pipeline as scroll-driven narrative.

   A sticky left rail tracks five stages (learn → angles → BATCH → ship →
   optimize) while a column of stage panels scrolls past on the right. An
   IntersectionObserver lights up the active rail step and fills the progress
   spine. The BATCH stage is the centrepiece: one reference ad becomes an
   unlimited batch of on-brand variations (deliberately look-alike, since
   they're generated off the reference) — the thing agencies and DIY tools
   structurally can't do.

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
  cta?: { label: string; href: string };
}

/* The awareness ladder — one accent per stage, cold → warm. Flows through
   the rail dots, the spine fill, and the panel numerals as you scroll. */
const STAGE_COLORS = [
  'var(--s1)',
  'var(--s2)',
  'var(--s3)',
  'var(--s4)',
  'var(--s5)',
] as const;

const STAGES: Stage[] = [
  {
    key: 'learn',
    rail: 'learn the brand',
    n: '01',
    title: 'Loopy reads your site.',
    desc: 'Drop your URL. Loopy extracts positioning, category, ICP, and palette in about twelve seconds. No briefing call, no questionnaire.',
    visual: <VisualLearn />,
  },
  {
    key: 'angles',
    rail: 'generate the angles',
    n: '02',
    title: 'Angles, generated for you to test.',
    desc: 'One angle for each of the five stages of awareness. You don’t guess which message lands, real buyers pick the winner, and that shows you what your market actually cares about.',
    visual: <AnglePicker />,
  },
  {
    key: 'batch',
    rail: 'batch the creative',
    n: '03',
    title: 'One reference. Unlimited on-brand variations.',
    desc: 'Same system, same palette, a different hook in each, all batched from one ad that already works. No cap. This is the part agencies and DIY tools can’t do.',
    visual: <VisualBatch />,
  },
  {
    key: 'ship',
    rail: 'ship to Meta',
    n: '04',
    title: 'Go live on Facebook & Instagram in a click.',
    desc: 'One click and the batch goes live as real Meta placements. No ad-account wrangling, no creative handoff.',
    visual: <VisualShip />,
  },
  {
    key: 'optimize',
    rail: 'analyze & iterate',
    n: '05',
    title: 'Your winning angle is customer research.',
    desc: 'Each week we show you which angle is winning and why: the hook, the message, the proof. That winner is your market telling you what it cares about, so you can point your positioning and roadmap at it, not just your ads. Then we batch fresh variations off it in one click.',
    visual: <VisualOptimize />,
    cta: { label: 'watch it compound in the loop ↓', href: '#loop' },
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const panels = useRef<(HTMLElement | null)[]>([]);

  // Dimming only applies once JS is live, so the SSR/no-JS page shows
  // every panel at full strength.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
          eyebrowTag="var(--s2)"
          title="Learns. Batches. Launches. Optimizes for revenue."
          sub="Five stages, about 90 seconds per ad. You drive, the software does the hard part. Tuned for what shows up in revenue, not your CTR column."
        />

        <div className={styles.grid}>
          {/* Sticky rail — the pipeline tracker */}
          <ol className={styles.rail} aria-hidden="true">
            {STAGES.map((s, i) => (
              <li
                key={s.key}
                className={`${styles.railItem} ${i <= active ? styles.railOn : ''}`}
                style={{ '--accent-c': STAGE_COLORS[i] } as React.CSSProperties}
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
                className={`${styles.panel} ${mounted ? styles.dimmable : ''} ${i === active ? styles.panelActive : ''}`}
                style={{ '--accent-c': STAGE_COLORS[i] } as React.CSSProperties}
              >
                <div className={styles.panelText}>
                  <span className={styles.panelN}>{s.n}</span>
                  <h3 className={styles.panelTitle}>{s.title}</h3>
                  <p className={styles.panelDesc}>{s.desc}</p>
                  {s.cta ? (
                    <a className={styles.panelCta} href={s.cta.href}>
                      {s.cta.label}
                    </a>
                  ) : null}
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
        <span className={styles.learnUrl}>https://trychirp.com</span>
        <span className={styles.learnTime}>analyzed in 12s</span>
      </div>
      <div className={styles.learnGrid}>
        <span className={styles.learnKey}>positioning</span>
        <span>ask your pipeline anything</span>
        <span className={styles.learnKey}>category</span>
        <span>ai sales agent</span>
        <span className={styles.learnKey}>icp</span>
        <span>reps &amp; founder-led sales</span>
        <span className={styles.learnKey}>palette</span>
        <span className={styles.learnSwatches}>
          <span className={styles.learnSwatch} style={{ background: '#63c973' }} />
          <span className={styles.learnSwatch} style={{ background: '#fec748' }} />
          <span className={styles.learnSwatch} style={{ background: '#20442a' }} />
          <span className={styles.learnSwatch} style={{ background: '#ffffff' }} />
        </span>
      </div>
      <div className={styles.learnFoot}>
        <span className={styles.learnFootKey}>5 angles generated</span>
        <span className={styles.learnFootAccent}>continue →</span>
      </div>
    </div>
  );
}

/* ----- Stage 03 — the BATCH: one reference becomes look-alike variations ----- */
function VisualBatch() {
  return (
    <div className={styles.batch}>
      <div className={styles.batchHead}>
        <span className={styles.batchDot} />
        on-brand variations · one reference, no cap
      </div>
      <div className={styles.batchGrid}>
        {CHIRP.map((ad) => (
          <span className={styles.batchCell} key={ad.src}>
            <Image
              src={ad.src}
              alt={ad.alt}
              fill
              sizes="200px"
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
  const ad = CHIRP[0];
  return (
    <div className={styles.ship}>
      <div className={styles.shipBar}>
        <span className={styles.shipAvatar} />
        <span className={styles.shipName}>
          Chirp
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
  const ad = CHIRP[2];
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
            “i’ll never get that hour back”
          </span>
          <span className={styles.readWinSub}>your top performer · problem-aware</span>
        </span>
      </div>
      <ul className={styles.readWhy}>
        <li>
          <Tick /> names the pain in one line
        </li>
        <li>
          <Tick /> a rep’s voice, not corporate
        </li>
        <li>
          <Tick /> flips the pain into proof
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
