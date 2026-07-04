import { SectionHead } from '@/components/ui/SectionHead';
import { PilotProof } from '@/components/PilotProof/PilotProof';
import { LivingWall } from './LivingWall';
import styles from './RealOutput.module.css';

/* =================================================================
   RealOutput — the reference library.

   Server Component wrapper. The signature beat is the LivingWall
   marquee (a client island) showing REAL ads from top SaaS companies:
   the reference library our model trains on, which clients get access
   to. Beneath it sits the pilot proof — the two anonymous funded SaaS
   pilots, reused verbatim from <PilotProof /> (its own "currently in
   pilot" eyebrow reads as a distinct beat below the wall, not a
   duplicate of this header).

   Honesty guardrail: these are NOT our generated output and must not
   be presented as such — they are real ads run by the named brands,
   collected as training references. Do not soften this.
   ================================================================= */

export function RealOutput() {
  return (
    <section className={`section ${styles.section}`} id="work">
      <div className="wrap">
        <SectionHead
          eyebrow="the reference library"
          eyebrowTag="var(--s3)"
          title={
            <>
              Trained on the ads already winning.
            </>
          }
          sub="These are real ads from the world's top brands: the reference library our model trains on, and you get access to. Every concept we generate is grounded in patterns the best are already running."
        />
      </div>

      {/* Full-bleed signature marquee of reference ads. Lives outside .wrap
          so the edge-fade reaches the viewport edges. */}
      <LivingWall />

      {/* Pilot proof — reused verbatim (two cards + "Both go public when the
          numbers do."). It carries its own section wrapper + heading. */}
      <PilotProof />

      {/* Founder quote slot — render ONLY when a real, attributed quote
          exists. We do not invent testimonials.
          <FounderQuote quote="…" name="…" role="…" /> */}
    </section>
  );
}
