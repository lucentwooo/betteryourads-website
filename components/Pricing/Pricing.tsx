'use client';

import { useState } from 'react';
import { CAL_URL } from '@/lib/site';
import {
  FREE_PLAN,
  PAID_PLANS,
  STUDIO_PLAN,
  priceFor,
  type BillingPeriod,
} from '@/lib/billing-catalog';
import styles from './Pricing.module.css';

type Period = BillingPeriod;

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

  return (
    <>
      <header className={styles.hero}>
        <h1 className={styles.h1}>One free brief. Then rates that scale with your roster.</h1>
        <p className={styles.sub}>
          Every plan starts the same way: 20 minutes with the founders, a real client&rsquo;s URL, and your first
          client brief free, no card. We set you up on the call.
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
        <div className={styles.plan}>
          <h2 className={styles.planName}>{FREE_PLAN.name}</h2>
          <p className={styles.planTag}>see it work on a real client</p>
          <p className={styles.price}>
            $0<span className={styles.priceUnit}> free</span>
          </p>
          <a href={CAL_URL} className={styles.btnGhost}>
            try it on a call <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.features}>
            <Check>{FREE_PLAN.brands} client brand</Check>
            <Check>{FREE_PLAN.researchRuns} full research run</Check>
            <Check>{FREE_PLAN.lifetimeRenders} rendered ads - lifetime, never expire</Check>
            <Check>ranked concepts + exportable client-ready brief</Check>
            <Check>competitor-ad ingestion</Check>
            <Check>no card required</Check>
          </div>
        </div>

        {PAID_PLANS.map((plan) => {
          const isAgency = plan.id === 'agency';
          const shown = priceFor(plan, period);
          return (
            <div key={plan.id} className={`${styles.plan} ${isAgency ? styles.planPro : ''}`}>
              {isAgency && (
                <div className={styles.proHead}>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  {/* plain text label — no pill/badge background, by explicit decision */}
                  <span className={styles.mostPopular}>most popular</span>
                </div>
              )}
              {!isAgency && <h2 className={styles.planName}>{plan.name}</h2>}
              <p className={styles.planTag}>{isAgency ? 'scale across every client' : 'for your first clients'}</p>
              <p className={styles.price}>
                ${shown}
                <span className={styles.priceUnit}>/month</span>
              </p>
              <p className={styles.planTag}>
                {plan.brands} brands - {plan.rendersPerMonth.toLocaleString()} renders/mo
              </p>
              <a href={CAL_URL} className={`${isAgency ? `${styles.btnBlue} ${styles.btnPro}` : styles.btnInk}`}>
                get started on a call <span aria-hidden="true">↗</span>
              </a>
              <div className={styles.features}>
                <Check>{plan.brands} client brands</Check>
                <Check>{plan.rendersPerMonth.toLocaleString()} rendered ads every month</Check>
                <Check>extra brand +${plan.extraBrandMonthly}/mo</Check>
                <Check>performance loop (beta): import metrics, get lessons</Check>
                {isAgency && <Check>everything in Starter</Check>}
              </div>
            </div>
          );
        })}

        <div className={styles.plan}>
          <h2 className={styles.planName}>{STUDIO_PLAN.name}</h2>
          <p className={styles.planTag}>big rosters, one pipeline</p>
          <p className={styles.price}>
            Custom<span className={styles.priceUnit}> quote</span>
          </p>
          <a href={CAL_URL} className={styles.btnGhost}>
            talk to us <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.features}>
            <Check>{STUDIO_PLAN.minBrands}+ client brands</Check>
            <Check>{STUDIO_PLAN.rendersPerMonth.toLocaleString()} renders/mo</Check>
            <Check>everything in Agency</Check>
            <Check>design partner: request features, shape the roadmap</Check>
            <Check>priority support</Check>
          </div>
        </div>
      </section>

      <p className={styles.fineprint}>
        Quarterly billing takes 7.5% off, annual takes 15%. Every button above books the same 20-minute call; we set
        your account up there.
      </p>
    </>
  );
}
