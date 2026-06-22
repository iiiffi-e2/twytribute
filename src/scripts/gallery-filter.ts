const CAT_DEFS = ['all', 'live', 'bts', 'crowd', 'venues'] as const;
type GalleryCategory = (typeof CAT_DEFS)[number];

function initGallery(root: HTMLElement): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-gallery-filter]');
  const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]');
  const lightbox = root.querySelector<HTMLElement>('[data-gallery-lightbox]');
  const lightboxImg = root.querySelector<HTMLImageElement>('[data-gallery-lightbox-img]');
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-gallery-lightbox-close]');

  const setCategory = (category: GalleryCategory): void => {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.galleryFilter === category;
      btn.classList.toggle('gallery-grid__filter-btn--active', isActive);
    });

    items.forEach((item) => {
      const itemCat = item.dataset.category ?? '';
      const visible = category === 'all' || itemCat === category;
      item.toggleAttribute('hidden', !visible);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.galleryFilter as GalleryCategory | undefined;
      if (category && CAT_DEFS.includes(category)) {
        setCategory(category);
      }
    });
  });

  const closeLightbox = (): void => {
    if (lightbox) {
      lightbox.setAttribute('hidden', '');
    }
    document.body.style.overflow = '';
  };

  const openLightbox = (src: string, alt: string): void => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.dataset.gallerySrc;
      const img = item.querySelector('img');
      if (src) {
        openLightbox(src, img?.alt ?? 'Gallery photo');
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-gallery-root]').forEach(initGallery);
