'use client';

import { useState } from 'react';
import { CAL_URL } from '@/lib/site';
import styles from './Pricing.module.css';

type Period = 'monthly' | 'quarterly' | 'annual';

const DISCOUNT: Record<Period, number> = { monthly: 1, quarterly: 0.925, annual: 0.85 };
const PRO_BASE = [249, 429, 749] as const;
const PRO_ADS = [100, 200, 400] as const;

const PERIODS: { key: Period; label: string; discount?: string }[] = [
  { key: 'monthly', label: 'monthly' },
  { key: 'quarterly', label: '3 months', discount: '−7.5%' },
  { key: 'annual', label: 'annual', discount: '−15%' },
];

const Check = ({ children }: { children: React.ReactNode }) => (
  <span>
    <b className={styles.check}>✓</b>&nbsp; {children}
  </span>
);

export function Pricing() {
  const [period, setPeriod] = useState<Period>('monthly');
  const [proTier, setProTier] = useState(0);

  const disc = DISCOUNT[period];
  const earlyPrice = Math.round(149 * disc);
  const proPrice = Math.round(PRO_BASE[proTier] * disc);

  return (
    <>
      <header className={styles.hero}>
        <h1 className={styles.h1}>Founding rates, locked in for as long as you stay.</h1>
        <p className={styles.sub}>
          Every plan starts the same way: 20 minutes with the founders, your first 5 ads free, no card. We set you up
          on the call.
        </p>
        <div role="group" aria-label="Billing period" className={styles.toggle}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`${styles.segment}${period === p.key ? ` ${styles.segmentActive}` : ''}`}
            >
              {p.label}
              {p.discount && <span className={styles.discount}> {p.discount}</span>}
            </button>
          ))}
        </div>
      </header>

      <section className={styles.plans}>
        {/* Free */}
        <div className={styles.plan}>
          <h2 className={styles.planName}>Free</h2>
          <p className={styles.planTag}>see it work on your real brand</p>
          <p className={styles.price}>
            5 ads<span className={styles.priceUnit}> free</span>
          </p>
          <p className={styles.planTag}>no card required</p>
          <a href={CAL_URL} className={styles.btnGhost}>
            try it on a call <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.features}>
            <Check>5 ads on your real brand</Check>
            <Check>2 UGC video ads to try</Check>
            <Check>the full measure → analyze → render pipeline</Check>
            <Check>unlimited brands</Check>
            <Check>no card required</Check>
          </div>
        </div>

        {/* Early Access */}
        <div className={styles.plan}>
          <h2 className={styles.planName}>Early Access</h2>
          <p className={styles.planTag}>for your first accounts</p>
          <p className={styles.price}>
            ${earlyPrice}
            <span className={styles.priceUnit}>/month</span>
          </p>
          <p className={styles.planTag}>50 ads a month - unlimited brands</p>
          <a href={CAL_URL} className={styles.btnInk}>
            get started on a call <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.features}>
            <Check>50 ads every month</Check>
            <Check>10 UGC video ads every month</Check>
            <Check>unlimited brands, one shared pool</Check>
            <Check>competitor-ad ingestion</Check>
            <Check>performance loop: import metrics, get lessons</Check>
            <Check>founding rate, locked in for as long as you stay</Check>
          </div>
        </div>

        {/* Pro */}
        <div className={`${styles.plan} ${styles.planPro}`}>
          <div className={styles.proHead}>
            <h2 className={styles.planName}>Pro</h2>
            {/* plain text label — no pill/badge background, by explicit decision */}
            <span className={styles.mostPopular}>most popular</span>
          </div>
          <p className={styles.planTag}>scale across every client</p>
          <p className={styles.price}>
            ${proPrice}
            <span className={styles.priceUnit}>/month</span>
          </p>
          <p className={styles.planTag}>{PRO_ADS[proTier]} ads a month - unlimited brands - one shared pool</p>
          <div className={styles.slider}>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={proTier}
              onChange={(e) => setProTier(Number(e.target.value))}
              aria-label="Ads per month"
            />
            <div className={styles.ticks}>
              <span>100</span>
              <span>200</span>
              <span>400</span>
            </div>
          </div>
          <a href={CAL_URL} className={`${styles.btnBlue} ${styles.btnPro}`}>
            go Pro on a call <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.features}>
            <Check>everything in Early Access</Check>
            <Check>up to 400 ads every month</Check>
            <Check>one shared pool across every client</Check>
            <Check>design partner: request features, shape the roadmap</Check>
            <Check>priority support</Check>
            <Check>founding rate, locked in for as long as you stay</Check>
          </div>
        </div>
      </section>

      <p className={styles.fineprint}>
        Founding prices stay locked in for as long as you stay. Every button above books the same 20-minute call; we
        set your account up there.
      </p>
    </>
  );
}
