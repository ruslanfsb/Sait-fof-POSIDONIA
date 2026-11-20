import { html, type Markup } from './html.ts';
import { LOGO } from './logo-paths.ts';

/**
 * Official POSIDONIA logo: leaf mark + wave, and the POSIDONIA wordmark.
 *
 * The artwork is defined once (see `logoSprite`) and reused with <use>.
 * Colors come from CSS custom properties, so the same logo switches between
 * the full-color version (light backgrounds) and the reversed version
 * (dark backgrounds) — see `--logo-*` in src/styles/base.css.
 */

/** Brand colors sampled from the original logo. */
export const LOGO_COLORS = {
  leafLight: '#66AA30',
  leafDark: '#3D7E24',
  waveLight: '#0A9396',
  waveDark: '#066B6C',
  ink: '#033E3C',
  // Reversed version for dark backgrounds
  revLeafLight: '#94CF5C',
  revLeafDark: '#62A63A',
  revWaveLight: '#5CC6C3',
  revWaveDark: '#2E9D9A',
};

const c = LOGO_COLORS;

/** Hidden sprite with gradients and symbols. Render once, at the start of <body>. */
export function logoSprite(): Markup {
  return html`<svg class="svg-sprite" aria-hidden="true" focusable="false" width="0" height="0">
    <defs>
      <linearGradient id="pos-leaf" x1="1" y1="0" x2="0.15" y2="1">
        <stop offset="0" stop-color="${c.leafLight}"/><stop offset="1" stop-color="${c.leafDark}"/>
      </linearGradient>
      <linearGradient id="pos-wave" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${c.waveLight}"/><stop offset="1" stop-color="${c.waveDark}"/>
      </linearGradient>
      <linearGradient id="pos-leaf-rev" x1="1" y1="0" x2="0.15" y2="1">
        <stop offset="0" stop-color="${c.revLeafLight}"/><stop offset="1" stop-color="${c.revLeafDark}"/>
      </linearGradient>
      <linearGradient id="pos-wave-rev" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${c.revWaveLight}"/><stop offset="1" stop-color="${c.revWaveDark}"/>
      </linearGradient>
    </defs>
    <symbol id="pos-mark" viewBox="${LOGO.mark.viewBox}">
      <path d="${LOGO.mark.leaves}" style="fill: var(--logo-leaf)"/>
      <path d="${LOGO.mark.wave}" style="fill: var(--logo-wave)"/>
    </symbol>
    <symbol id="pos-wordmark" viewBox="${LOGO.wordmark.viewBox}">
      <path d="${LOGO.wordmark.text}" style="fill: var(--logo-ink)"/>
    </symbol>
  </svg>`;
}

export function brandMark(className = 'brand-mark'): Markup {
  return html`<svg class="${className}" viewBox="${LOGO.mark.viewBox}" aria-hidden="true" focusable="false"><use href="#pos-mark"/></svg>`;
}

export function brandWordmark(className = 'brand-word'): Markup {
  return html`<svg class="${className}" viewBox="${LOGO.wordmark.viewBox}" aria-hidden="true" focusable="false"><use href="#pos-wordmark"/></svg>`;
}

export function brandLockup(href: string, label = 'POSIDONIA — home'): Markup {
  return html`<a class="brand" href="${href}" aria-label="${label}">
    ${brandMark()}
    ${brandWordmark()}
  </a>`;
}

/** Mark as standalone SVG markup (favicon, downloadable logo, social image). */
export function standaloneMark(variant: 'color' | 'reversed' = 'color'): string {
  const rev = variant === 'reversed';
  return `<defs>
    <linearGradient id="l" x1="1" y1="0" x2="0.15" y2="1"><stop offset="0" stop-color="${rev ? c.revLeafLight : c.leafLight}"/><stop offset="1" stop-color="${rev ? c.revLeafDark : c.leafDark}"/></linearGradient>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${rev ? c.revWaveLight : c.waveLight}"/><stop offset="1" stop-color="${rev ? c.revWaveDark : c.waveDark}"/></linearGradient>
  </defs>
  <path d="${LOGO.mark.leaves}" fill="url(#l)"/>
  <path d="${LOGO.mark.wave}" fill="url(#w)"/>`;
}
