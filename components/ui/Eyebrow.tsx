import styles from './Eyebrow.module.css';

export function Eyebrow({
  children,
  accent = false,
  as: Tag = 'div',
  className,
  tag,
}: {
  children: React.ReactNode;
  accent?: boolean;
  as?: 'div' | 'span';
  className?: string;
  /** CSS color for the leading tag square (the awareness-ladder accent). */
  tag?: string;
}) {
  const classes = [styles.eyebrow, accent ? styles.accent : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={classes}>
      {tag ? (
        <span className={styles.tag} style={{ background: tag }} aria-hidden="true" />
      ) : null}
      {children}
    </Tag>
  );
}
