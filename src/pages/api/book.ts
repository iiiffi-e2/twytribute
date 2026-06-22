import type { APIRoute } from 'astro';
import { validateBookingForm } from '../../lib/forms';
import { sendBookingEmail } from '../../lib/email';
import { checkRateLimit, getClientIp } from '../../lib/rate-limit';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = getClientIp(request, clientAddress);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.ok) {
    return new Response(JSON.stringify({ error: rateLimit.error }), { status: 429 });
  }

  let data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    location: string;
    message: string;
    website: string;
    org?: string;
    audienceSize?: string;
  };
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const validation = validateBookingForm(data);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
  }

  try {
    await sendBookingEmail(data);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
};
