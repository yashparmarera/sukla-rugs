'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { trackEvent } from '@/lib/analytics';

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

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = minPrice.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="group relative flex flex-col bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)]/70 hover:border-[var(--shukla-taupe)] transition-all duration-300">
      {/* Image Container with Hover Swap */}
      <Link href={`/products/${product.handle}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--shukla-sand)]">
        
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
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 text-white shadow-xs font-semibold"
            style={{ backgroundColor: product.collection.accentColor || '#BC8A5A' }}
          >
            {product.collection.title}
          </span>
          {product.metafields.one_of_a_kind && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)]">
              One of a Kind
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-[var(--shukla-ivory)]/90 backdrop-blur-xs text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover:scale-110 transition-all duration-300 z-10 shadow-subtle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[var(--shukla-terracotta)] text-[var(--shukla-terracotta)]' : ''}`} />
        </button>

      </Link>

      {/* Content Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[var(--shukla-cream)]">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--shukla-taupe)] font-sans">
            {product.metafields.technique || 'Handcrafted'} • {product.metafields.material || 'Wool'}
          </span>
          <Link href={`/products/${product.handle}`}>
            <h3 className="font-display text-base tracking-wide text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors mt-1">
              {product.title}
            </h3>
          </Link>
          {product.subtitle && (
            <p className="text-xs font-serif italic text-[var(--shukla-charcoal)]/70 line-clamp-1 mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--shukla-muted-border)]/60 flex items-center justify-between">
          <span className="font-display text-sm font-medium text-[var(--shukla-charcoal)]">
            ${formattedPrice} <span className="text-[10px] font-sans text-[var(--shukla-taupe)] font-normal">USD</span>
          </span>
          <Link
            href={`/products/${product.handle}`}
            className="text-[10px] font-sans uppercase tracking-[0.18em] text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover-underline-animation font-semibold"
          >
            Explore Rug
          </Link>
        </div>
      </div>
    </div>
  );
};
