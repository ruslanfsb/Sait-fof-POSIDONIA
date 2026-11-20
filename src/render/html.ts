/**
 * Minimal, dependency-free HTML templating for build-time rendering.
 * Interpolated values are escaped unless wrapped with `raw()` or produced by `html```.
 */

export class Markup {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

/** Trusts the given string as markup. Use only for author-controlled strings. */
export function raw(value: string): Markup {
  return new Markup(value);
}

type Value = Markup | string | number | boolean | null | undefined | Value[];

function serialize(value: Value): string {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (value instanceof Markup) return value.value;
  if (Array.isArray(value)) return value.map(serialize).join('');
  return escapeHtml(String(value));
}

export function html(strings: TemplateStringsArray, ...values: Value[]): Markup {
  let out = strings[0] ?? '';
  values.forEach((value, i) => {
    out += serialize(value) + (strings[i + 1] ?? '');
  });
  return new Markup(out);
}

/** Deterministic pseudo-random generator so generated artwork is stable between builds. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const round = (n: number): number => Math.round(n * 10) / 10;

export const pad2 = (n: number): string => String(n).padStart(2, '0');
