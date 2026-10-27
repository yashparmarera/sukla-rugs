import React from 'react';
import type { Product, ProductVariant } from '@/types';
import { buildAtAGlance, type GlanceTile, type IconName } from '@/lib/product-infographics';
import { InfographicIcon } from '@/components/product/infographics/InfographicIcon';
import { ShapeSilhouette } from '@/components/product/infographics/ShapeSilhouette';
import { KnotDensityGauge, PileHeightGauge } from '@/components/product/infographics/Gauges';

const TILE = 'min-w-0 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] p-4 space-y-2';
const VALUE = 'heading text-sm text-[var(--sukla-charcoal)] break-words';

const TileTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="eyebrow text-[10px] text-[var(--sukla-charcoal)]/70">{children}</h3>
);

/** Icon + label rows for material and room lists. */
const IconList: React.FC<{ items: { label: string; icon: IconName }[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item.label} className="flex items-center gap-2 min-w-0">
        <InfographicIcon name={item.icon} className="w-5 h-5 text-[var(--sukla-charcoal)]" />
        <span className={VALUE}>{item.label}</span>
      </li>
    ))}
  </ul>
);

function renderTile(tile: GlanceTile): React.ReactNode {
  switch (tile.kind) {
    case 'construction':
      return (
        <li
          key={tile.kind}
          className="min-w-0 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] p-4 col-span-full flex gap-4 items-start"
        >
          <InfographicIcon name={tile.icon} className="w-8 h-8 text-[var(--sukla-terracotta)]" />
          <div className="min-w-0 space-y-1">
            <TileTitle>{tile.title}</TileTitle>
            <p className={VALUE}>{tile.label}</p>
            {tile.summary && (
              <p className="text-xs font-sans leading-relaxed text-[var(--sukla-charcoal)]/75">{tile.summary}</p>
            )}
          </div>
        </li>
      );
    case 'material':
    case 'rooms':
      return (
        <li key={tile.kind} className={TILE}>
          <TileTitle>{tile.title}</TileTitle>
          <IconList items={tile.items} />
        </li>
      );
    case 'pile':
      return (
        <li key={tile.kind} className={TILE}>
          <TileTitle>{tile.title}</TileTitle>
          <PileHeightGauge pile={tile.pile} />
        </li>
      );
    case 'knots':
      return (
        <li key={tile.kind} className={TILE}>
          <TileTitle>{tile.title}</TileTitle>
          <InfographicIcon name="knots" className="w-8 h-8 text-[var(--sukla-charcoal)]" />
          <KnotDensityGauge knots={tile.knots} />
        </li>
      );
    case 'shape-size':
      return (
        <li key={tile.kind} className={TILE}>
          <TileTitle>{tile.title}</TileTitle>
          {tile.shape ? (
            <ShapeSilhouette shape={tile.shape.key} ratio={tile.size?.ratio} />
          ) : (
            <InfographicIcon name="size" className="w-8 h-8 text-[var(--sukla-charcoal)]" />
          )}
          <div>
            {tile.shape && <p className={VALUE}>{tile.shape.label}</p>}
            {tile.size && (
              <p className={`nums ${tile.shape ? 'text-xs font-sans text-[var(--sukla-charcoal)]/75' : VALUE}`}>
                {tile.size.label}
              </p>
            )}
          </div>
        </li>
      );
    case 'origin-craft':
      return (
        <li key={tile.kind} className={TILE}>
          <TileTitle>{tile.title}</TileTitle>
          {tile.origin && (
            <div className="flex items-center gap-2 min-w-0">
              <InfographicIcon name="origin" className="w-5 h-5 text-[var(--sukla-charcoal)]" />
              <span className={VALUE}>{tile.origin}</span>
            </div>
          )}
          {tile.craftTime && (
            <div className="flex items-center gap-2 min-w-0">
              <InfographicIcon name="craft-time" className="w-5 h-5 text-[var(--sukla-charcoal)]" />
              <span className={VALUE}>
                {tile.origin && (
                  <span className="block text-[10px] font-sans text-[var(--sukla-charcoal)]/70">Craft time</span>
                )}
                {tile.craftTime}
              </span>
            </div>
          )}
        </li>
      );
  }
}

interface ProductAtAGlanceProps {
  product: Product;
  selectedVariant: ProductVariant;
}

/**
 * "At a glance" infographic tiles built only from the product's real Shopify
 * data. Each tile renders only when its data exists; with no data the whole
 * block is omitted.
 */
export const ProductAtAGlance: React.FC<ProductAtAGlanceProps> = ({ product, selectedVariant }) => {
  const tiles = buildAtAGlance(product, selectedVariant);
  if (tiles.length === 0) return null;

  return (
    <section aria-labelledby="pdp-at-a-glance-title" className="space-y-4">
      <h2 id="pdp-at-a-glance-title" className="eyebrow text-xs text-[var(--sukla-charcoal)]/70">
        At a glance
      </h2>
      <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {tiles.map(renderTile)}
      </ul>
    </section>
  );
};
