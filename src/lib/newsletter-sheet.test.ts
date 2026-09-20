import { describe, it, expect, vi } from 'vitest';
import { appendNewsletterSignup } from './newsletter-sheet';

describe('appendNewsletterSignup', () => {
  it('posts the email and secret to the webhook', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true });

    await appendNewsletterSignup('j@x.com', {
      url: 'https://script.google.com/macros/s/abc/exec',
      secret: 'shh',
      fetchFn,
    });

    expect(fetchFn).toHaveBeenCalledWith('https://script.google.com/macros/s/abc/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'j@x.com', secret: 'shh' }),
    });
  });

  it('throws when the webhook URL is missing', async () => {
    await expect(
      appendNewsletterSignup('j@x.com', { url: '', secret: 'shh', fetchFn: vi.fn() }),
    ).rejects.toThrow('Newsletter signup is not configured');
  });

  it('throws when the webhook returns an error', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(
      appendNewsletterSignup('j@x.com', {
        url: 'https://script.google.com/macros/s/abc/exec',
        secret: 'shh',
        fetchFn,
      }),
    ).rejects.toThrow('Failed to save signup');
  });
});
