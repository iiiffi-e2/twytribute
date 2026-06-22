function scrollToInquiry(): void {
  const el = document.getElementById('inquiry');
  if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  }
}

function initBookingForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-booking-form-el]');
  const successEl = root.querySelector<HTMLElement>('[data-booking-success]');
  const errorEl = root.querySelector<HTMLElement>('[data-booking-error]');

  if (!form || !successEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errorMsg = errorEl?.querySelector<HTMLElement>('[data-booking-error-msg]');
    const defaultLabel = submitBtn?.textContent ?? 'Send Inquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    errorEl?.setAttribute('hidden', '');

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      org: String(formData.get('org') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      email: String(formData.get('email') ?? ''),
      date: String(formData.get('date') ?? ''),
      location: String(formData.get('location') ?? ''),
      audienceSize: String(formData.get('audienceSize') ?? ''),
      message: String(formData.get('message') ?? ''),
      website: String(formData.get('website') ?? ''),
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Failed to send inquiry');
      }

      form.setAttribute('hidden', '');
      successEl.removeAttribute('hidden');
      scrollToInquiry();
    } catch (err) {
      if (errorEl) {
        errorEl.removeAttribute('hidden');
        if (errorMsg) {
          errorMsg.textContent =
            err instanceof Error ? err.message : 'Failed to send inquiry. Please try again.';
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

document.querySelectorAll<HTMLElement>('[data-booking-form]').forEach(initBookingForm);

if (window.location.hash === '#inquiry') {
  window.setTimeout(scrollToInquiry, 300);
}
