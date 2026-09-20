document.querySelectorAll<HTMLFormElement>('[data-newsletter-form]').forEach((form) => {
  const emailInput = form.querySelector<HTMLInputElement>('[data-newsletter-email]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-newsletter-btn]');
  const errorEl = form.querySelector<HTMLElement>('[data-newsletter-error]');
  const errorMsg = form.querySelector<HTMLElement>('[data-newsletter-error-msg]');
  const defaultLabel = submitBtn?.textContent ?? 'Sign Up';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!emailInput?.value) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing up…';
    }
    errorEl?.setAttribute('hidden', '');

    const formData = new FormData(form);
    const payload = {
      email: String(formData.get('email') ?? ''),
      website: String(formData.get('website') ?? ''),
    };

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Failed to save signup');
      }

      if (submitBtn) submitBtn.textContent = "You're in ✓";
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
      if (errorEl) {
        errorEl.removeAttribute('hidden');
        if (errorMsg) {
          errorMsg.textContent =
            err instanceof Error ? err.message : 'Failed to save signup. Please try again.';
        }
      }
    }
  });

  emailInput?.addEventListener('input', () => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
    errorEl?.setAttribute('hidden', '');
  });
});
