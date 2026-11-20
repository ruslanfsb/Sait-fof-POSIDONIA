/** Header state, active-section highlighting and the accessible mobile menu. */

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const hero = document.querySelector<HTMLElement>('.hero');
  let lastY = window.scrollY;
  let ticking = false;

  const update = (): void => {
    const y = window.scrollY;
    const threshold = hero ? Math.max(80, hero.offsetHeight - header.offsetHeight - 40) : 10;
    header.classList.toggle('is-scrolled', y > threshold);
    // Hide while reading downwards, reveal as soon as the visitor scrolls up.
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (y > threshold + 200 && goingDown) header.classList.add('is-hidden');
    else if (goingUp || y <= threshold) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  update();
}

export function initActiveSection(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((a) => {
    links.set(a.dataset.navLink ?? '', a);
  });
  if (!links.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link, id) => {
          if (id === entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll<HTMLElement>('main section[id]').forEach((s) => observer.observe(s));
}

export function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!toggle || !menu || !header) return;
  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');
  const outside = [document.querySelector('main'), document.querySelector('footer')].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
  let hideTimer = 0;

  const focusables = (): HTMLElement[] => [
    toggle,
    ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ];

  const open = (): void => {
    window.clearTimeout(hideTimer);
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    header.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close menu';
    document.documentElement.classList.add('menu-locked');
    outside.forEach((el) => (el.inert = true));
    menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  };

  const close = (returnFocus = true): void => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Open menu';
    document.documentElement.classList.remove('menu-locked');
    outside.forEach((el) => (el.inert = false));
    hideTimer = window.setTimeout(() => (menu.hidden = true), 450);
    if (returnFocus) toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => (menu.hidden ? open() : close()));

  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('[data-menu-link]')) close(false);
  });

  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  // Close if the viewport grows to the desktop layout.
  window.matchMedia('(min-width: 1140px)').addEventListener('change', (e) => {
    if (e.matches) close(false);
  });
}
