import { describe, it, expect } from 'vitest';
import { validateContactForm, validateBookingForm, validateNewsletterForm } from './forms';

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

describe('validateNewsletterForm', () => {
  it('accepts a valid email', () => {
    const result = validateNewsletterForm({ email: 'j@x.com', website: '' });
    expect(result.ok).toBe(true);
  });

  it('rejects honeypot', () => {
    const result = validateNewsletterForm({ email: 'j@x.com', website: 'spam' });
    expect(result).toEqual({ ok: false, error: 'Invalid submission' });
  });

  it('rejects invalid email', () => {
    const result = validateNewsletterForm({ email: 'bad', website: '' });
    expect(result).toEqual({ ok: false, error: 'Invalid email' });
  });

  it('rejects empty email', () => {
    const result = validateNewsletterForm({ email: '  ', website: '' });
    expect(result).toEqual({ ok: false, error: 'Invalid email' });
  });
});
