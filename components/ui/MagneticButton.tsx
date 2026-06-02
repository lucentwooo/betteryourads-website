'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './MagneticButton.module.css';

type ExtraProps = Record<`data-${string}`, string | undefined>;

type MagneticButtonProps = ExtraProps & {
  href?: string;
  children: ReactNode;
  primary?: boolean;
  sm?: boolean;
  className?: string;
  onClick?: () => void;
};

export function MagneticButton({
  href, children, primary = false, sm = false, className, ...rest
}: MagneticButtonProps) {
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

  // When used as a Cal.com trigger (no href), the click is bound via data-cal-*.
  // Make it keyboard-reachable and operable: focusable, button semantics, and
  // Enter/Space dispatch the click that Cal listens for.
  const triggerOnly = !href;
  function onKeyDown(e: React.KeyboardEvent<HTMLAnchorElement>) {
    if (triggerOnly && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  return (
    <motion.a ref={ref} href={href} className={classes}
      role={triggerOnly ? 'button' : undefined}
      tabIndex={triggerOnly ? 0 : undefined}
      onKeyDown={triggerOnly ? onKeyDown : undefined}
      style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}
      {...rest}>
      {children}
    </motion.a>
  );
}
