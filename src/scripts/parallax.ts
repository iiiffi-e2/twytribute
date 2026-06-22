function initParallax(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!els.length) return;

  const onScroll = (): void => {
    const y = window.scrollY || document.documentElement.scrollTop;
    els.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax || '0.15');
      const parent = el.parentElement;
      if (!parent) return;
      const offset = parent.getBoundingClientRect().top + window.scrollY;
      el.style.transform = `translateY(${(y - offset) * factor}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}
