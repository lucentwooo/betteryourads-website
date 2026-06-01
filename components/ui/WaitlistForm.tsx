'use client';

import { useState, type FormEvent } from 'react';
import { fireConfetti } from '@/lib/confetti';
import styles from './WaitlistForm.module.css';

export function WaitlistForm({
  id,
  center = false,
}: {
  id?: string;
  center?: boolean;
}) {
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    if (input && !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    setDone(true);
    fireConfetti();
  }

  if (done) {
    return (
      <div className={`${styles.done} ${center ? styles.doneCenter : ''}`.trim()}>
        <span className={styles.doneDot} />
        you’re on the list — we’ll email you when your seat opens.
      </div>
    );
  }

  return (
    <form
      id={id}
      className={`${styles.form} ${center ? styles.center : ''}`.trim()}
      onSubmit={handleSubmit}
    >
      <input
        className={styles.input}
        type="email"
        placeholder="founder@yoursaas.com"
        autoComplete="email"
        required
      />
      <button className={styles.button} type="submit">
        join the waitlist →
      </button>
    </form>
  );
}
