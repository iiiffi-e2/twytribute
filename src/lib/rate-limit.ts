const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanupRateLimitMap(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): { ok: true } | { ok: false; error: string } {
  const now = Date.now();
  cleanupRateLimitMap(now);

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= LIMIT) {
    return { ok: false, error: 'Too many requests. Please try again later.' };
  }

  entry.count += 1;
  return { ok: true };
}

export function getClientIp(request: Request, clientAddress?: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return clientAddress ?? 'unknown';
}
