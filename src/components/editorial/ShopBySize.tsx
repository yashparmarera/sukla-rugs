import React from 'react';
import Link from 'next/link';

/**
 * Shop by Size: four clickable top-down room diagrams. Each shows the same
 * kind of furniture grouping over a rug of increasing size. All tiles link to
 * the full shop until size filtering is wired up.
 */

// Theme palette: tile = --sukla-terracotta, rug = deeper walnut derived from
// --sukla-terracotta-dark, furniture = --sukla-cream, outlines = --sukla-charcoal.
const TILE_BG = 'var(--sukla-terracotta)';
const RUG = '#6B4A2B';
const RUG_BORDER = 'var(--sukla-cream)';
const FURN = 'var(--sukla-cream)';

type SizeTile = {
  key: string;
  label: string;
  sizes: string;
  diagram: React.ReactNode;
};

const stroke = { stroke: 'var(--sukla-charcoal)', strokeWidth: 1.6, strokeLinejoin: 'round' as const };

const Sofa: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 26 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={4} fill={FURN} {...stroke} />
    <rect x={x + 3} y={y + 3} width={w - 6} height={h - 12} rx={3} fill="none" {...stroke} />
  </g>
);

const Armchair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 30 }) => (
  <g>
    <rect x={x} y={y} width={s} height={s} rx={5} fill={FURN} {...stroke} />
    <rect x={x + 4} y={y + 4} width={s - 8} height={s - 14} rx={3} fill="none" {...stroke} />
  </g>
);

const Table: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <circle cx={cx} cy={cy} r={r} fill={FURN} {...stroke} />
);

const DIAGRAMS: SizeTile[] = [
  {
    key: 'small',
    label: 'Small',
    sizes: '2x3, 3x5',
    diagram: (
      <>
        <rect x={34} y={78} width={52} height={40} fill={RUG} />
        <Armchair x={30} y={44} s={42} />
        <Table cx={104} cy={72} r={10} />
      </>
    ),
  },
  {
    key: 'medium',
    label: 'Medium',
    sizes: '4x6, 5x8, 6x9',
    diagram: (
      <>
        <rect x={22} y={36} width={116} height={86} fill={RUG} stroke={RUG_BORDER} strokeWidth={2} />
        <rect x={27} y={41} width={106} height={76} fill="none" stroke={RUG_BORDER} strokeWidth={1} />
        <Sofa x={36} y={24} w={64} />
        <rect x={50} y={72} width={36} height={18} rx={2} fill={FURN} {...stroke} />
        <Armchair x={106} y={50} s={30} />
      </>
    ),
  },
  {
    key: 'large',
    label: 'Large',
    sizes: '8x10, 9x12, 10x14',
    diagram: (
      <>
        <rect x={20} y={32} width={120} height={92} fill={RUG} />
        <Sofa x={42} y={18} w={76} h={22} />
        <rect x={14} y={62} width={28} height={30} rx={3} fill={FURN} {...stroke} />
        <rect x={118} y={62} width={28} height={30} rx={3} fill={FURN} {...stroke} />
        <rect x={64} y={70} width={32} height={16} rx={2} fill={FURN} {...stroke} />
      </>
    ),
  },
  {
    key: 'oversized',
    label: 'Oversized',
    sizes: '12x15 & above',
    diagram: (
      <>
        <rect x={20} y={26} width={128} height={100} fill={RUG} />
        <path
          d="M12 22 H92 V44 H34 V92 H12 Z"
          fill={FURN}
          {...stroke}
        />
        <circle cx={80} cy={86} r={15} fill={FURN} {...stroke} />
        <rect x={112} y={34} width={30} height={70} rx={3} fill={FURN} {...stroke} />
        <g fill={FURN} {...stroke}>
          <circle cx={108} cy={44} r={4} />
          <circle cx={108} cy={60} r={4} />
          <circle cx={108} cy={76} r={4} />
          <circle cx={108} cy={92} r={4} />
          <circle cx={146} cy={44} r={4} />
          <circle cx={146} cy={60} r={4} />
          <circle cx={146} cy={76} r={4} />
          <circle cx={146} cy={92} r={4} />
        </g>
      </>
    ),
  },
];

export const ShopBySize: React.FC = () => {
  return (
    <section
      aria-labelledby="shop-by-size-heading"
      className="py-20 bg-[var(--sukla-ivory)] border-b border-[var(--sukla-muted-border)]"
    >
      <div className="editorial-container">
        <div className="flex flex-col items-center text-center mb-12">
          <h2
            id="shop-by-size-heading"
            className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]"
          >
            <span className="relative inline-block cursor-default pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--sukla-charcoal)] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
              Shop by Size
            </span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {DIAGRAMS.map((tile) => (
            <li key={tile.key}>
              <Link
                href="/shop"
                className="group block text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sukla-charcoal)]"
                aria-label={`Shop ${tile.label} rugs, ${tile.sizes}`}
              >
                <div className="overflow-hidden" style={{ backgroundColor: TILE_BG }}>
                  <svg
                    viewBox="0 0 160 140"
                    className="block w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {tile.diagram}
                  </svg>
                </div>
                <p className="mt-5 font-sans text-sm uppercase tracking-[0.12em] text-[var(--sukla-charcoal)] group-hover:text-[var(--sukla-terracotta)] transition-colors">
                  {tile.label}
                </p>
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.1em] text-[var(--sukla-charcoal)]/70 nums">
                  {tile.sizes}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
