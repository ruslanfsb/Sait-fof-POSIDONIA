/**
 * Generated SVG artwork. Everything here is conceptual illustration —
 * deterministic (seeded) so builds are reproducible, and lightweight (no image files).
 */
import type { ProcessIcon, ProductArt } from '../content/site.ts';
import { html, raw, round as r, seeded, type Markup } from './html.ts';

const C = {
  green: '#123F37',
  teal: '#205B52',
  sea: '#8CB8A4',
  sand: '#E8E0CF',
  paper: '#F7F7F2',
  ink: '#202724',
  fiberDark: '#5E5640',
  fiber: '#8A7D5C',
  fiberLight: '#B3A684',
};

const pick = <T>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;

/* ------------------------------------------------------------------ */
/* Isometric helpers                                                   */
/* ------------------------------------------------------------------ */

function isoProjector(cx: number, cy: number, s: number) {
  const cos = Math.cos(Math.PI / 6);
  return (x: number, y: number, z: number): [number, number] => [
    cx + (x - y) * cos * s,
    cy + (x + y) * 0.5 * s - z * s,
  ];
}

type Pt = [number, number];
const poly = (pts: Pt[]): string => pts.map(([x, y]) => `${r(x)},${r(y)}`).join(' ');

/* ------------------------------------------------------------------ */
/* Product artwork                                                     */
/* ------------------------------------------------------------------ */

function looseFillArt(): Markup {
  const rand = seeded(11);
  const base = 268;
  const strokes: string[] = [];
  const colors = [C.fiberDark, C.fiber, C.fiber, C.fiberLight, C.teal];
  for (let i = 0; i < 260; i++) {
    const x = 60 + rand() * 360;
    const t = (x - 240) / 180;
    const height = 150 * Math.sqrt(Math.max(0, 1 - t * t));
    const y = base - rand() * height;
    const len = 12 + rand() * 26;
    const a = rand() * Math.PI * 2;
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len * 0.6;
    const bend = (rand() - 0.5) * 18;
    const mx = (x + x2) / 2 + Math.sin(a) * bend;
    const my = (y + y2) / 2 - Math.cos(a) * bend;
    strokes.push(
      `<path d="M${r(x)} ${r(y)}Q${r(mx)} ${r(my)} ${r(x2)} ${r(y2)}" stroke="${pick(rand, colors)}" stroke-width="${r(0.9 + rand() * 1.6)}" opacity="${r(0.55 + rand() * 0.45)}"/>`,
    );
  }
  // A few fibers lifted above the pile, suggesting the loose, open structure.
  for (let i = 0; i < 14; i++) {
    const x = 120 + rand() * 240;
    const y = 70 + rand() * 60;
    const a = rand() * Math.PI;
    const len = 10 + rand() * 16;
    strokes.push(
      `<path d="M${r(x)} ${r(y)}q${r(Math.cos(a) * len * 0.5)} ${r(-6 + rand() * 12)} ${r(Math.cos(a) * len)} ${r(Math.sin(a) * len * 0.4)}" stroke="${C.fiber}" stroke-width="1.1" opacity=".5"/>`,
    );
  }
  return html`<g fill="none" stroke-linecap="round" class="art-drift">${raw(strokes.join(''))}</g>
    <path d="M40 ${base + 4}H440" stroke="${C.ink}" stroke-opacity=".25" stroke-width="1"/>`;
}

