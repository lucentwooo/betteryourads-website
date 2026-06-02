import { SectionHead } from '@/components/ui/SectionHead';
import { PilotProof } from '@/components/PilotProof/PilotProof';
import { LivingWall } from './LivingWall';
import styles from './RealOutput.module.css';

/* =================================================================
   RealOutput — "Real output, real founders".

   Server Component wrapper. The signature beat is the LivingWall
   marquee (a client island) showing real ad creatives our engine
   generates in the style of SaaS brands you know. Beneath it sits the
   pilot proof — the two anonymous funded SaaS pilots, reused verbatim
   from <PilotProof /> (its own "currently in pilot" eyebrow reads as a
   distinct beat below the wall, not a duplicate of this header).

   Honesty guardrail: the sub copy makes explicit these are real
   engine-generated creatives in the STYLE of known brands — not stock,
   not templates, not client work. Do not soften this.
   ================================================================= */

export function RealOutput() {
  return (
    <section className={`section ${styles.section}`} id="work">
      <div className="wrap">
        <SectionHead
          eyebrow="real output"
          title={
            <>
              One engine. Every brand&rsquo;s voice.
            </>
          }
          sub="These are real ad creatives our engine generates, in the style of SaaS brands you know — not stock, not templates. Your batch looks like you."
        />
      </div>

      {/* Full-bleed signature marquee. Lives outside .wrap so the edge-fade
          reaches the viewport edges. */}
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
