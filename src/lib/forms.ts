const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: { name: string; email: string; message: string; website: string }) {
  if (data.website) return { ok: false as const, error: 'Invalid submission' };
  if (!data.name.trim() || !data.message.trim()) return { ok: false as const, error: 'Required fields missing' };
  if (!EMAIL_RE.test(data.email)) return { ok: false as const, error: 'Invalid email' };
  return { ok: true as const };
}

export function validateBookingForm(data: {
  name: string; email: string; phone: string; date: string; location: string; message: string; website: string;
}) {
  if (data.website) return { ok: false as const, error: 'Invalid submission' };
  if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) return { ok: false as const, error: 'Required fields missing' };
  if (!EMAIL_RE.test(data.email)) return { ok: false as const, error: 'Invalid email' };
  return { ok: true as const };
}
