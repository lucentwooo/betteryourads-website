import Image from 'next/image';
import styles from './Footer.module.css';

const COLUMNS = [
  { h: 'product', links: [['how it works', '#how'], ['compare', '#compare']] },
  { h: 'company', links: [['about', '#'], ['contact', '#'], ['careers', '#']] },
  { h: 'resources', links: [['faq', '#faq'], ['privacy', '#'], ['terms', '#']] },
] as const;

export function Footer() {
  return (
    <footer className={styles.foot}>
      <div className={styles.inner}>
        <div>
          <a className={styles.brandRow} href="#">
            <Image src="/logo-mark.png" alt="" width={28} height={28} />
            <span className={styles.brandWordmark}>
              betteryour<span className={styles.brandAds}>ads</span>
            </span>
          </a>
          <p className={styles.brandBlurb}>
            Meta ads for b2b saas. Built by founders who got tired of agency invoices.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.h}>
            <h6>{col.h}</h6>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.metaLine}>
        <span>betteryourads · 2026 · sf</span>
        <span className={styles.metaStatus}>
          <span className={styles.metaDot} />
          private beta · waitlist open
        </span>
      </div>
    </footer>
  );
}
