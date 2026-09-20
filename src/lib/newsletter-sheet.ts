type FetchFn = typeof fetch;

export async function appendNewsletterSignup(
  email: string,
  options?: {
    url?: string;
    secret?: string;
    fetchFn?: FetchFn;
  },
) {
  const url = options?.url ?? import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const secret = options?.secret ?? import.meta.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? '';
  const fetchFn = options?.fetchFn ?? fetch;

  if (!url) throw new Error('Newsletter signup is not configured');

  const res = await fetchFn(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, secret }),
  });

  if (!res.ok) throw new Error('Failed to save signup');
}
