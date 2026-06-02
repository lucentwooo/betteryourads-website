'use client';
import { useEffect, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { MagneticButton } from './MagneticButton';

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'lucent-wu/15min';

export function BookCallButton({ children = 'Book a pilot call →', sm = false }: { children?: ReactNode; sm?: boolean }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: '15min' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);
  return (
    <MagneticButton primary sm={sm} data-cal-namespace="15min" data-cal-link={CAL_LINK} data-cal-config='{"layout":"month_view"}'>
      {children}
    </MagneticButton>
  );
}
