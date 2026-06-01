'use client';

import { useEffect, useRef, useState } from 'react';

export function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}

export function Counter({
  value, durationMs = 1400, format = (n) => Math.round(n).toLocaleString(), className,
}: {
  value: number; durationMs?: number; format?: (n: number) => string; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Defer out of the synchronous effect body (react-hooks/set-state-in-effect).
      const jump = requestAnimationFrame(() => setDisplay(format(value)));
      return () => cancelAnimationFrame(jump);
    }

    let raf = 0; let start = 0; let ran = false;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = easeOutCubic((now - start) / durationMs);
      setDisplay(format(value * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !ran) { ran = true; raf = requestAnimationFrame(tick); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, durationMs, format]);

  return <span ref={ref} className={className}>{display}</span>;
}
