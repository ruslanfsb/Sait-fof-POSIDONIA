/** Scroll reveal and the subtle hero parallax. Both respect prefers-reduced-motion. */

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer.observe(el));
}

export function initParallax(): void {
  const media = document.querySelector<HTMLElement>('.hero-media');
  const content = document.querySelector<HTMLElement>('[data-hero-content]');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!media || !content || !hero || reducedMotion()) return;

  let ticking = false;
  const update = (): void => {
    const y = window.scrollY;
    const h = hero.offsetHeight;
    if (y <= h) {
      media.style.transform = `translate3d(0, ${(y * 0.25).toFixed(1)}px, 0)`;
      content.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
      content.style.opacity = String(Math.max(0, 1 - (y / h) * 1.3));
    }
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
}
