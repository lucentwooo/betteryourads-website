'use server';
import { Resend } from 'resend';
import { isValidEmail } from './validate';

export type WaitlistResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'duplicate' | 'error' };

export async function joinWaitlist(_prev: unknown, formData: FormData): Promise<WaitlistResult> {
  const email = String(formData.get('email') ?? '').trim();
  if (!isValidEmail(email)) return { ok: false, reason: 'invalid' };

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return { ok: false, reason: 'error' };

  try {
    const resend = new Resend(apiKey);
    // LegacyCreateContactOptions overload — audienceId is deprecated in resend@6
    // but the overload is still present and type-checks correctly.
    const { error } = await resend.contacts.create({ email, audienceId, unsubscribed: false });
    if (error) {
      if (/already exists/i.test(error.message)) return { ok: false, reason: 'duplicate' };
      return { ok: false, reason: 'error' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
