import { Eyebrow } from './Eyebrow';
import styles from './SectionHead.module.css';

export function SectionHead({
  eyebrow,
  eyebrowAccent = false,
  eyebrowTag,
  title,
  sub,
}: {
  eyebrow: React.ReactNode;
  eyebrowAccent?: boolean;
  /** CSS color for the eyebrow's leading tag square. */
  eyebrowTag?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className={styles.head}>
      <Eyebrow accent={eyebrowAccent} tag={eyebrowTag}>
        {eyebrow}
      </Eyebrow>
      <h2 className={styles.title}>{title}</h2>
      {sub ? <p className={styles.sub}>{sub}</p> : null}
    </div>
  );
}
