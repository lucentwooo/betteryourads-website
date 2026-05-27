import { LiveDemo } from '@/components/LiveDemo/LiveDemo';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} />
              <span>meta ads · for b2b saas</span>
            </div>
            <h1>
              Meta ads, <span className="accent">run for you</span>.
            </h1>
            <p className="lead">
              We learn your product, write the angles, and run the creative.
              Built for trial signups, not add-to-carts.
            </p>
            <WaitlistForm id="waitlist" />
            <div className={styles.micro}>
              <span>first month free</span>
              <span className={styles.sep}>·</span>
              <span>30 ads on us</span>
              <span className={styles.sep}>·</span>
              <span>no card required</span>
            </div>
          </div>
          <div className={styles.right}>
            <LiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