function boardsArt(): Markup {
  const rand = seeded(23);
  const P = isoProjector(232, 126, 32);
  const W = 6;
  const D = 4;
  const H = 0.62;
  const out: string[] = [];
  const layers = [
    { z: 0, dx: -0.35 },
    { z: 0.95, dx: 0 },
    { z: 1.9, dx: 0.35 },
  ];
  for (const { z, dx } of layers) {
    const x0 = dx;
    const y0 = 0;
    const top: Pt[] = [P(x0, y0, z + H), P(x0 + W, y0, z + H), P(x0 + W, y0 + D, z + H), P(x0, y0 + D, z + H)];
    const left: Pt[] = [P(x0, y0 + D, z + H), P(x0 + W, y0 + D, z + H), P(x0 + W, y0 + D, z), P(x0, y0 + D, z)];
    const right: Pt[] = [P(x0 + W, y0, z + H), P(x0 + W, y0 + D, z + H), P(x0 + W, y0 + D, z), P(x0 + W, y0, z)];
    out.push(`<polygon points="${poly(left)}" fill="#B5A985"/>`);
    out.push(`<polygon points="${poly(right)}" fill="#9C9070"/>`);
    out.push(`<polygon points="${poly(top)}" fill="#D9CFB4"/>`);
    // fiber texture on the top face
    for (let i = 0; i < 70; i++) {
      const u = x0 + 0.2 + rand() * (W - 0.4);
      const v = y0 + 0.2 + rand() * (D - 0.4);
      const a = rand() * Math.PI;
      const l = 0.12 + rand() * 0.28;
      const [ax, ay] = P(u, v, z + H);
      const [bx, by] = P(u + Math.cos(a) * l, v + Math.sin(a) * l, z + H);
      out.push(
        `<path d="M${r(ax)} ${r(ay)}L${r(bx)} ${r(by)}" stroke="${pick(rand, [C.fiberDark, C.fiber])}" stroke-width="${r(0.8 + rand() * 0.8)}" opacity="${r(0.35 + rand() * 0.4)}"/>`,
      );
    }
    // layered edge texture on the front faces
    for (let i = 0; i < 26; i++) {
      const u = x0 + rand() * (W - 0.3);
      const h = z + 0.1 + rand() * (H - 0.2);
      const [ax, ay] = P(u, y0 + D, h);
      const [bx, by] = P(u + 0.2 + rand() * 0.35, y0 + D, h);
      out.push(`<path d="M${r(ax)} ${r(ay)}L${r(bx)} ${r(by)}" stroke="${C.fiberDark}" stroke-width=".9" opacity=".45"/>`);
    }
    for (let i = 0; i < 16; i++) {
      const v = y0 + rand() * (D - 0.3);
      const h = z + 0.1 + rand() * (H - 0.2);
      const [ax, ay] = P(x0 + W, v, h);
      const [bx, by] = P(x0 + W, v + 0.2 + rand() * 0.3, h);
      out.push(`<path d="M${r(ax)} ${r(ay)}L${r(bx)} ${r(by)}" stroke="${C.ink}" stroke-width=".9" opacity=".35"/>`);
    }
  }
  return html`<g stroke-linecap="round" class="art-lift">${raw(out.join(''))}</g>`;
}

