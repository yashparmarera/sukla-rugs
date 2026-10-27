import React from 'react';
import type { KnotDensity, PileBand, PileHeight } from '@/lib/product-infographics';

const BANDS: { band: PileBand; label: string; tuft: number }[] = [
  { band: 'flat', label: 'Flat', tuft: 2 },
  { band: 'low', label: 'Low', tuft: 5 },
  { band: 'medium', label: 'Medium', tuft: 9 },
  { band: 'high', label: 'High', tuft: 13 }
];

const SEGMENT = 25;
const GAP = 1.5;
const BAR_Y = 19;

/** Clamps a 0..1 position to the drawable width, keeping the marker inside. */
const toX = (position: number) => Math.min(99, Math.max(1, position * 100));

/**
 * Four pile bands (flat, low, medium, high) with tufts of increasing height.
 * The rug's band is highlighted and a marker shows its value. The SVG is
 * decorative: band and value are always given as visible text below it.
 */
export const PileHeightGauge: React.FC<{ pile: PileHeight }> = ({ pile }) => {
  const bandLabel = BANDS.find((b) => b.band === pile.band)?.label ?? '';
  const markerX = toX(pile.position);
  const hasRange = pile.rangeEnd - pile.rangeStart > 0.005;

  return (
    <div className="space-y-1.5">
      <svg
        viewBox="0 0 100 28"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-7"
        aria-hidden="true"
        focusable="false"
      >
        {BANDS.map(({ band, tuft }, index) => {
          const x = index * SEGMENT + GAP / 2;
          const w = SEGMENT - GAP;
          const active = band === pile.band;
          const color = active ? 'var(--sukla-terracotta)' : 'var(--sukla-taupe)';
          return (
            <g key={band}>
              {[0.2, 0.4, 0.6, 0.8].map((f) => (
                <line
                  key={f}
                  x1={x + w * f}
                  x2={x + w * f}
                  y1={BAR_Y}
                  y2={BAR_Y - tuft}
                  stroke={color}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity={active ? 1 : 0.55}
                />
              ))}
              <rect x={x} y={BAR_Y} width={w} height={3} fill={active ? 'var(--sukla-terracotta)' : 'var(--sukla-sand)'} />
            </g>
          );
        })}
        {hasRange && (
          <rect
            x={toX(pile.rangeStart)}
            y={24}
            width={Math.max(1, toX(pile.rangeEnd) - toX(pile.rangeStart))}
            height={2}
            fill="var(--sukla-charcoal)"
          />
        )}
        <path d={`M${markerX} 23 l-2 4 h4 Z`} fill="var(--sukla-charcoal)" />
      </svg>
      <p className="text-xs font-sans text-[var(--sukla-charcoal)]">
        <span className="font-medium">{bandLabel} pile</span>
        <span className="nums block text-[var(--sukla-charcoal)]/75">{pile.valueText}</span>
      </p>
    </div>
  );
};

/** One bar from 0 to 400+ knots per square inch with a marker at the rug's value. */
export const KnotDensityGauge: React.FC<{ knots: KnotDensity }> = ({ knots }) => {
  const markerX = toX(knots.position);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="nums text-[10px] font-sans text-[var(--sukla-charcoal)]/70">
          0
        </span>
        <svg
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-3 min-w-0 flex-1"
          aria-hidden="true"
          focusable="false"
        >
          <rect x={0} y={4} width={100} height={4} fill="var(--sukla-sand)" />
          <rect x={0} y={4} width={markerX} height={4} fill="var(--sukla-terracotta)" />
          <rect x={markerX - 1} y={1} width={2} height={10} fill="var(--sukla-charcoal)" />
        </svg>
        <span aria-hidden="true" className="nums text-[10px] font-sans text-[var(--sukla-charcoal)]/70">
          400+
        </span>
      </div>
      <p className="nums text-xs font-sans text-[var(--sukla-charcoal)]">{knots.valueText}</p>
    </div>
  );
};
