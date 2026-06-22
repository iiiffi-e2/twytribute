function initContactForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-contact-form-el]');
  const successEl = root.querySelector<HTMLElement>('[data-contact-success]');
  const errorEl = root.querySelector<HTMLElement>('[data-contact-error]');

  if (!form || !successEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errorMsg = errorEl?.querySelector<HTMLElement>('[data-contact-error-msg]');
    const defaultLabel = submitBtn?.textContent ?? 'Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    errorEl?.setAttribute('hidden', '');

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      website: String(formData.get('website') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Failed to send message');
      }

      form.setAttribute('hidden', '');
      successEl.removeAttribute('hidden');
    } catch (err) {
      if (errorEl) {
        errorEl.removeAttribute('hidden');
        if (errorMsg) {
          errorMsg.textContent =
            err instanceof Error ? err.message : 'Failed to send message. Please try again.';
        }
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-contact-form]').forEach(initContactForm);
