import { SectionHead } from '@/components/ui/SectionHead';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './Pricing.module.css';

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <SectionHead
          eyebrow="pricing"
          title="Two plans. No retainer."
          sub="Pay for ads that ship, not for meetings. Month to month. Cancel any time."
        />

        <div className={styles.offer}>
          <div className={styles.offerText}>
            <Eyebrow accent as="span">
              waitlist offer
            </Eyebrow>
            <span>
              Join now, get your <strong>first month free</strong> and{' '}
              <strong>30 ads on us</strong>.
            </span>
          </div>
          <MagneticButton href="#waitlist" primary sm>
            claim my spot →
          </MagneticButton>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.card} reveal`}>
            <div className={styles.tierName}>founder</div>
            <div className={styles.amount}>
              <span>$499</span>
              <span className={styles.per}>/ month</span>
            </div>
            <p className={styles.pitch}>
              For founders running their first paid social, or replacing a freelancer.
            </p>
            <ul>
              <li>30 ads / month, shipped live</li>
              <li>1 brand, unlimited angles</li>
              <li>Daily spend reallocation toward signups</li>
              <li>Slack support, founder-to-founder</li>
            </ul>
            <div className={styles.footnote}>private beta, 2026</div>
            <Button href="#waitlist" className={styles.cardCta}>
              join the waitlist
            </Button>
          </div>

          <SpotlightCard className={`${styles.card} ${styles.featured} ${styles.beam} reveal`}>
            <div className={styles.tierRow}>
              <div className={styles.tierName}>scale</div>
              <span className={styles.badge}>most teams</span>
            </div>
            <div className={styles.amount}>
              <span>$1,499</span>
              <span className={styles.per}>/ month</span>
            </div>
            <p className={styles.pitch}>
              For teams shipping ads daily, scaling beyond the founder plan.
            </p>
            <ul>
              <li>120 ads / month, shipped live</li>
              <li>1 brand, unlimited angles</li>
              <li>Daily reallocation + weekly creative refresh</li>
              <li>Dedicated account, shared Slack with our team</li>
            </ul>
            <div className={styles.footnote}>white-glove onboarding included</div>
            <MagneticButton href="#waitlist" primary className={styles.cardCta}>
              join the waitlist
            </MagneticButton>
          </SpotlightCard>
        </div>

        <div className={styles.anchorBar}>
          <span>
            A full-service Meta-ads agency typically runs several thousand a month plus
            creative hours. We charge a flat fee, ship every day, and never schedule a status
            call.
          </span>
          <a className="signal" href="#faq">
            how is this priced? →
          </a>
        </div>
      </div>
    </section>
  );
}
