'use server';

import { Resend } from 'resend';

/* =================================================================
   joinWaitlist — server action for the optimization-loop waitlist.

   Adds the email as a Resend contact (into RESEND_AUDIENCE_ID when
   configured). Missing API key logs a warning and reports success so
   a local/preview environment without secrets doesn't show visitors
   a broken form; production must set RESEND_API_KEY.
   ================================================================= */

export interface WaitlistState {
  status: 'idle' | 'ok' | 'error';
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'that email doesn’t look right' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[waitlist] RESEND_API_KEY not set; signup not persisted:', email);
    return { status: 'ok' };
  }

  try {
    const resend = new Resend(apiKey);
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const res = audienceId
      ? await resend.contacts.create({ email, audienceId })
      : await resend.contacts.create({ email });

    if (res.error) {
      // Already-subscribed reads as success to the visitor.
      if (/exists|already/i.test(res.error.message ?? '')) return { status: 'ok' };
      console.error('[waitlist] resend error:', res.error);
      return { status: 'error', message: 'something broke on our end, try again' };
    }
    return { status: 'ok' };
  } catch (err) {
    console.error('[waitlist] resend threw:', err);
    return { status: 'error', message: 'something broke on our end, try again' };
  }
}
