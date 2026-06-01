import { SectionHead } from '@/components/ui/SectionHead';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import styles from './PilotProof.module.css';

const PILOTS = [
  {
    num: 'pilot 01',
    name: 'A Startmate-backed startup',
    rows: [
      ['stage', 'pre-seed'],
      ['funnel', 'self-serve, trial to paid'],
      ['running', 'facebook + instagram'],
    ],
  },
  {
    num: 'pilot 02',
    name: 'A Melbourne accelerator company',
    rows: [
      ['stage', 'seed'],
      ['funnel', 'sales-led, demo to close'],
      ['running', 'facebook + instagram'],
    ],
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
          sub="We're running ads right now for two B2B SaaS teams. Anonymous until the data is. Specific because we owe you specifics."
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
              <div className={styles.name}>{p.name}</div>
              <div className={styles.rows}>
                {p.rows.map(([k, v]) => (
                  <div className={styles.row} key={k}>
                    <span className={styles.k}>{k}</span>
                    <span className={styles.v}>{v}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
        <div className={styles.foot}>Both go public when the numbers do.</div>
      </div>
    </section>
  );
}
