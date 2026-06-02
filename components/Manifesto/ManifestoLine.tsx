'use client';

/**
 * ManifestoLine — the value-prop sentence from Manifesto, without the
 * tall sticky-section chrome.  Renders inline wherever you need it.
 *
 * SSR-safe: every word renders at full opacity on first paint.
 * Scroll-driven reveal is applied only after mount and only when
 * prefers-reduced-motion is not set — identical discipline to Manifesto.tsx.
 */

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import styles from './ManifestoLine.module.css';

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
  { text: 'Win' },
  { text: 'the' },
  { text: 'customers' },
  { text: 'who' },
  { text: 'pay.' },
];

/* Reveal sub-range for a non-sticky inline element.
   Progress is measured against the element itself via offset ['start end','end start'].
   Words light up as the element travels up through the viewport. */
const REVEAL_FROM = 0.1;
const REVEAL_TO   = 0.6;

export function ManifestoLine() {
  const reduce   = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref      = useRef<HTMLParagraphElement>(null);

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
    <p ref={ref} className={styles.text}>
      {WORDS.map((w, i) => (
        <Word
          key={i}
          word={w.text}
          accent={w.accent}
          range={[
            REVEAL_FROM + (i / WORDS.length) * (REVEAL_TO - REVEAL_FROM),
            REVEAL_FROM + ((i + 1) / WORDS.length) * (REVEAL_TO - REVEAL_FROM),
          ]}
          progress={scrollYProgress}
          animate={animate}
        />
      ))}
    </p>
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
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span
      className={accent ? `${styles.word} ${styles.accent}` : styles.word}
      style={animate ? { opacity } : undefined}
    >
      {word}
    </motion.span>
  );
}