function ecoPlasticArt(): Markup {
  const rand = seeded(61);
  const out: string[] = [];

  // Molded sheet sample behind the pellets
  const P = isoProjector(170, 92, 34);
  const W = 5.2;
  const D = 3.4;
  const H = 0.2;
  const top: Pt[] = [P(0, 0, H), P(W, 0, H), P(W, D, H), P(0, D, H)];
  const left: Pt[] = [P(0, D, H), P(W, D, H), P(W, D, 0), P(0, D, 0)];
  const right: Pt[] = [P(W, 0, H), P(W, D, H), P(W, D, 0), P(W, 0, 0)];
  out.push(`<polygon points="${poly(left)}" fill="#C4B898"/>`);
  out.push(`<polygon points="${poly(right)}" fill="#B2A585"/>`);
  out.push(`<polygon points="${poly(top)}" fill="#E4DCC8"/>`);
  for (let i = 0; i < 80; i++) {
    const [x, y] = P(0.15 + rand() * (W - 0.3), 0.15 + rand() * (D - 0.3), H);
    const a = rand() * Math.PI;
    const l = 3 + rand() * 6;
    out.push(
      `<path d="M${r(x)} ${r(y)}l${r(Math.cos(a) * l)} ${r(Math.sin(a) * l * 0.5)}" stroke="${pick(rand, [C.fiberDark, C.fiber, C.teal])}" stroke-width=".9" opacity="${r(0.35 + rand() * 0.4)}"/>`,
    );
  }

  // Heap of compounded pellets in front
  const base = 268;
  const pellets: { x: number; y: number }[] = [];
  for (let i = 0; i < 64; i++) {
    const x = 300 + (rand() - 0.5) * 280;
    const t = (x - 300) / 140;
    const y = base - rand() * 92 * Math.sqrt(Math.max(0, 1 - t * t));
    pellets.push({ x, y });
  }
  pellets.sort((a, b) => a.y - b.y);
  for (const { x, y } of pellets) {
    const rx = 10.5 + rand() * 3;
    const ry = 7.5 + rand() * 1.5;
    const rot = r((rand() - 0.5) * 50);
    const fill = pick(rand, ['#E2D9C2', '#D6CCB0', '#CBBF9F', '#E9E1CD', '#C2B694']);
    const specks = Array.from({ length: 3 }, () =>
      `<circle cx="${r((rand() - 0.5) * rx * 1.2)}" cy="${r((rand() - 0.2) * ry * 0.9)}" r=".9" fill="${pick(rand, [C.fiberDark, C.teal])}" opacity=".55"/>`,
    ).join('');
    out.push(
      `<g transform="translate(${r(x)} ${r(y)}) rotate(${rot})"><ellipse rx="${r(rx)}" ry="${r(ry)}" fill="${fill}" stroke="${C.ink}" stroke-opacity=".2" stroke-width=".8"/><ellipse cx="${r(-rx * 0.28)}" cy="${r(-ry * 0.38)}" rx="${r(rx * 0.42)}" ry="${r(ry * 0.26)}" fill="#fff" opacity=".45"/>${specks}</g>`,
    );
  }
  out.push(`<path d="M40 ${base + 8}H440" stroke="${C.ink}" stroke-opacity=".25" stroke-width="1"/>`);
  return html`<g stroke-linecap="round" class="art-drift">${raw(out.join(''))}</g>`;
}

const PRODUCT_ART: Record<ProductArt, () => Markup> = {
  loosefill: looseFillArt,
  boards: boardsArt,
  ecoplastic: ecoPlasticArt,
};

export function productArt(kind: ProductArt): Markup {
  return html`<svg class="product-art" viewBox="0 0 480 320" role="presentation" aria-hidden="true" focusable="false">
    ${PRODUCT_ART[kind]()}
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Ecosystem diagram                                                   */
/* ------------------------------------------------------------------ */

const SEABED: Pt[] = [
  [0, 492],
  [160, 486],
  [330, 476],
  [500, 458],
  [620, 420],
  [720, 350],
  [800, 262],
  [850, 205],
  [884, 172],
];

function seabedY(x: number): number {
  for (let i = 0; i < SEABED.length - 1; i++) {
    const [x1, y1] = SEABED[i] as Pt;
    const [x2, y2] = SEABED[i + 1] as Pt;
    if (x >= x1 && x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return 172;
}

const WATER_Y = 172;
const beachY = (x: number): number => WATER_Y - ((x - 884) * 46) / 316;

function marker(n: number, x: number, y: number, tx: number, ty: number): string {
  return `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${C.green}" stroke-width="1.2" stroke-dasharray="2 4"/>
    <g class="diagram-marker" data-step="${n}"><circle cx="${x}" cy="${y}" r="19" fill="${C.green}"/>
    <text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Manrope Variable, Manrope, sans-serif" font-size="17" font-weight="600" fill="${C.paper}">${n}</text></g>`;
}

