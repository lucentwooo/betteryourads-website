import { SectionHead } from '@/components/ui/SectionHead';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import styles from './PilotProof.module.css';

const PILOTS = [
  {
    num: 'pilot 01',
    name: 'A Startmate-backed startup',
    stage: 'pre-seed',
    model: 'Self-serve SaaS · trial → paid',
    channels: ['Facebook', 'Instagram'],
  },
  {
    num: 'pilot 02',
    name: 'A Melbourne accelerator app',
    stage: 'seed',
    model: 'Mobile app · driving app installs',
    channels: ['Facebook', 'Instagram'],
  },
] as const;

export function PilotProof() {
  return (
    <section className={`section ${styles.sectionPilot}`} id="pilot">
      <div className="wrap">
        <SectionHead
          eyebrow="currently in pilot"
          eyebrowAccent
          title={
            <>
              Two founders. Real ads.
              <br />
              Shipping daily.
            </>
          }
          sub="We're running ads right now for two funded startups: one self-serve SaaS, one mobile app. Anonymous until the data is. Specific because we owe you specifics."
        />
        <div className={styles.grid}>
          {PILOTS.map((p) => (
            <SpotlightCard className={`${styles.card} ${styles.beam} reveal`} key={p.num}>
              <div className={styles.mark}>
                <span className={styles.num}>{p.num}</span>
                <span className={styles.status}>
                  <span className={styles.live} />
                  shipping daily
                </span>
              </div>

              <div className={styles.head}>
                <div className={styles.name}>{p.name}</div>
                <span className={styles.stagePill}>{p.stage}</span>
              </div>

              <div className={styles.body}>
                <div className={styles.model}>{p.model}</div>
                <div className={styles.chips}>
                  {p.channels.map((c) => (
                    <span className={styles.chip} key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
        <div className={styles.foot}>Both go public when the numbers do.</div>
      </div>
    </section>
  );
}
