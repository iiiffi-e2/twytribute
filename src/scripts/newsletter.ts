document.querySelectorAll<HTMLFormElement>('[data-newsletter-form]').forEach((form) => {
  const emailInput = form.querySelector<HTMLInputElement>('[data-newsletter-email]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-newsletter-btn]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput?.value) return;
    if (submitBtn) submitBtn.textContent = "You're in ✓";
  });

  emailInput?.addEventListener('input', () => {
    if (submitBtn) submitBtn.textContent = 'Sign Up';
  });
});
