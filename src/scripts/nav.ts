function initNav(root: HTMLElement): void {
  const progressFill = root.querySelector<HTMLElement>('[data-progress-fill]');
  const navBar = root.querySelector<HTMLElement>('[data-nav-bar]');
  const mobileBtn = root.querySelector<HTMLButtonElement>('[data-mobile-btn]');
  const mobileMenu = root.querySelector<HTMLElement>('[data-mobile-menu]');

  let menuOpen = false;

  const onScroll = (): void => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const progress = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;

    if (progressFill) {
      progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
    }
    if (navBar) {
      navBar.classList.toggle('nav-bar--scrolled', scrollTop > 30);
    }
  };

  const setMenuOpen = (open: boolean): void => {
    menuOpen = open;
    if (!mobileMenu) return;
    if (open) {
      mobileMenu.removeAttribute('hidden');
      mobileMenu.classList.add('mobile-menu--open');
    } else {
      mobileMenu.setAttribute('hidden', '');
      mobileMenu.classList.remove('mobile-menu--open');
    }
  };

  mobileBtn?.addEventListener('click', () => setMenuOpen(!menuOpen));

  const onResize = (): void => {
    if (window.innerWidth >= 1120 && menuOpen) {
      setMenuOpen(false);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  onScroll();
}

document.querySelectorAll<HTMLElement>('[data-nav-root]').forEach(initNav);
