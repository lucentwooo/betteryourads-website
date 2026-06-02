import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validate';

describe('isValidEmail', () => {
  it('accepts a normal email', () => { expect(isValidEmail('founder@yoursaas.com')).toBe(true); });
  it('rejects empty + malformed', () => {
    for (const bad of ['', 'nope', 'a@b', 'a@b.', '@x.com']) expect(isValidEmail(bad)).toBe(false);
  });
  it('trims surrounding whitespace', () => { expect(isValidEmail('  a@b.co ')).toBe(true); });
});
