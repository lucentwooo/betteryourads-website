import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { WaitlistForm } from './WaitlistForm';

describe('WaitlistForm', () => {
  it('shows the confirmation message after a valid submit', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByPlaceholderText('founder@yoursaas.com'), 'a@b.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(screen.getByText(/you’re on the list/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('founder@yoursaas.com')).not.toBeInTheDocument();
  });

  it('does not confirm when the email is empty/invalid', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(screen.queryByText(/you’re on the list/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('founder@yoursaas.com')).toBeInTheDocument();
  });
});
