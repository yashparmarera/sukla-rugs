import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface CollectionGridProps {
  collections: Collection[];
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  return (
    <section className="py-20 md:py-28 bg-[var(--shukla-ivory)]">
      <div className="editorial-container">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans">
            Taxonomy & Construction
          </span>
          <h2 className="display-lg text-3xl md:text-4xl text-[var(--shukla-charcoal)]">
            Shop by Collection
          </h2>
          <p className="font-serif italic text-base text-[var(--shukla-charcoal)]/80">
            Explore six distinct artisanal techniques crafted in our Bhadohi loom houses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.handle}`}
              className="group relative flex flex-col bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-500"
            >
              {/* Collection Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--shukla-sand)]">
                {col.image && (
                  <Image
                    src={col.image.url}
                    alt={col.image.altText || col.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                )}
                
                {/* Accent Color Indicator */}
                <div
                  className="absolute top-4 left-4 text-[10px] font-sans font-semibold uppercase tracking-widest px-3 py-1 text-white shadow-xs"
                  style={{ backgroundColor: col.accentColor }}
                >
                  {col.productCount} Designs Available
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[var(--shukla-charcoal)] group-hover:bg-[var(--shukla-charcoal)] group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="heading text-xl text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed mt-2">
                    {col.description}
                  </p>
                </div>

                {col.heroTagline && (
                  <div className="pt-4 border-t border-[var(--shukla-muted-border)]">
                    <span className="font-serif italic text-xs text-[var(--shukla-taupe)]">
                      &quot;{col.heroTagline}&quot;
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
