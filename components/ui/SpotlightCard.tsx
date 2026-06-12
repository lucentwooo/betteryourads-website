'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import styles from './SpotlightCard.module.css';

export function SpotlightCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  }
  return (
    <div ref={ref} onPointerMove={onMove} style={style} className={`${styles.card} ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}
