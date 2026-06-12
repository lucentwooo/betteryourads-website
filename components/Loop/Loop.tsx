import { SectionHead } from '@/components/ui/SectionHead';
import { LoopScrub } from './LoopScrub';
import { WaitlistForm } from './WaitlistForm';
import styles from './Loop.module.css';

/* =================================================================
   Loop — the self-optimization loop, the part nobody else has.

   Creative generation is becoming a commodity; the moat is the loop:
   creative matched with its own performance data, explained, written
   to the account's memory, compounding batch over batch. The section
   sells that story through the pinned LoopScrub film, then converts
   with a waitlist (the loop ships to pilot founders first).

   Server Component wrapper; LoopScrub and WaitlistForm are islands.
   ================================================================= */

export function Loop() {
  return (
    <section className="section" id="loop">
      <div className="wrap">
        <SectionHead
          eyebrow="the optimization loop · in the works"
          eyebrowTag="var(--s5)"
          title={
            <>
              Every ad teaches
              <br />
              the next one.
            </>
          }
          sub="Generating creative is becoming a commodity. The edge is what you learn from running it. We pair every creative with its own performance data, work out why it won or lost, and write that into your account’s memory. The next batch starts where the last one finished."
        />

        <LoopScrub />

        {/* Waitlist — the loop ships to pilot founders first. */}
        <div className={`${styles.waitlist} reveal`} id="waitlist">
          <h3 className={styles.wlTitle}>
            Pilot founders get the loop <span className="accent">first</span>.
          </h3>
          <p className={styles.wlSub}>
            We’re building it into every account now. Leave your email and
            you’re in line the day it opens.
          </p>
          <WaitlistForm />
          <p className={styles.wlMicro}>
            or{' '}
            <a className="signal" href="#book">
              book a pilot call
            </a>{' '}
            and skip the line
          </p>
        </div>
      </div>
    </section>
  );
}
