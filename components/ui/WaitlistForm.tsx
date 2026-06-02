'use client';
import { useActionState, useEffect, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { joinWaitlist, type WaitlistResult } from '@/lib/waitlist/action';
import { fireConfetti } from '@/lib/confetti';
import styles from './WaitlistForm.module.css';

const ERRORS: Record<string, string> = {
  invalid: "That email doesn't look right — check and try again.",
  duplicate: "You're already on the list — we'll be in touch.",
  error: 'Something went wrong. Try again in a moment.',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.button} type="submit" disabled={pending} aria-busy={pending}>
      {pending ? 'joining…' : 'join the waitlist →'}
    </button>
  );
}

export function WaitlistForm({ id, center = false }: { id?: string; center?: boolean }) {
  const emailId = useId();
  const [state, formAction] = useActionState<WaitlistResult | null, FormData>(joinWaitlist, null);

  useEffect(() => { if (state?.ok) fireConfetti(); }, [state]);

  if (state?.ok) {
    return (
      <div className={`${styles.done} ${center ? styles.doneCenter : ''}`.trim()}>
        <span className={styles.doneDot} />
        you're on the list — we'll email you when your seat opens.
      </div>
    );
  }

  return (
    <form id={id} action={formAction} className={`${styles.form} ${center ? styles.center : ''}`.trim()}>
      <label htmlFor={emailId} className={styles.srOnly}>Work email</label>
      <input
        id={emailId}
        name="email"
        className={styles.input}
        type="email"
        placeholder="founder@yoursaas.com"
        autoComplete="email"
        required
      />
      <SubmitButton />
      {state && !state.ok && (
        <p className={styles.error} role="alert">{ERRORS[state.reason]}</p>
      )}
    </form>
  );
}
