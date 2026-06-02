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

// Beat windows (ms). Auto-advance, then loop. Slower on the parts that carry
// the most to read/understand: the audit kit and the five angles, then a long
// beat to take in the generated batch. ~14.4s loop.
const DURATIONS = [3600, 4400, 2800, 3600];

const [REFERENCE, ...VARIATIONS] = HERO_BRAND.ads;

const STEP_LABELS = ['01 · audit', '02 · angles', '03 · seed', '04 · generate'] as const;
const VERBS = ['auditing', 'angling', 'seeding', 'generating'] as const;

// A long stream of concepts — one per awareness stage, looping — to convey
// VOLUME (dozens, not five). Order intentional; rendered twice for a gapless
// vertical marquee.
const ANGLES = [
  { stage: 'unaware', hook: 'Meetings are quietly killing focus.' },
  { stage: 'unaware', hook: 'You lose 4 hours a week to tool-switching.' },
  { stage: 'unaware', hook: 'Busywork is eating your best engineers.' },
  { stage: 'unaware', hook: '“Quick sync?” is never quick.' },
  { stage: 'problem', hook: 'Too many tools, too many tabs.' },
  { stage: 'problem', hook: 'Chat here, calls there, docs somewhere else.' },
  { stage: 'problem', hook: 'Nobody can find the recording.' },
  { stage: 'problem', hook: 'Context dies between apps.' },
  { stage: 'solution', hook: 'One app for meetings, chat & docs.' },
  { stage: 'solution', hook: 'Stop switching. Start shipping.' },
  { stage: 'solution', hook: 'Everything in one place, finally.' },
  { stage: 'solution', hook: 'Your whole workflow, one window.' },
  { stage: 'product', hook: 'Built-in AI. No extra cost.' },
  { stage: 'product', hook: 'AI notes & action items — automatic.' },
  { stage: 'product', hook: 'Whiteboard, docs, clips — included.' },
  { stage: 'product', hook: 'Set up in minutes, not weeks.' },
  { stage: 'most-aware', hook: 'Trusted by millions. 4.5/5 stars.' },
  { stage: 'most-aware', hook: 'Emmy-winning engineering.' },
  { stage: 'most-aware', hook: 'Dream workflow achieved.' },
  { stage: 'most-aware', hook: 'Join 300k+ teams.' },
  { stage: 'unaware', hook: 'Your calendar is quietly out of control.' },
  { stage: 'problem', hook: 'Switching tools 1,200× a day.' },
  { stage: 'solution', hook: 'Async + live, one platform.' },
  { stage: 'product', hook: 'Onboarding that takes a coffee.' },
  { stage: 'most-aware', hook: 'Designed for how you actually work.' },
  { stage: 'solution', hook: 'Less admin. More building.' },
  { stage: 'product', hook: 'Ship the all-hands recap automatically.' },
  { stage: 'most-aware', hook: 'The workplace that works for you.' },
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

/* Beat 0 — AUDIT (an AI scanning the site, brand kit populating) */
function BeatAudit({ animated }: { animated: boolean }) {
  return (
    <div className={styles.audit}>
      {/* LEFT — a mini browser scrolling through the real site + scan beam */}
      <Stagger i={0} animated={animated} className={styles.scanCol}>
        <div className={styles.miniBrowser}>
          <div className={styles.miniBar}>
            <span className={styles.miniDots} aria-hidden="true">
              <span className={styles.miniDot} />
              <span className={styles.miniDot} />
              <span className={styles.miniDot} />
            </span>
            <span className={styles.miniUrl}>zoom.com</span>
          </div>
          <div className={styles.siteViewport}>
            <div className={`${styles.siteScroll} ${animated ? '' : styles.siteStatic}`}>
              <Image
                src="/creatives/zoom/site.png"
                alt=""
                width={259}
                height={2000}
                className={styles.siteImg}
                aria-hidden="true"
              />
            </div>
            {/* scan beam sweeps top→bottom; gated to motion via CSS */}
            <span className={styles.scanBeam} aria-hidden="true" />
          </div>
        </div>
      </Stagger>

      {/* RIGHT — the extracted brand kit, detected token by token */}
      <div className={styles.kit}>
        <Stagger i={1} animated={animated} className={styles.kitLabel}>
          extracting brand kit…
        </Stagger>
        <div className={styles.kvGrid}>
          <Stagger i={2} animated={animated} className={styles.kvRow}>
            <span className={styles.k}>positioning</span>
            <span className={styles.v}>one app for meetings, chat &amp; docs</span>
          </Stagger>
          <Stagger i={3} animated={animated} className={styles.kvRow}>
            <span className={styles.k}>category</span>
            <span className={styles.v}>workplace communication</span>
          </Stagger>
          <Stagger i={4} animated={animated} className={styles.kvRow}>
            <span className={styles.k}>icp</span>
            <span className={styles.v}>distributed teams</span>
          </Stagger>
          <Stagger i={5} animated={animated} className={styles.kvRow}>
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
    </div>
  );
}

/* Beat 1 — ANGLES (a fast, continuous stream of dozens of concepts) */
function BeatAngles({ animated }: { animated: boolean }) {
  return (
    <div className={styles.angles}>
      <div className={styles.angleHead}>
        <span className={styles.angleDot} aria-hidden="true" />
        <span>concepts · every awareness stage</span>
        <span className={styles.angleCount}>48 generated</span>
      </div>
      {/* masked viewport — rows scroll upward on a seamless -50% loop */}
      <div className={styles.angleViewport}>
        <div className={`${styles.angleTrack} ${animated ? '' : styles.angleStatic}`}>
          {ANGLES.map((a, i) => (
            <div key={`a-${i}`} className={styles.angleRow}>
              <span className={styles.angleStage}>{a.stage}</span>
              <span className={styles.angleHook}>{a.hook}</span>
            </div>
          ))}
          {/* duplicate sequence for the gapless loop — hidden from a11y */}
          {ANGLES.map((a, i) => (
            <div key={`b-${i}`} className={styles.angleRow} aria-hidden="true">
              <span className={styles.angleStage}>{a.stage}</span>
              <span className={styles.angleHook}>{a.hook}</span>
            </div>
          ))}
        </div>
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
