import type { APIRoute } from 'astro';
import { validateNewsletterForm } from '../../lib/forms';
import { appendNewsletterSignup } from '../../lib/newsletter-sheet';
import { checkRateLimit, getClientIp } from '../../lib/rate-limit';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = getClientIp(request, clientAddress);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.ok) {
    return new Response(JSON.stringify({ error: rateLimit.error }), { status: 429 });
  }

  let data: { email: string; website: string };
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const validation = validateNewsletterForm(data);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
  }

  try {
    await appendNewsletterSignup(data.email.trim());
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to save signup' }), { status: 500 });
  }
};
