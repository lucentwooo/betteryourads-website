import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('@calcom/embed-react', () => ({ getCalApi: () => Promise.resolve(() => {}) }));
import { BookCallButton } from './BookCallButton';
describe('BookCallButton', () => {
  it('renders with the cal link wired', () => {
    render(<BookCallButton />);
    const el = screen.getByText(/book a pilot call/i).closest('[data-cal-link]');
    expect(el).toHaveAttribute('data-cal-link', 'lucent-wu/15min');
  });
});
