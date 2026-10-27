import React from 'react';
import type { ShapeKey } from '@/lib/product-infographics';

const VIEW_W = 64;
const VIEW_H = 48;
const MAX_W = 56;
const MAX_H = 40;

/** Landscape box for a side ratio (short/long), centred in the viewBox. */
function fitBox(ratio: number) {
  let w = MAX_W;
  let h = MAX_W * ratio;
  if (h > MAX_H) {
    h = MAX_H;
    w = MAX_H / ratio;
  }
  return { x: (VIEW_W - w) / 2, y: (VIEW_H - h) / 2, w, h };
}

/** Rectangle whose edges are rows of outward semicircles. */
function scallopPath(x: number, y: number, w: number, h: number): string {
  const size = 6;
  const nx = Math.max(2, Math.round(w / size));
  const ny = Math.max(2, Math.round(h / size));
  const sx = w / nx;
  const sy = h / ny;
  const r = (s: number) => (s / 2).toFixed(2);
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(x)} ${f(y)}`;
  for (let i = 1; i <= nx; i++) d += ` A${r(sx)} ${r(sx)} 0 0 1 ${f(x + i * sx)} ${f(y)}`;
  for (let i = 1; i <= ny; i++) d += ` A${r(sy)} ${r(sy)} 0 0 1 ${f(x + w)} ${f(y + i * sy)}`;
  for (let i = 1; i <= nx; i++) d += ` A${r(sx)} ${r(sx)} 0 0 1 ${f(x + w - i * sx)} ${f(y + h)}`;
  for (let i = 1; i <= ny; i++) d += ` A${r(sy)} ${r(sy)} 0 0 1 ${f(x)} ${f(y + h - i * sy)}`;
  return `${d} Z`;
}

interface ShapeSilhouetteProps {
  shape: ShapeKey;
  /** Short side / long side of the selected size, when known. */
  ratio?: number;
  className?: string;
}

/** Decorative outline of the rug's shape; the visible label carries the meaning. */
export const ShapeSilhouette: React.FC<ShapeSilhouetteProps> = ({ shape, ratio, className = 'w-16 h-12' }) => {
  const fallback = shape === 'runner' ? 0.3 : 0.67;
  const r = Math.min(1, Math.max(0.2, ratio ?? fallback));
  const common = {
    fill: 'var(--sukla-sand)',
    stroke: 'var(--sukla-charcoal)',
    strokeWidth: 1.5,
    strokeLinejoin: 'round' as const
  };

  let body: React.ReactNode;
  switch (shape) {
    case 'square': {
      const s = MAX_H;
      body = <rect x={(VIEW_W - s) / 2} y={(VIEW_H - s) / 2} width={s} height={s} {...common} />;
      break;
    }
    case 'round':
      body = <circle cx={VIEW_W / 2} cy={VIEW_H / 2} r={MAX_H / 2} {...common} />;
      break;
    case 'oval':
      body = <ellipse cx={VIEW_W / 2} cy={VIEW_H / 2} rx={MAX_W / 2} ry={MAX_H / 2.6} {...common} />;
      break;
    case 'scalloped': {
      // Inset so the outward scallops stay inside the viewBox.
      const box = fitBox(r);
      const inset = 3;
      body = (
        <path d={scallopPath(box.x + inset, box.y + inset, box.w - inset * 2, box.h - inset * 2)} {...common} />
      );
      break;
    }
    case 'irregular':
      body = (
        <path
          d="M10 18C8 10 18 5 27 8s14-4 22 1 8 14 3 20-4 12-14 12-14-3-22-5S12 26 10 18Z"
          {...common}
        />
      );
      break;
    case 'other':
      body = (
        <rect x={8} y={8} width={48} height={32} rx={6} {...common} strokeDasharray="3 3" />
      );
      break;
    default: {
      // rectangle and runner: proportions follow the selected size.
      const box = fitBox(r);
      body = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={1} {...common} />;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {body}
    </svg>
  );
};
