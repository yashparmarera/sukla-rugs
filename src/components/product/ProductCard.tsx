'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { trackEvent } from '@/lib/analytics';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { getDisplayTitle } from '@/lib/product-display';

// The generic 'Premium Rugs' collection badge is not shown (title or handle, trimmed, case-insensitive).
const isPremiumBadge = (c: { title?: string; handle?: string }) =>
  ['premium rugs', 'premium-rugs'].includes((c.title ?? '').trim().toLowerCase()) ||
  (c.handle ?? '').trim().toLowerCase() === 'premium-rugs';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const secondaryImage = product.images[1] || product.featuredImage;
  const showCollectionBadge = Boolean(product.collection.title) && !isPremiumBadge(product.collection);
  const showBadges = showCollectionBadge || Boolean(product.metafields.one_of_a_kind);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    trackEvent('wishlist', { productId: product.id, productTitle: product.title, action: !isWishlisted ? 'add' : 'remove' });
  };

  const { format } = useCurrency();
  const { minVariantPrice } = product.priceRange;
  const formattedPrice = format(minVariantPrice.amount, minVariantPrice.currencyCode).text;
  const { display: displayTitle } = getDisplayTitle(product.title);
  // Only real data: construction and material when set, otherwise the product type.
  const attributeLine =
    [product.metafields.construction || product.metafields.technique, product.metafields.material]
      .filter(Boolean)
      .join(' • ') ||
    product.productType ||
    '';

  return (
    <div className="group relative flex flex-col bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)]/70 hover:border-[var(--sukla-taupe)] transition-all duration-300">
      {/* Image Container with Hover Swap */}
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square w-full overflow-hidden bg-[var(--sukla-ivory)] border-b border-[var(--sukla-muted-border)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sukla-charcoal)]"
      >

        {/* Primary Image — matted frame: whole rug shown on an ivory tile,
            never cropped, so mixed-aspect photography reads as a uniform catalog. */}
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 group-hover:opacity-0 transition-opacity duration-700 ease-in-out"
        />

        {/* Secondary Image (Hover) */}
        <Image
          src={secondaryImage.url}
          alt={secondaryImage.altText || `${product.title} secondary view`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
        />

        {/* Badges */}
        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {showCollectionBadge && (
              <span
                className="text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 text-white shadow-xs font-semibold"
                style={{ backgroundColor: product.collection.accentColor || '#BC8A5A' }}
              >
                {product.collection.title}
              </span>
            )}
            {product.metafields.one_of_a_kind && (
              <span className="text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)]">
                One of a Kind
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content Metadata */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 bg-[var(--sukla-cream)]">
        <div>
          {attributeLine && (
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--sukla-taupe)] font-sans">
              {attributeLine}
            </span>
          )}
          <Link
            href={`/products/${product.handle}`}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
          >
            <h3
              className="heading text-base text-[var(--sukla-charcoal)] group-hover:text-[var(--sukla-terracotta)] transition-colors mt-1 line-clamp-2"
              title={product.title}
            >
              {displayTitle}
            </h3>
          </Link>
          {product.subtitle && (
            <p className="text-xs font-sans text-[var(--sukla-charcoal)]/65 line-clamp-1 mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>

        <div className="pt-2.5 border-t border-[var(--sukla-muted-border)]/60 flex items-center justify-between gap-2">
          <span className="nums text-sm font-medium text-[var(--sukla-charcoal)]">
            {formattedPrice}
          </span>
          <div className="flex items-center gap-1">
            {/* Wishlist: compact icon button; negative margins keep a ~44px touch target without adding row height. */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={isWishlisted}
              className="-my-3 -mr-1 p-3.5 rounded-full text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sukla-charcoal)]"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[var(--sukla-terracotta)] text-[var(--sukla-terracotta)]' : ''}`} />
            </button>
            <Link
              href={`/products/${product.handle}`}
              className="text-[10px] font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation font-semibold whitespace-nowrap"
            >
              Explore Rug
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
