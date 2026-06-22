import { describe, it, expect } from 'vitest';
import { validateContactForm, validateBookingForm } from './forms';

describe('validateContactForm', () => {
  it('accepts valid input', () => {
    const result = validateContactForm({ name: 'Jane', email: 'j@x.com', message: 'Hi', website: '' });
    expect(result.ok).toBe(true);
  });
  it('rejects honeypot', () => {
    const result = validateContactForm({ name: 'Jane', email: 'j@x.com', message: 'Hi', website: 'spam' });
    expect(result.ok).toBe(false);
  });
  it('rejects invalid email', () => {
    const result = validateContactForm({ name: 'Jane', email: 'bad', message: 'Hi', website: '' });
    expect(result.ok).toBe(false);
  });
});