export function ecosystemDiagram(title: string): Markup {
  const rand = seeded(7);
  const parts: string[] = [];

  // Water body
  const seabedPath = SEABED.map(([x, y]) => `${x},${y}`).join(' L');
  const reversed = [...SEABED].reverse().map(([x, y]) => `${x},${y}`).join(' L');
  parts.push(`<path d="M0,${WATER_Y} L884,${WATER_Y} L${reversed} Z" fill="url(#dg-water)"/>`);

  // Light shafts
  for (let i = 0; i < 5; i++) {
    const x = 90 + i * 150 + rand() * 40;
    parts.push(
      `<path d="M${r(x)} ${WATER_Y}L${r(x + 50)} ${WATER_Y}L${r(x + 140)} 470L${r(x + 70)} 470Z" fill="${C.paper}" opacity=".07"/>`,
    );
  }

  // Ground (seabed + beach)
  parts.push(
    `<path d="M${seabedPath} L1200,${r(beachY(1200))} L1200,520 L0,520 Z" fill="#DCD1B8"/>`,
    `<path d="M${seabedPath} L1200,${r(beachY(1200))}" fill="none" stroke="${C.ink}" stroke-opacity=".35" stroke-width="1.2"/>`,
  );

  // Water surface
  let surface = `M0 ${WATER_Y}`;
  for (let x = 0; x <= 884; x += 34) {
    surface += ` Q${x + 8.5} ${WATER_Y - 4} ${x + 17} ${WATER_Y} T${x + 34} ${WATER_Y}`;
  }
  parts.push(`<path d="${surface}" fill="none" stroke="${C.teal}" stroke-width="1.5"/>`);

  // Rhizome mat
  parts.push(
    `<path d="M40 ${r(seabedY(40) - 3)} C200 ${r(seabedY(200) + 2)} 380 ${r(seabedY(380) - 6)} 568 ${r(seabedY(568) - 2)}" stroke="#6E5F43" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`,
  );

  // Meadow
  const blades: string[] = [];
  for (let i = 0; i < 120; i++) {
    const x = 40 + rand() * 530;
    const y = seabedY(x) - 2;
    const h = 70 + rand() * 80 - Math.max(0, x - 480) * 0.6;
    const bend = 10 + rand() * 30;
    const color = pick(rand, [C.green, C.teal, '#2D6B5F', '#3E7D6E']);
    blades.push(
      `<path d="M${r(x)} ${r(y)}Q${r(x + bend * 0.2)} ${r(y - h * 0.55)} ${r(x + bend)} ${r(y - h)}" stroke="${color}" stroke-width="${r(3 + rand() * 2.4)}"/>`,
    );
  }
  parts.push(`<g class="diagram-meadow" fill="none" stroke-linecap="round">${blades.join('')}</g>`);

  // Detached leaves drifting toward the shore
  const drift: string[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 560 + rand() * 280;
    const y = 200 + rand() * 120;
    const a = (rand() - 0.5) * 70;
    drift.push(
      `<path d="M${r(x)} ${r(y)}q14 -6 30 -2" transform="rotate(${r(a)} ${r(x + 15)} ${r(y)})" stroke="${pick(rand, ['#7A6B4C', '#8E8060', '#5D6B4E'])}" stroke-width="3.2"/>`,
    );
  }
  parts.push(`<g fill="none" stroke-linecap="round">${drift.join('')}</g>`);

  // Transport arrow
  parts.push(
    `<path d="M430 300 C560 220 760 150 902 142" fill="none" stroke="${C.green}" stroke-width="1.4" stroke-dasharray="6 7"/>`,
    `<path d="M892 135 L904 142 L892 149" fill="none" stroke="${C.green}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  );

  // Banquette (stacked leaf layers on the beach)
  const bq: string[] = [];
  for (let layer = 0; layer < 7; layer++) {
    const x1 = 912 + layer * 4;
    const x2 = 1052 - layer * 5;
    const yb = beachY((x1 + x2) / 2) - layer * 4.2;
    bq.push(
      `<path d="M${x1} ${r(beachY(x1) - layer * 1.5)} Q${r((x1 + x2) / 2)} ${r(yb - 16)} ${x2} ${r(beachY(x2) - layer * 1.2)}" stroke="${pick(rand, ['#6F6248', '#857756', '#9A8C69', '#5E5640'])}" stroke-width="${r(2.6 + rand() * 1.4)}"/>`,
    );
  }
  parts.push(`<g fill="none" stroke-linecap="round">${bq.join('')}</g>`);

  // Neptune balls
  for (let i = 0; i < 4; i++) {
    const x = 1066 + i * 15 + rand() * 4;
    const rad = 4.5 + rand() * 2.5;
    parts.push(
      `<circle cx="${r(x)}" cy="${r(beachY(x) - rad)}" r="${r(rad)}" fill="#7E7050"/><path d="M${r(x - rad * 0.6)} ${r(beachY(x) - rad)}h${r(rad * 1.2)}" stroke="#5E5640" stroke-width=".8"/>`,
    );
  }

  // Research: sample cube
  const P = isoProjector(1142, 84, 13);
  const top: Pt[] = [P(0, 0, 2), P(2, 0, 2), P(2, 2, 2), P(0, 2, 2)];
  const left: Pt[] = [P(0, 2, 2), P(2, 2, 2), P(2, 2, 0), P(0, 2, 0)];
  const right: Pt[] = [P(2, 0, 2), P(2, 2, 2), P(2, 2, 0), P(2, 0, 0)];
  parts.push(
    `<polygon points="${poly(left)}" fill="#C9BB97" stroke="${C.green}" stroke-width="1.2"/>`,
    `<polygon points="${poly(right)}" fill="#B3A47E" stroke="${C.green}" stroke-width="1.2"/>`,
    `<polygon points="${poly(top)}" fill="#E4DAC2" stroke="${C.green}" stroke-width="1.2"/>`,
  );
  const [bx, by] = P(2, 2, 0);
  parts.push(`<path d="M${r(bx - 34)} ${r(by + 6)}H${r(bx + 34)}" stroke="${C.green}" stroke-width="1.4" stroke-linecap="round"/>`);

  // Markers
  parts.push(
    marker(1, 290, 300, 290, 352),
    marker(2, 690, 236, 690, 262),
    marker(3, 982, 70, 982, 128),
    marker(4, 1142, 36, 1142, 58),
  );

  return html`<svg class="ecosystem-diagram" viewBox="0 0 1200 520" role="img" aria-labelledby="dg-title" focusable="false">
    <title id="dg-title">${title}</title>
    <defs>
      <linearGradient id="dg-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.sea}" stop-opacity=".55"/>
        <stop offset="1" stop-color="${C.teal}" stop-opacity=".55"/>
      </linearGradient>
    </defs>
    ${raw(parts.join(''))}
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Line icons (24 × 24)                                                */
/* ------------------------------------------------------------------ */

const ICONS: Record<ProcessIcon, string> = {
  sourcing:
    '<path d="M2 18c2.5 0 2.5-1.8 5-1.8s2.5 1.8 5 1.8 2.5-1.8 5-1.8 2.5 1.8 5 1.8"/><path d="M12 13.5C11.5 8.6 13.6 5 18.5 3.5c.6 4.8-1.6 8.4-6.5 10Z"/><path d="M12 13.5c1.2-2.6 2.7-4.4 4.5-5.6"/>',
  preparation:
    '<path d="M12 3.2s5.6 6 5.6 10.1a5.6 5.6 0 0 1-11.2 0C6.4 9.2 12 3.2 12 3.2Z"/><path d="M9.2 14.2a2.8 2.8 0 0 0 2.8 2.6"/><path d="M4 21h16"/>',
  fiber:
    '<path d="M3 7c3.5 0 5 2.6 9 2.6S17.5 7 21 7"/><path d="M3 12c3.5 0 5 2.6 9 2.6s5.5-2.6 9-2.6"/><path d="M3 17c3.5 0 5 2.6 9 2.6s5.5-2.6 9-2.6"/>',
  product: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/>',
  testing:
    '<path d="M9 3h6"/><path d="M10 3v6.2L5 18.4A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M7.2 15h9.6"/>',
  manufacturing:
    '<path d="M3 21V10.5l5 3v-3l5 3v-3l5 3V4h3v17H3Z"/><path d="M7 17.5h2"/><path d="M12 17.5h2"/>',
};

export function processIcon(name: ProcessIcon): Markup {
  return html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${raw(ICONS[name])}</svg>`;
}

export function arrowIcon(): Markup {
  return html`<svg class="icon-arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12"/><path d="m11 5 5 5-5 5"/></svg>`;
}

export function externalIcon(): Markup {
  return html`<svg class="icon-ext" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3H3v10h10v-3"/><path d="M9 3h4v4"/><path d="M13 3 7.5 8.5"/></svg>`;
}
