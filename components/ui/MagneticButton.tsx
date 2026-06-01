'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './MagneticButton.module.css';

export function MagneticButton({
  href, children, primary = false, sm = false, className,
}: { href: string; children: ReactNode; primary?: boolean; sm?: boolean; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const classes = [styles.btn, primary ? styles.primary : '', sm ? styles.sm : '', className ?? '']
    .filter(Boolean).join(' ');

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  }
  function reset() { x.set(0); y.set(0); }

  return (
    <motion.a ref={ref} href={href} className={classes}
      style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.a>
  );
}
