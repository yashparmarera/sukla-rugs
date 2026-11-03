'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { getDisplayTitle } from '@/lib/product-display';

interface ProductCarouselProps {
  products: Product[];
  shopAllHref?: string;
  shopAllLabel?: string;
}

const slideClass = 'snap-start shrink-0 basis-[72%] sm:basis-[44%] lg:basis-[23.5%]';

// Round white arrows, vertically centred on the image area (cards are 4:5 images + text).
const arrowClass =
  'absolute top-[34%] z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--sukla-charcoal)] shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-opacity hover:text-[var(--sukla-terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sukla-charcoal)] disabled:opacity-0 disabled:pointer-events-none';

function CarouselCard({ product, priority }: { product: Product; priority: boolean }) {
  const { format } = useCurrency();
  const { minVariantPrice } = product.priceRange;
  const price = format(minVariantPrice.amount, minVariantPrice.currencyCode).text;
  const { display: title } = getDisplayTitle(product.title);
  const hoverImage = product.images[1] || product.featuredImage;
  const href = `/products/${product.handle}`;

  return (
    <div className="group flex h-full flex-col bg-[#f5f5f5] p-3 pb-6 text-center">
      <Link
        href={href}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sukla-charcoal)]"
        aria-label={product.title}
      >
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 23vw"
          className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
        />
        <Image
          src={hoverImage.url}
          alt={hoverImage.altText || `${product.title} alternate view`}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 23vw"
          className="object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        />
      </Link>

      <div className="flex flex-1 flex-col items-center gap-1 px-1 pt-5">
        <Link
          href={href}
          className="font-sans text-sm font-light text-[var(--sukla-charcoal)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)] line-clamp-2"
          title={product.title}
        >
          {title}
        </Link>
        <span className="nums font-sans text-sm text-[var(--sukla-charcoal)]/75">{price}</span>
        {/* Rugs have size variants, so "+" opens the product page to choose one. */}
        <Link
          href={href}
          aria-label={`Choose size for ${product.title}`}
          className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--sukla-terracotta-dark)] text-[var(--sukla-terracotta-dark)] transition-colors hover:bg-[var(--sukla-terracotta-dark)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function ProductCarousel({
  products,
  shopAllHref = '/shop',
  shopAllLabel = 'Shop All'
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, products.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous products"
        onClick={() => scrollByPage(-1)}
        disabled={!canPrev}
        className={`${arrowClass} left-3`}
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => scrollByPage(1)}
        disabled={!canNext}
        className={`${arrowClass} right-3`}
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        onScroll={update}
        className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, idx) => (
          <div key={product.id} className={slideClass}>
            <CarouselCard product={product} priority={idx < 4} />
          </div>
        ))}

        <div className={`${slideClass} flex`}>
          <Link
            href={shopAllHref}
            className="group flex w-full min-h-[16rem] flex-col items-center justify-center gap-4 bg-[#f5f5f5] text-[var(--sukla-charcoal)] transition-colors hover:bg-[var(--sukla-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sukla-charcoal)]"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold">
              {shopAllLabel}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--sukla-terracotta-dark)] text-[var(--sukla-terracotta-dark)] transition-colors group-hover:bg-[var(--sukla-terracotta-dark)] group-hover:text-white">
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
