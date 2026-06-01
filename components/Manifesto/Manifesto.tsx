'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './Manifesto.module.css';

/* =================================================================
   Manifesto — the value prop revealed word-by-word on scroll
   (magicui TextRevealByWord mechanic, ported to CSS Modules + tokens).

   A tall section gives scroll room; a sticky inner pins the sentence
   centred in the viewport while each word lights up (opacity 0.2 → 1)
   left-to-right as you scroll. Ink-on-cream; the USP phrase
   ("Batch the creative") is the one accented beat — echoing the hero's
   single blue emphasis.

   SSR-safe: first paint renders every word full-opacity (deterministic,
   no useReducedMotion branch in markup). Scroll-driven opacity is only
   applied after mount and never under prefers-reduced-motion — so
   reduced-motion users get the full sentence, statically legible.
   ================================================================= */

/** The value prop, tokenised into words. `accent` marks the USP beat. */
const WORDS: { text: string; accent?: boolean }[] = [
  { text: 'We' },
  { text: 'learn' },
  { text: 'your' },
  { text: 'product.' },
  { text: 'Write' },
  { text: 'the' },
  { text: 'angles.' },
  { text: 'Batch', accent: true },
  { text: 'the', accent: true },
  { text: 'creative.', accent: true },
  { text: 'Run' },
  { text: 'the' },
  { text: 'ads.' },
  { text: 'Tuned' },
  { text: 'for' },
  { text: 'trial' },
  { text: 'signups' },
  { text: '—' },
  { text: 'not' },
  { text: 'add-to-carts.' },
];

/** The words reveal across this progress sub-range, chosen to sit inside the
    window where the sticky sentence is pinned + centred in the viewport. For a
    200vh section with a 100vh sticky that window is progress ~0.33–0.67 (a
    ratio independent of viewport height), under the offset below.

    We use the proven monotonic offset ['start end','end start'] (same as the
    Showcase). The default ['start start','end end'] produced a NON-monotonic
    progress here that collapsed back to 0 once the section scrolled past — so
    late words never lit (verified in the browser). */
const REVEAL_FROM = 0.36;
const REVEAL_TO = 0.64;

export function Manifesto() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = mounted && !reduce;

  return (
    <section ref={ref} className={`section ${styles.section}`} id="manifesto">
      <div className={styles.sticky}>
        <div className="wrap">
          <Eyebrow>in one breath</Eyebrow>
          <p className={styles.text}>
            {WORDS.map((w, i) => (
              <Word
                key={i}
                word={w.text}
                accent={w.accent}
                range={[
                  REVEAL_FROM + (i / WORDS.length) * (REVEAL_TO - REVEAL_FROM),
                  REVEAL_FROM +
                    ((i + 1) / WORDS.length) * (REVEAL_TO - REVEAL_FROM),
                ]}
                progress={scrollYProgress}
                animate={animate}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  accent,
  range,
  progress,
  animate,
}: {
  word: string;
  accent?: boolean;
  range: [number, number];
  progress: MotionValue<number>;
  animate: boolean;
}) {
  // Always called (hooks rule); only applied when animating.
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span
      className={accent ? `${styles.word} ${styles.accent}` : styles.word}
      style={animate ? { opacity } : undefined}
    >
      {word}
    </motion.span>
  );
}
