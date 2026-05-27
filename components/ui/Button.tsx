import styles from './Button.module.css';

export function Button({
  href,
  children,
  primary = false,
  sm = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  sm?: boolean;
  className?: string;
}) {
  const classes = [styles.btn, primary ? styles.primary : '', sm ? styles.sm : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
