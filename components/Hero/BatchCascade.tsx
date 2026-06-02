'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HERO_BRAND } from '@/lib/creatives';
import styles from './BatchCascade.module.css';

/* =================================================================
   BatchCascade — the signature hero moment, rebuilt as a compact,
   cinematic, auto-playing "process film."

   A single bounded product window (≤560px wide, ~420px tall) morphs
   through four beats on a ~9s loop, telling the whole process front
   to back, then loops:

     0 · audit     — we read your site (brand-kit extracted)
     1 · angles    — five angles to test (one per awareness stage)
     2 · seed      — your best ad becomes the reference seed
     3 · generate  — one reference fans into an on-brand batch

   SSR + reduced-motion (Manifesto discipline): FIRST PAINT is fully
   deterministic — the server and any reduced-motion client render the
   FINISHED batch (beat 3) statically, with no timers and no
   AnimatePresence branch that could mismatch hydration. Only after
   mount (rAF) AND when motion is allowed do we start the timed loop at
   beat 0, crossfading in from the static batch.

   The reference is the most important image → priority. Borders over
   shadows; cream / ink / one blue only (the four literal hexes in the
   audit palette are the Zoom brand swatches, intentionally allowed).
   ================================================================= */

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];
const STAGGER = 0.07; // ~70ms between children in a beat

// Beat windows (ms). Auto-advance, then loop. 0–2.4 · 2.4–4.8 · 4.8–6.6 · 6.6–9.2
const DURATIONS = [2400, 2400, 1800, 2600];

const [REFERENCE, ...VARIATIONS] = HERO_BRAND.ads;

const STEP_LABELS = ['01 · audit', '02 · angles', '03 · seed', '04 · generate'] as const;
const VERBS = ['auditing', 'angling', 'seeding', 'generating'] as const;

const ANGLES = [
  { stage: 'unaware', hook: 'Meetings are quietly killing focus.' },
  { stage: 'problem', hook: 'Too many tools, too many tabs.' },
  { stage: 'solution', hook: 'One app for meetings, chat & docs.' },
  { stage: 'product', hook: 'Built-in AI. No extra cost.' },
  { stage: 'most-aware', hook: 'Trusted by millions. 4.5/5 stars.' },
] as const;

// Shared beat enter/exit — crossfade + lift with a touch of blur.
const beatVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
};

// Per-child stagger inside a beat.
function child(i: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE, delay: 0.12 + i * STAGGER },
  };
}

export function BatchCascade() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [beat, setBeat] = useState(3); // static fallback shows the finished batch

  // Mount flag (deterministic SSR first paint).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const playing = mounted && !reduce;

  // The timed loop. Only runs while playing; cleaned up on unmount / dep change.
  useEffect(() => {
    if (!playing) return;
    setBeat(0); // crossfade from the static batch into beat 0
    let timer: ReturnType<typeof setTimeout>;
    let current = 0;
    const schedule = () => {
      timer = setTimeout(() => {
        current = (current + 1) % 4;
        setBeat(current);
        schedule();
      }, DURATIONS[current]);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [playing]);

  return (
    <figure className={styles.root}>
      <div className={styles.window}>
        {/* slim status bar — step label + 4-segment progress */}
        <div className={styles.bar} aria-hidden="true">
          <span className={styles.barDot} />
          <span className={styles.barLabel}>{STEP_LABELS[beat]}</span>
          <span className={styles.progress}>
            {STEP_LABELS.map((_, i) => (
              <span
                key={i}
                className={`${styles.seg} ${i === beat ? styles.segOn : ''} ${
                  i < beat ? styles.segDone : ''
                }`}
              />
            ))}
          </span>
        </div>

        {/* stage — beats crossfade in here (keeps real ad alts exposed) */}
        <div className={styles.stage}>
          {playing ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={beat}
                className={styles.beat}
                variants={beatVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE }}
              >
                <BeatBody beat={beat} animated />
              </motion.div>
            </AnimatePresence>
          ) : (
            // Deterministic static first paint / reduced-motion: finished batch.
            <div className={styles.beat}>
              <BeatBody beat={3} animated={false} />
            </div>
          )}
        </div>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.live} aria-hidden="true" />
        {playing ? (
          <span aria-hidden="true">{VERBS[beat]} → on-brand batch</span>
        ) : (
          'one reference → unlimited on-brand variations'
        )}
      </figcaption>
    </figure>
  );
}

