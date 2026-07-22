import Image from 'next/image';
import Link from 'next/link';
import { CAL_URL } from '@/lib/site';
import styles from './Nav.module.css';

export function Nav({ page = 'landing' }: { page?: 'landing' | 'pricing' }) {
  const onLanding = page === 'landing';
  const prefix = onLanding ? '' : '/';

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href={onLanding ? '#top' : '/'} aria-label="Loopy home" className={styles.brand}>
          <Image src="/loopy-logo.png" alt="Loopy" width={65} height={26} priority className={styles.logo} />
        </Link>
        <div className={styles.links}>
          <a href={`${prefix}#how`}>how it works</a>
          <a href={`${prefix}#batch`}>the output</a>
          <Link href="/pricing" className={onLanding ? undefined : styles.active}>
            pricing
          </Link>
          <a href="#faq">faq</a>
        </div>
        <a className={styles.cta} href={CAL_URL}>
          book intro call <span aria-hidden="true">↗</span>
        </a>
      </div>
    </nav>
  );
}
