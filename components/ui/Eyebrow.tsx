import styles from './Eyebrow.module.css';

export function Eyebrow({
  children,
  accent = false,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  as?: 'div' | 'span';
  className?: string;
}) {
  const classes = [styles.eyebrow, accent ? styles.accent : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <Tag className={classes}>{children}</Tag>;
}
