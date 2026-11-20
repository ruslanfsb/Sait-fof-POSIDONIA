/**
 * Hero visual: an abstract Posidonia meadow — ribbon-like leaf blades
 * swaying in a slow current, with suspended particles.
 * Pauses when off-screen or the tab is hidden; renders a single still
 * frame when the visitor prefers reduced motion.
 */

interface Blade {
  x: number;
  len: number;
  width: number;
  phase: number;
  speed: number;
  amp: number;
  lean: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  drift: number;
  alpha: number;
}

const BACK = [32, 91, 82];
const FRONT = [140, 184, 164];

function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(a: number[], b: number[], t: number, alpha: number): string {
  const c = a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * t));
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`;
}

export function initHeroCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let blades: Blade[] = [];
  let particles: Particle[] = [];
  let frame = 0;
  let visible = true;
  let start = performance.now();

  const build = (): void => {
    const rand = mulberry(42);
    const count = Math.round(Math.min(130, Math.max(38, width / 11)));
    const narrow = width < 700;
    blades = [];
    // Blades grow in tufts; denser and taller toward the right so the text stays legible.
    const tufts = Math.round(count / 5);
    for (let t = 0; t < tufts; t++) {
      const bias = narrow ? rand() : Math.pow(rand(), 0.6);
      const cx = bias * width * 1.05 - width * 0.02;
      const n = 3 + Math.floor(rand() * 5);
      for (let i = 0; i < n; i++) {
        const depth = rand();
        const rightBoost = narrow ? 0.85 : 0.55 + (cx / width) * 0.6;
        blades.push({
          x: cx + (rand() - 0.5) * 34,
          len: height * (0.22 + rand() * 0.42) * rightBoost * (0.75 + depth * 0.4),
          width: (narrow ? 4 : 5) + depth * (narrow ? 5 : 8),
          phase: rand() * Math.PI * 2,
          speed: 0.25 + rand() * 0.3,
          amp: 0.05 + rand() * 0.08,
          lean: 0.06 + rand() * 0.16,
          color: mix(BACK, FRONT, depth * 0.85, 0.16 + depth * 0.42),
        });
      }
    }
    blades.sort((a, b) => a.width - b.width);

    particles = Array.from({ length: narrow ? 26 : 54 }, () => ({
      x: rand() * width,
      y: rand() * height,
      r: 0.6 + rand() * 1.6,
      vy: 4 + rand() * 9,
      drift: rand() * Math.PI * 2,
      alpha: 0.12 + rand() * 0.35,
    }));
  };

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    draw(reducedMotion.matches ? 0 : (performance.now() - start) / 1000);
  };

  const SEGMENTS = 16;
  const left: [number, number][] = Array.from({ length: SEGMENTS + 1 }, () => [0, 0]);
  const right: [number, number][] = Array.from({ length: SEGMENTS + 1 }, () => [0, 0]);

  const drawBlade = (b: Blade, time: number): void => {
    const baseY = height + 6;
    let px = b.x;
    let py = baseY;
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = i / SEGMENTS;
      const sway = Math.sin(time * b.speed + b.phase - s * 1.8) * b.amp * Math.pow(s, 1.4);
      const x = b.x + (b.lean * s * s + sway) * b.len;
      const y = baseY - b.len * s;
      // Direction of the centre line → normal for the ribbon edges
      const dx = i === 0 ? 0 : x - px;
      const dy = i === 0 ? -1 : y - py;
      const m = Math.hypot(dx, dy) || 1;
      const nx = -dy / m;
      const ny = dx / m;
      // Near-constant ribbon width with a rounded tip, like a Posidonia leaf
      const taper = s < 0.86 ? 1 - s * 0.25 : 0.785 * Math.sqrt((1 - s) / 0.14);
      const w = (b.width / 2) * Math.max(0, taper);
      left[i] = [x + nx * w, y + ny * w];
      right[i] = [x - nx * w, y - ny * w];
      px = x;
      py = y;
    }
    ctx.beginPath();
    ctx.moveTo(left[0]![0], left[0]![1]);
    for (let i = 1; i <= SEGMENTS; i++) ctx.lineTo(left[i]![0], left[i]![1]);
    for (let i = SEGMENTS; i >= 0; i--) ctx.lineTo(right[i]![0], right[i]![1]);
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();
  };

  const draw = (time: number): void => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      const y = (((p.y - time * p.vy) % height) + height) % height;
      const x = p.x + Math.sin(time * 0.3 + p.drift) * 12;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,224,207,${p.alpha})`;
      ctx.fill();
    }
    for (const b of blades) drawBlade(b, time);
  };

  const loop = (now: number): void => {
    draw((now - start) / 1000);
    frame = requestAnimationFrame(loop);
  };

  const play = (): void => {
    if (frame || reducedMotion.matches || !visible || document.hidden) return;
    frame = requestAnimationFrame(loop);
  };

  const pause = (): void => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) play();
    else pause();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      pause();
      draw(0);
    } else {
      start = performance.now();
      play();
    }
  });

  resize();
  play();
}
