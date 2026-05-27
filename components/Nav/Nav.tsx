import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#">
          <Image className={styles.mark} src="/logo-mark.png" alt="" width={26} height={26} />
          <span className={styles.wordmark}>
            betteryour<span className={styles.ads}>ads</span>
          </span>
        </a>
        <div className={styles.links}>
          <a href="#how">how it works</a>
          <a href="#compare">compare</a>
          <a href="#pricing">pricing</a>
          <a href="#faq">faq</a>
        </div>
        <div className={styles.ctaGroup}>
          <Button href="#waitlist" primary sm>
            join the waitlist →
          </Button>
        </div>
      </div>
    </nav>
  );
}
