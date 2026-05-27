import styles from './OptimizeChart.module.css';

const ROWS = [
  { name: 'ship without the standup', pct: 92, signups: 47, cps: '$18' },
  { name: 'speed is the feature', pct: 71, signups: 36, cps: '$24' },
  { name: 'for engineers, by eng.', pct: 48, signups: 24, cps: '$33' },
  { name: 'the issue tracker', pct: 28, signups: 14, cps: '$71' },
  { name: 'your roadmap, not theirs', pct: 11, signups: 6, cps: '$162' },
] as const;

export function OptimizeChart() {
  return (
    <div className={styles.optimize}>
      <div className={styles.head}>
        <span>this week · trial signups by angle</span>
        <span>cost / signup</span>
      </div>
      <div className={styles.rows}>
        {ROWS.map((r, i) => {
          const winner = i < 2;
          return (
            <div className={styles.row} key={r.name}>
              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${r.pct}%`,
                    background: winner ? 'var(--accent)' : 'var(--bya-ink-4)',
                  }}
                />
                <div
                  className={styles.barLabel}
                  style={{ color: r.pct > 50 ? 'var(--bg)' : 'var(--fg)' }}
                >
                  <span className={styles.barName}>{r.name}</span>
                  <span className={styles.signups}>{r.signups}</span>
                </div>
              </div>
              <span
                className={styles.cps}
                style={{ color: winner ? 'var(--fg)' : 'var(--fg-3)' }}
              >
                {r.cps}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.foot}>
        <span>spend shifted to top signup drivers · auto</span>
        <span>127 signups · $2,841 mrr</span>
      </div>
    </div>
  );
}
