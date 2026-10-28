import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StyleTile } from '@/lib/style-tiles';

interface ShopByCategoryProps {
  /** Style tiles built from real Shopify data (see src/lib/style-tiles.ts). */
  tiles: StyleTile[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ tiles }) => {
  return (
    <section className="bg-[var(--sukla-ivory)] py-16 md:py-20">
      <div className="editorial-container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading text-2xl md:text-3xl text-[var(--sukla-charcoal)]">
            Shop rugs by category
          </h2>
          <Link
            href="/shop"
            className="hidden text-xs font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation sm:block"
          >
            View all rugs
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8">
          {tiles.map((tile) => (
            <Link key={tile.label} href={tile.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--sukla-sand)]">
                {tile.image ? (
                  <Image
                    src={tile.image.url}
                    alt={tile.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                ) : null}
              </div>
              <h3 className="mt-4 text-sm font-sans text-[var(--sukla-charcoal)] group-hover:text-[var(--sukla-terracotta)] transition-colors">
                {tile.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
