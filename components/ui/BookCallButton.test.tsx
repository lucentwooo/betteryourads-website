import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('@calcom/embed-react', () => ({ getCalApi: () => Promise.resolve(() => {}) }));
import { BookCallButton } from './BookCallButton';
describe('BookCallButton', () => {
  it('renders with the cal link wired', () => {
    render(<BookCallButton />);
    const el = screen.getByText(/get early access/i).closest('[data-cal-link]');
    expect(el).toHaveAttribute('data-cal-link', 'loopy/20min');
  });
});
