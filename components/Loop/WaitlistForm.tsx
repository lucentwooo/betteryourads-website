'use client';

import { useActionState, useEffect } from 'react';
import { joinWaitlist, type WaitlistState } from '@/app/actions/waitlist';
import { fireConfetti } from '@/lib/confetti';
import { track } from '@/lib/analytics';
import styles from './WaitlistForm.module.css';

const INITIAL: WaitlistState = { status: 'idle' };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, INITIAL);

  useEffect(() => {
    if (state.status === 'ok') {
      track('waitlist_join');
      fireConfetti();
    }
  }, [state.status]);

  if (state.status === 'ok') {
    return (
      <p className={styles.done} role="status">
        you’re on the list. we’ll email you when the loop opens.
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.srOnly} htmlFor="waitlist-email">
        Work email
      </label>
      <input
        id="waitlist-email"
        className={styles.input}
        type="email"
        name="email"
        required
        placeholder="you@yourcompany.com"
        autoComplete="email"
        disabled={pending}
      />
      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'joining…' : 'join the waitlist'}
      </button>
      {state.status === 'error' ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
