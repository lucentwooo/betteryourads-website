import { SectionHead } from '@/components/ui/SectionHead';
import { OptimizeChart } from './OptimizeChart';
import { AnglePicker } from './AnglePicker';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <SectionHead
          eyebrow="how it works"
          eyebrowAccent
          title="Learns. Launches. Optimizes for signups."
          sub="Three stages. About 90 seconds per ad. Tuned for what shows up in your Stripe dashboard, not your CTR column."
        />
        <div className={styles.steps}>
          <div className={`${styles.step} reveal`}>
            <div className={styles.n}>01 //</div>
            <div className={styles.text}>
              <h3>We read your site.</h3>
              <p>
                Drop your URL. We extract positioning, category, ICP, and palette in about
                twelve seconds. No briefing call. No questionnaire.
              </p>
            </div>
            <div className={styles.visual}>
              <VisualLearn />
            </div>
          </div>

          <div className={`${styles.step} reveal`}>
            <div className={styles.n}>02 //</div>
            <div className={styles.text}>
              <h3>We write five angles.</h3>
              <p>
                Process, category, rebuttal, proof, manifesto. The angles SaaS founders
                actually use. Pick one, pick all five. The creative renders on-brand and ready
                to ship.
              </p>
            </div>
            <div className={styles.visual}>
              <AnglePicker />
            </div>
          </div>

          <div className={`${styles.step} reveal`}>
            <div className={styles.n}>03 //</div>
            <div className={styles.text}>
              <h3>We ship to Meta and tune for signups.</h3>
              <p>
                One click, the ads go live on Facebook and Instagram. We shift spend daily
                toward the angles driving trial signups, the lowest cost per signup, and the
                highest MRR added.
              </p>
            </div>
            <div className={styles.visual}>
              <OptimizeChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualLearn() {
  return (
    <div className={styles.learn}>
      <div className={styles.learnRow}>
        <div className={styles.learnDot} />
        <span className={styles.learnUrl}>https://yoursaas.com</span>
        <span className={styles.learnTime}>analyzed in 12s</span>
      </div>
      <div className={styles.learnGrid}>
        <span className={styles.learnKey}>positioning</span>
        <span>speed is the feature</span>
        <span className={styles.learnKey}>category</span>
        <span>project tracking</span>
        <span className={styles.learnKey}>icp</span>
        <span>technical founders, 10-200 eng</span>
        <span className={styles.learnKey}>palette</span>
        <span className={styles.learnSwatches}>
          <span className={styles.learnSwatch} style={{ background: '#5e6ad2' }} />
          <span className={styles.learnSwatch} style={{ background: '#0b0c10' }} />
          <span className={styles.learnSwatch} style={{ background: '#f4f5f8' }} />
          <span className={styles.learnSwatch} style={{ background: '#9aa0b4' }} />
        </span>
      </div>
      <div className={styles.learnFoot}>
        <span className={styles.learnFootKey}>5 angles drafted</span>
        <span className={styles.learnFootAccent}>continue →</span>
      </div>
    </div>
  );
}
