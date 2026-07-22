import Image from 'next/image';
import Link from 'next/link';
import { CAL_URL } from '@/lib/site';
import styles from './Footer.module.css';

/* No privacy/terms links — intentionally removed (design decision). */
export function Footer({ page = 'landing' }: { page?: 'landing' | 'pricing' }) {
  const prefix = page === 'landing' ? '' : '/';

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.about}>
          <Image src="/loopy-logo.png" alt="Loopy" width={60} height={24} className={styles.logo} />
          <p className={styles.blurb}>
            Loopy makes and improves Meta ads. Paste a website URL and a real browser measures the site&apos;s actual
            colors, fonts and logo, then turns proven ad layouts into finished, on-brand static ads - with product
            screenshots placed exactly, never invented.
          </p>
          <p className={styles.fineprint}>© 2026 Loopy · tryloopy.io</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <span className={styles.colHead}>product</span>
            <a href={`${prefix}#how`}>how it works</a>
            <Link href="/pricing">pricing</Link>
            <a href="#faq">faq</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>company</span>
            <a href={CAL_URL}>talk to the founders</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