/* ---------- beat bodies ---------- */

function BeatBody({ beat, animated }: { beat: number; animated: boolean }) {
  switch (beat) {
    case 0:
      return <BeatAudit animated={animated} />;
    case 1:
      return <BeatAngles animated={animated} />;
    case 2:
      return <BeatSeed animated={animated} />;
    default:
      return <BeatBatch animated={animated} />;
  }
}

// Wrap a child in a motion.div only when animating; otherwise render plain
// (keeps the static fallback free of motion-driven state).
function Stagger({
  i,
  animated,
  className,
  children,
}: {
  i: number;
  animated: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!animated) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} {...child(i)}>
      {children}
    </motion.div>
  );
}

/* Beat 0 — AUDIT */
function BeatAudit({ animated }: { animated: boolean }) {
  return (
    <div className={styles.audit}>
      <Stagger i={0} animated={animated} className={styles.browserRow}>
        <span className={styles.browserDot} />
        <span className={styles.url}>zoom.com</span>
        <span className={styles.analyzed}>analyzed in 12s</span>
      </Stagger>

      <div className={styles.kvGrid}>
        <Stagger i={1} animated={animated} className={styles.kvRow}>
          <span className={styles.k}>positioning</span>
          <span className={styles.v}>one app for meetings, chat &amp; docs</span>
        </Stagger>
        <Stagger i={2} animated={animated} className={styles.kvRow}>
          <span className={styles.k}>category</span>
          <span className={styles.v}>workplace communication</span>
        </Stagger>
        <Stagger i={3} animated={animated} className={styles.kvRow}>
          <span className={styles.k}>icp</span>
          <span className={styles.v}>distributed teams</span>
        </Stagger>
        <Stagger i={4} animated={animated} className={styles.kvRow}>
          <span className={styles.k}>palette</span>
          <span className={styles.swatches}>
            {/* Zoom brand swatches — the only literal hexes allowed. */}
            <span className={styles.swatch} style={{ background: '#0B5CFF' }} />
            <span className={styles.swatch} style={{ background: '#2D8CFF' }} />
            <span className={styles.swatch} style={{ background: '#1A1A2E' }} />
            <span className={styles.swatch} style={{ background: '#FFFFFF' }} />
          </span>
        </Stagger>
      </div>
    </div>
  );
}

/* Beat 1 — ANGLES */
function BeatAngles({ animated }: { animated: boolean }) {
  return (
    <div className={styles.angles}>
      <div className={styles.angleHead}>five angles to test · one per awareness stage</div>
      <div className={styles.angleList}>
        {ANGLES.map((a, i) => (
          <Stagger key={a.stage} i={i} animated={animated} className={styles.angleRow}>
            <span className={styles.angleStage}>{a.stage}</span>
            <span className={styles.angleHook}>{a.hook}</span>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

/* Beat 2 — SEED (the reference) */
function BeatSeed({ animated }: { animated: boolean }) {
  return (
    <div className={styles.seed}>
      <Stagger i={0} animated={animated} className={styles.seedTagRow}>
        <span className={styles.tag}>reference</span>
      </Stagger>
      <Stagger i={1} animated={animated} className={styles.seedFrame}>
        <Image
          src={REFERENCE.src}
          alt={REFERENCE.alt}
          fill
          priority
          sizes="240px"
          className={styles.img}
        />
      </Stagger>
      <Stagger i={2} animated={animated} className={styles.seedCap}>
        your best ad becomes the seed
      </Stagger>
    </div>
  );
}

/* Beat 3 — GENERATE (the batch) */
function BeatBatch({ animated }: { animated: boolean }) {
  return (
    <div className={styles.batch}>
      <div className={styles.batchHead}>
        <span className={styles.batchDot} />
        on-brand batch · no cap
      </div>
      <div className={styles.batchGrid}>
        {VARIATIONS.map((ad, i) =>
          animated ? (
            <motion.div
              key={ad.src}
              className={styles.cell}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.46, ease: EASE, delay: 0.1 + i * 0.12 }}
            >
              <CellImage ad={ad} />
            </motion.div>
          ) : (
            <div key={ad.src} className={styles.cell}>
              <CellImage ad={ad} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function CellImage({ ad }: { ad: { src: string; alt: string } }) {
  return (
    <div className={styles.cellFrame}>
      <Image src={ad.src} alt={ad.alt} fill sizes="140px" className={styles.img} />
    </div>
  );
}
