'use client';
import { useEffect, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { MagneticButton } from './MagneticButton';
import { track } from '@/lib/analytics';
import styles from './MagneticButton.module.css';

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'loopy/20min';

const DEFAULT_LABEL = (
  <>
    get early access <span className={styles.arrow}>↗</span>
  </>
);

export function BookCallButton({
  children = DEFAULT_LABEL,
  sm = false,
  lg = false,
}: {
  children?: ReactNode;
  sm?: boolean;
  lg?: boolean;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: '20min' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);
  return (
    <MagneticButton
      primary
      sm={sm}
      lg={lg}
      onClick={() => track('book_call_click')}
      data-cal-namespace="20min"
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </MagneticButton>
  );
}
