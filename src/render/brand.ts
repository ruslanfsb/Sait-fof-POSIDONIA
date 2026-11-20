import { html, type Markup } from './html.ts';

/**
 * Temporary brand mark: a trident whose three prongs are Posidonia leaf blades.
 * Replace this function (or the SVG paths) with the official logo when available.
 */
export const MARK_PATHS = {
  center: 'M20 2.5C22.7 9 23.1 19.5 20 30.5 16.9 19.5 17.3 9 20 2.5Z',
  left: 'M19 30.5C11 28.8 5.6 20.8 6.4 7 10.2 16.2 14.2 23.8 19 30.5Z',
  right: 'M21 30.5C29 28.8 34.4 20.8 33.6 7 29.8 16.2 25.8 23.8 21 30.5Z',
  shaft: 'M20 28v17.5',
};

export function brandMark(className = 'brand-mark'): Markup {
  return html`<svg class="${className}" viewBox="0 0 40 48" aria-hidden="true" focusable="false">
    <path d="${MARK_PATHS.left}" fill="currentColor" opacity=".72"/>
    <path d="${MARK_PATHS.right}" fill="currentColor" opacity=".72"/>
    <path d="${MARK_PATHS.center}" fill="currentColor"/>
    <path d="${MARK_PATHS.shaft}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  </svg>`;
}

export function brandLockup(href: string, label = 'POSIDONIA — home'): Markup {
  return html`<a class="brand" href="${href}" aria-label="${label}">
    ${brandMark()}
    <span class="brand-word">POSIDONIA</span>
  </a>`;
}
