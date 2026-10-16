'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { trackEvent } from '@/lib/analytics';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { getDisplayTitle } from '@/lib/product-display';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const secondaryImage = product.images[1] || product.featuredImage;

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
    [product.metafields.technique, product.metafields.material].filter(Boolean).join(' • ') ||
    product.productType ||
    '';

  return (
    <div className="group relative flex flex-col bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)]/70 hover:border-[var(--sukla-taupe)] transition-all duration-300">
      {/* Image Container with Hover Swap */}
      <Link href={`/products/${product.handle}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--sukla-sand)]">
        
        {/* Primary Image */}
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:opacity-0 transition-opacity duration-700 ease-in-out"
        />

        {/* Secondary Image (Hover) */}
        <Image
          src={secondaryImage.url}
          alt={secondaryImage.altText || `${product.title} secondary view`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.collection.title && (
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

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-[var(--sukla-ivory)]/90 backdrop-blur-xs text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover:scale-110 transition-all duration-300 z-10 shadow-subtle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[var(--sukla-terracotta)] text-[var(--sukla-terracotta)]' : ''}`} />
        </button>

      </Link>

      {/* Content Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[var(--sukla-cream)]">
        <div>
          {attributeLine && (
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--sukla-taupe)] font-sans">
              {attributeLine}
            </span>
          )}
          <Link href={`/products/${product.handle}`}>
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

        <div className="pt-3 border-t border-[var(--sukla-muted-border)]/60 flex items-center justify-between">
          <span className="nums text-sm font-medium text-[var(--sukla-charcoal)]">
            {formattedPrice}
          </span>
          <Link
            href={`/products/${product.handle}`}
            className="text-[10px] font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation font-semibold"
          >
            Explore Rug
          </Link>
        </div>
      </div>
    </div>
  );
};
