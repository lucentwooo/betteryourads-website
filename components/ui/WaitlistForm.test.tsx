import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistForm } from './WaitlistForm';

const action = vi.hoisted(() => vi.fn());
vi.mock('@/lib/waitlist/action', () => ({ joinWaitlist: action }));
vi.mock('@/lib/confetti', () => ({ fireConfetti: vi.fn() }));

beforeEach(() => action.mockReset());

describe('WaitlistForm', () => {
  it('has an accessible label on the email field', () => {
    render(<WaitlistForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
  it('shows success on ok result', async () => {
    action.mockResolvedValue({ ok: true });
    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'founder@yoursaas.com');
    await userEvent.click(screen.getByRole('button', { name: /waitlist/i }));
    expect(await screen.findByText(/on the list/i)).toBeInTheDocument();
  });
  it('shows an error message on error result', async () => {
    action.mockResolvedValue({ ok: false, reason: 'error' });
    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'founder@yoursaas.com');
    await userEvent.click(screen.getByRole('button', { name: /waitlist/i }));
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
