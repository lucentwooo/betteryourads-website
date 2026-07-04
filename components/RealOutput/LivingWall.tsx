'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { allWallAds, type Creative } from '@/lib/creatives';
import styles from './LivingWall.module.css';

/* =================================================================
   LivingWall — the signature island of the RealOutput section.

   Two horizontal marquee rows scrolling in OPPOSITE directions, slow
   and seamless. Each row is a doubled track (the sequence rendered
   twice) translated -50% via a pure-CSS linear-infinite animation, so
   the loop is gapless without JS measurement. Cream edge-fade mask
   melts the cards in/out at both ends.

   Interaction: pointer-drag to scrub. While actively dragging, the
   auto-scroll pauses and the row follows the pointer (additive offset);
   on release it resumes from wherever the drag left it. The marquee
   NEVER pauses on hover — it's always moving.

   SSR + reduced-motion safety (Manifesto discipline): the first paint
   and the reduced-motion path render a static, horizontally-scrollable
   strip (overflow-x:auto, NO animation, single un-doubled sequence).
   The animated marquee only renders after mount and only when motion is
   allowed — so the server HTML is deterministic and there is no
   hydration branch driven by useReducedMotion in the first render.
   ================================================================= */

/** Deterministic split of the catalogue into two rows. Row B is reversed
    so the two opposite-direction tracks don't show the same cards in sync. */
function splitRows(ads: Creative[]): [Creative[], Creative[]] {
  const a: Creative[] = [];
  const b: Creative[] = [];
  ads.forEach((ad, i) => (i % 2 === 0 ? a : b).push(ad));
  return [a, b.reverse()];
}

const ALL = allWallAds();
const [ROW_A, ROW_B] = splitRows(ALL);

export function LivingWall() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = mounted && !reduce;

  // Static, deterministic first paint + reduced-motion: a plain scroll strip.
  if (!animate) {
    return (
      <div className={styles.wall} aria-label="Reference ads from top brands in the Loopy library">
        <StaticStrip ads={ROW_A} />
        <StaticStrip ads={ROW_B} />
      </div>
    );
  }

  return (
    <div className={styles.wall} aria-label="Reference ads from top brands in the Loopy library">
      <MarqueeRow ads={ROW_A} direction="left" duration={56} />
      <MarqueeRow ads={ROW_B} direction="right" duration={64} />
    </div>
  );
}

/* ----- Static fallback row (server + reduced motion) --------------- */
function StaticStrip({ ads }: { ads: Creative[] }) {
  return (
    <div className={styles.staticStrip}>
      {ads.map((ad, i) => (
        <Card ad={ad} key={`${ad.src}-${i}`} />
      ))}
    </div>
  );
}

/* ----- Animated marquee row (client, motion allowed) --------------- */
function MarqueeRow({
  ads,
  direction,
  duration,
}: {
  ads: Creative[];
  direction: 'left' | 'right';
  duration: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Drag-to-scrub state. We keep an additive translateX (px) applied on top
  // of the CSS animation by pausing the animation and writing transform
  // directly during the drag, then clearing it (resuming the keyframes) on
  // release. Robust: pointer capture + cleanup on unmount.
  const drag = useRef<{ active: boolean; startX: number; offset: number }>({
    active: false,
    startX: 0,
    offset: 0,
  });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.offset = 0;
    el.setPointerCapture(e.pointerId);
    el.style.animationPlayState = 'paused';
    el.classList.add(styles.dragging!);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current.offset = e.clientX - drag.current.startX;
    el.style.transform = `translate3d(${drag.current.offset}px,0,0)`;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer may already be released */
    }
    // Resume the keyframe animation from a clean slate.
    el.style.transform = '';
    el.style.animationPlayState = '';
    el.classList.remove(styles.dragging!);
  }

  const trackClass = [
    styles.track,
    direction === 'left' ? styles.left : styles.right,
  ].join(' ');

  return (
    <div className={styles.row}>
      <div
        ref={trackRef}
        className={trackClass}
        style={{ animationDuration: `${duration}s` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Sequence rendered TWICE for a seamless -50% loop. The duplicate
            is aria-hidden so screen readers don't see every card twice. */}
        {ads.map((ad, i) => (
          <Card ad={ad} key={`a-${ad.src}-${i}`} />
        ))}
        {ads.map((ad, i) => (
          <Card ad={ad} key={`b-${ad.src}-${i}`} ariaHidden />
        ))}
      </div>
    </div>
  );
}

/* ----- One creative card ------------------------------------------- */
function Card({ ad, ariaHidden }: { ad: Creative; ariaHidden?: boolean }) {
  return (
    <figure className={styles.card} aria-hidden={ariaHidden || undefined}>
      <Image
        src={ad.src}
        alt={ariaHidden ? '' : ad.alt}
        fill
        sizes="200px"
        className={styles.img}
        draggable={false}
      />
    </figure>
  );
}
