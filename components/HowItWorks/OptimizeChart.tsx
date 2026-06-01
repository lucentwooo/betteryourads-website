'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './OptimizeChart.module.css';

/* The five angles and their (fixed) cost-per-signup. The cheaper an angle
   converts, the more spend flows to it over the simulated week. */
const ANGLES = [
  { name: 'ship without the standup', cps: '$18' },
  { name: 'speed is the feature', cps: '$24' },
  { name: 'for engineers, by eng.', cps: '$33' },
  { name: 'the issue tracker', cps: '$71' },
  { name: 'your roadmap, not theirs', cps: '$162' },
] as const;

const WINNERS = 2; // the top two angles get the accent fill

/* One simulated week of optimisation. spend% per angle (each day sums to 100)
   flows toward the cheapest-converting angles; cumulative signups climb and
   the blended cost/signup drops. Illustrative — not the visitor's numbers. */
const DAYS = [
  { spend: [26, 23, 20, 17, 14], signups: 16, cps: 56 },
  { spend: [30, 25, 19, 15, 11], signups: 38, cps: 45 },
  { spend: [34, 27, 17, 13, 9], signups: 62, cps: 38 },
  { spend: [38, 28, 16, 11, 7], signups: 85, cps: 32 },
  { spend: [41, 28, 15, 10, 6], signups: 104, cps: 28 },
  { spend: [44, 29, 13, 9, 5], signups: 119, cps: 25 },
  { spend: [46, 29, 13, 8, 4], signups: 131, cps: 22 },
] as const;

const LAST = DAYS.length - 1;
const STEP_MS = 950;
const HOLD_MS = 2000;

export function OptimizeChart() {
  // Deterministic initial state (day 0) — identical on server and first client
  // render. Reduced-motion + the loop are applied post-mount only.
  const [day, setDay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Show the settled end-of-week state, no loop. Deferred out of the
      // effect body for react-hooks/set-state-in-effect.
      const id = requestAnimationFrame(() => setDay(LAST));
      return () => cancelAnimationFrame(id);
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cur = 0;
    const schedule = () => {
      const atEnd = cur === LAST;
      timer = setTimeout(
        () => {
          cur = atEnd ? 0 : cur + 1;
          setDay(cur); // in a timer callback, not the sync effect body
          schedule();
        },
        atEnd ? HOLD_MS : STEP_MS,
      );
    };

    // Start the loop the first time the chart scrolls into view (perf).
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          schedule();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const d = DAYS[day];

  return (
    <div className={styles.optimize} ref={ref}>
      <div className={styles.head}>
        <span>spend · optimizing for signups</span>
        <span>cost / signup</span>
      </div>
      <div className={styles.rows}>
        {ANGLES.map((a, i) => {
          const winner = i < WINNERS;
          return (
            <div className={styles.row} key={a.name}>
              <span className={styles.name}>{a.name}</span>
              <div className={styles.bar}>
                <div
                  className={`${styles.fill} ${winner ? styles.win : ''}`}
                  style={{ width: `${d.spend[i]}%` }}
                />
                <span className={styles.pct}>{d.spend[i]}%</span>
              </div>
              <span className={`${styles.cps} ${winner ? styles.cpsWin : ''}`}>
                {a.cps}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.foot}>
        <span>day {day + 1} / 7 · auto-reallocating</span>
        <span className={styles.totals}>
          {d.signups} signups · ${d.cps}/signup
        </span>
      </div>
    </div>
  );
}
