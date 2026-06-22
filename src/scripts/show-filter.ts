const HEADINGS = {
  upcoming: 'All Upcoming Dates',
  past: 'Past Performances',
} as const;

type ShowFilter = keyof typeof HEADINGS;

function initShowList(root: HTMLElement): void {
  const heading = root.querySelector<HTMLElement>('[data-show-heading]');
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-show-filter]');
  const panels = root.querySelectorAll<HTMLElement>('[data-show-panel]');

  const setFilter = (filter: ShowFilter): void => {
    if (heading) {
      heading.textContent = HEADINGS[filter];
    }

    buttons.forEach((btn) => {
      const isActive = btn.dataset.showFilter === filter;
      btn.classList.toggle('show-list__toggle-btn--active', isActive);
    });

    panels.forEach((panel) => {
      const isVisible = panel.dataset.showPanel === filter;
      if (isVisible) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.showFilter as ShowFilter | undefined;
      if (filter === 'upcoming' || filter === 'past') {
        setFilter(filter);
      }
    });
  });
}

document.querySelectorAll<HTMLElement>('[data-show-list-root]').forEach(initShowList);
