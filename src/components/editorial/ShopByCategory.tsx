import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { StyleTile } from '@/lib/style-tiles';

interface ShopByCategoryProps {
  /** Style tiles built from real Shopify data (see src/lib/style-tiles.ts). */
  tiles: StyleTile[];
}

/** Short descriptor per style label. Unknown labels render no descriptor. */
const DESCRIPTORS: Record<string, string> = {
  traditional: 'Timeless motifs',
  modern: 'Clean lines',
  contemporary: 'Today\u2019s living',
  abstract: 'Expressive art',
  runners: 'Long & narrow',
};

/**
 * When the same image URL is used by more than one tile (one product can match
 * several styles), repeats are shown as a zoomed detail crop so the tiles read
 * as different views rather than a copy. Full literal classes so Tailwind sees them.
 */
const ALT_CROPS = [
  'scale-[1.45] origin-[18%_22%]',
  'scale-[1.45] origin-[82%_78%]',
];

/**
 * Per-style framing tweaks (CSS only, no data change). The Traditional source
 * image is a square photo on a grey backdrop; in the 3:4 tile the backdrop
 * shows as thin strips along the top and bottom edges. A small centred scale
 * crops both strips while keeping the whole rug field in frame.
 */
const FRAMING: Record<string, string> = {
  traditional: 'scale-[1.1] origin-center',
};

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ tiles }) => {
  // Detect repeated images at render time (no hardcoded labels).
  const seen = new Map<string, number>();
  const decorated = tiles.map((tile, index) => {
    const url = tile.image?.url;
    const repeat = url ? (seen.get(url) ?? 0) : 0;
    if (url) seen.set(url, repeat + 1);
    return { tile, index, repeat };
  });

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="border-t border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] py-16 md:py-24"
    >
      <div className="editorial-container">
        <div className="mb-10 flex flex-col gap-6 border-b border-[var(--sukla-muted-border)] pb-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-3 text-xs tracking-[0.25em] text-[var(--sukla-terracotta-dark)]">
              <span aria-hidden="true" className="h-px w-10 bg-[var(--sukla-terracotta)]" />
              The Collection
            </p>
            <h2
              id="shop-by-category-heading"
              className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em] text-[var(--sukla-charcoal)] md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Shop rugs by{' '}
              <em className="italic text-[var(--sukla-terracotta-dark)]">category</em>
            </h2>
          </div>

          <div className="flex max-w-sm flex-col gap-5 md:items-end md:text-right">
            <p className="font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/80">
              Start with a style, then explore the rugs that suit your space.
            </p>
            <Link
              href="/shop"
              className="group/all hover-underline-animation hidden items-center gap-2 self-start font-sans text-xs uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)] sm:inline-flex md:self-auto"
            >
              View all rugs
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 group-hover/all:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 items-start gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-4 md:gap-y-14 lg:gap-x-8">
          {decorated.map(({ tile, index, repeat }) => {
            const descriptor = DESCRIPTORS[tile.label.toLowerCase()];
            const numeral = String(index + 1).padStart(2, '0');
            const altCrop =
              repeat > 0
                ? ALT_CROPS[(repeat - 1) % ALT_CROPS.length]
                : (FRAMING[tile.label.toLowerCase()] ?? '');
            const isOdd = index % 2 === 1;

            return (
              <Link
                key={tile.label}
                href={tile.href}
                aria-label={`Shop ${tile.label} rugs`}
                className={`group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)] ${
                  isOdd ? 'mt-10 md:mt-16' : ''
                }`}
              >
                {/* Photo plate: no overlay, so the rug itself is always fully visible. */}
                <div
                  className={`relative overflow-hidden border border-[var(--sukla-charcoal)]/15 bg-[var(--sukla-sand)] ${
                    isOdd ? 'aspect-[4/5]' : 'aspect-[3/4]'
                  }`}
                >
                  {tile.image ? (
                    <div className={`absolute inset-0 ${altCrop}`}>
                      <Image
                        src={tile.image.url}
                        alt={`${tile.label} style rug`}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1440px) 24vw, 320px"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
                      />
                    </div>
                  ) : (
                    <div aria-hidden="true" className="craft-texture absolute inset-0" />
                  )}

                  <span
                    aria-hidden="true"
                    className="nums absolute left-0 top-3 border-y border-r border-[var(--sukla-charcoal)]/20 bg-[var(--sukla-cream)] px-2.5 py-1 text-[11px] tracking-[0.25em] text-[var(--sukla-charcoal)] md:top-4 md:px-3"
                  >
                    {numeral}
                  </span>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2 border border-[var(--sukla-cream)]/80 opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:inset-3"
                  />
                </div>

                {/* Caption on the cream page: charcoal on cream, contrast does not depend on the photo. */}
                <div className="pt-4 md:pt-5">
                  <h3
                    className="font-serif text-2xl font-normal leading-tight text-[var(--sukla-charcoal)] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-[var(--sukla-terracotta-dark)] group-focus-visible:text-[var(--sukla-terracotta-dark)] md:text-xl lg:text-2xl xl:text-3xl"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {tile.label}
                  </h3>
                  {descriptor ? (
                    <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--sukla-charcoal)]/75">
                      {descriptor}
                    </p>
                  ) : null}
                  <span className="mt-4 flex items-center justify-between border-t border-[var(--sukla-charcoal)]/20 pt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--sukla-charcoal)] motion-safe:transition-colors motion-safe:duration-300 group-hover:border-[var(--sukla-terracotta)]">
                    Explore
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href="/shop"
          className="mt-10 flex min-h-11 items-center justify-center gap-2 border border-[var(--sukla-charcoal)] px-6 font-sans text-xs uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-cream)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)] motion-safe:transition-colors motion-safe:duration-300 sm:hidden"
        >
          View all rugs
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
};
