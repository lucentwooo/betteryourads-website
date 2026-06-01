'use client';

import { useEffect } from 'react';

/* =================================================================
   SmoothScroll — global momentum scrolling via Lenis.

   Mounted once in the root layout. Renders NO DOM (returns null), so it
   adds zero hydration surface — the project's hard SSR-safety rule.

   Lenis is dynamically imported (client-only, kept out of the layout's
   first-load JS) and self-drives its own rAF loop via `autoRaf`. Framer
   Motion's `useScroll` and the CSS scroll-timeline animations both read
   native scroll position, which Lenis smooths in place — so every
   existing scroll effect is smoothed for free, no wiring needed.

   a11y: under prefers-reduced-motion we never initialise Lenis, leaving
   the browser's native (un-smoothed) scroll intact.
   ================================================================= */
export function SmoothScroll() {
  useEffect(() => {
    // a11y: respect reduced-motion — native scroll, no smoothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let lenis: { destroy: () => void } | undefined;

    // The `cancelled` guard prevents a leaked instance if the effect is
    // torn down (e.g. React StrictMode's dev double-mount) before the
    // dynamic import resolves.
    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, duration: 1.1, smoothWheel: true });
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
