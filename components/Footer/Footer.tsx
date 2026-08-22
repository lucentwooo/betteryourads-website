import Image from 'next/image';
import Link from 'next/link';
import { CAL_URL } from '@/lib/site';
import styles from './Footer.module.css';

/* No privacy/terms links — intentionally removed (design decision). */
export function Footer({ page = 'landing' }: { page?: 'landing' | 'pricing' | 'content' }) {
  const prefix = page === 'landing' ? '' : '/';

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.about}>
          <Image src="/loopy-logo.png" alt="Loopy" width={60} height={24} className={styles.logo} />
          <p className={styles.blurb}>
            Loopy automates the research and brief work behind an agency&rsquo;s Meta ads. Drop in a client&rsquo;s
            website and a real browser measures their actual brand, customer and competitor research becomes ranked ad
            concepts, and the ones you pick cut into a client-ready creative brief - with on-brand renders attached.
          </p>
          <p className={styles.fineprint}>© 2026 Loopy - tryloopy.io</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <span className={styles.colHead}>product</span>
            <a href={`${prefix}#how`}>how it works</a>
            <Link href="/pricing">pricing</Link>
            <Link href="/ad-creative-brief-template">ad brief template</Link>
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
