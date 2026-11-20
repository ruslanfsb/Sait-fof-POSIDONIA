/**
 * Generates brand assets in /public from the same brand mark used on the site:
 *   favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png, og-image.png
 * Run after changing the logo:  npm run assets
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const pub = (f) => resolve(root, 'public', f);

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { MARK_PATHS } = await vite.ssrLoadModule('/src/render/brand.ts');
await vite.close();

const GREEN = '#123F37';
const SEA = '#8CB8A4';
const PAPER = '#F7F7F2';

const markGroup = (color) => `
  <path d="${MARK_PATHS.left}" fill="${color}" opacity=".72"/>
  <path d="${MARK_PATHS.right}" fill="${color}" opacity=".72"/>
  <path d="${MARK_PATHS.center}" fill="${color}"/>
  <path d="${MARK_PATHS.shaft}" stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;

// Square icon: mark centred on a deep-green tile.
// (iOS rounds the corners of apple-touch-icon itself, so that one stays square.)
const iconSvg = (radius = 14) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${GREEN}"/>
  <g transform="translate(12 7.5)">${markGroup(SEA)}</g>
</svg>`;
writeFileSync(pub('favicon.svg'), iconSvg());

writeFileSync(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: 'POSIDONIA',
      short_name: 'POSIDONIA',
      icons: [
        { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: GREEN,
      background_color: GREEN,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

// Fonts are embedded as data URLs (a page created with setContent cannot load file:// URLs).
const dataUrl = (path) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, 'node_modules', path)).toString('base64')}`;
const manrope = dataUrl('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');
const mono = dataUrl('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2');

// Deterministic meadow for the social image
let seed = 9;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
let blades = '';
for (let i = 0; i < 70; i++) {
  const x = 520 + Math.pow(rand(), 0.7) * 720;
  const h = 180 + rand() * 330 * ((x - 420) / 800);
  const bend = 30 + rand() * 90;
  const w = 6 + rand() * 12;
  const a = 0.18 + rand() * 0.45;
  blades += `<path d="M${x} 650 Q${x + bend * 0.25} ${650 - h * 0.55} ${x + bend} ${650 - h}" stroke="rgba(140,184,164,${a.toFixed(2)})" stroke-width="${w.toFixed(1)}" stroke-linecap="round" fill="none"/>`;
}

const ogHtml = `<!doctype html><html><head><style>
@font-face { font-family: Manrope; src: url(${manrope}) format('woff2-variations'); font-weight: 200 800; }
@font-face { font-family: Plex; src: url(${mono}) format('woff2'); }
html, body { margin: 0; }
.og { position: relative; width: 1200px; height: 630px; overflow: hidden; background: ${GREEN}; color: ${PAPER}; font-family: Manrope; }
.og svg.meadow { position: absolute; inset: 0; }
.shade { position: absolute; inset: 0; background: radial-gradient(70% 70% at 90% 0%, rgba(140,184,164,.28), transparent 65%), linear-gradient(90deg, rgba(18,63,55,.95) 0%, rgba(18,63,55,.55) 55%, rgba(18,63,55,0) 85%); }
.content { position: absolute; left: 80px; top: 72px; bottom: 72px; display: flex; flex-direction: column; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 16px; font-weight: 650; font-size: 26px; letter-spacing: .2em; }
.brand svg { width: 34px; height: 41px; }
h1 { margin: 0; font-weight: 500; font-size: 76px; line-height: 1; letter-spacing: -.04em; max-width: 820px; }
h1 span { color: ${SEA}; display: block; }
p { margin: 0; font-family: Plex; font-size: 20px; color: rgba(247,247,242,.72); }
</style></head><body><div class="og">
<svg class="meadow" viewBox="0 0 1200 630" width="1200" height="630">${blades}</svg>
<div class="shade"></div>
<div class="content">
  <div class="brand"><svg viewBox="0 0 40 48">${markGroup(SEA)}</svg>POSIDONIA</div>
  <h1>From the Mediterranean.<span>For a Sustainable Future.</span></h1>
  <p>Sustainable materials from Mediterranean seagrass · Cyprus</p>
</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.setContent(ogHtml, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.locator('.og').screenshot({ path: pub('og-image.png') });

for (const [file, size, radius] of [
  ['favicon-32.png', 32, 14],
  ['apple-touch-icon.png', 180, 0],
  ['icon-512.png', 512, 14],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${iconSvg(radius).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  await page.locator('svg').screenshot({ path: pub(file), omitBackground: true });
}

await browser.close();
console.log('Generated:', ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-512.png', 'og-image.png', 'site.webmanifest'].join(', '));
