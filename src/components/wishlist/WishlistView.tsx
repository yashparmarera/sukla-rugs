'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { useWishlist } from '@/components/providers/WishlistProvider';

const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6';
const PANEL_CLASSES = 'py-24 px-6 text-center space-y-4 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)]';
const BUTTON_CLASSES =
  'inline-block bg-[var(--sukla-charcoal)] px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]';

/**
 * The saved list lives in localStorage (product GIDs only), so the current
 * product data is fetched from /api/wishlist after mount. Ids Shopify no
 * longer returns are dropped from the view and pruned from storage.
 */
export const WishlistView: React.FC = () => {
  const { ids, ready, remove } = useWishlist();
  // id -> product, or null when Shopify no longer returns it.
  const [loaded, setLoaded] = useState<Record<string, Product | null>>({});
  const [failed, setFailed] = useState(false);

  const unresolved = ids.filter((id) => !(id in loaded));
  const unresolvedKey = unresolved.join(',');

  useEffect(() => {
    if (!ready || failed || unresolvedKey === '') return;
    const requested = unresolvedKey.split(',');
    const controller = new AbortController();

    fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: requested }),
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Wishlist request failed (${response.status})`);
        return response.json() as Promise<{ products: Product[] }>;
      })
      .then(({ products }) => {
        const byId = new Map(products.map((product) => [product.id, product]));
        setLoaded((previous) => {
          const next = { ...previous };
          requested.forEach((id) => {
            next[id] = byId.get(id) ?? null;
          });
          return next;
        });
        const gone = requested.filter((id) => !byId.has(id));
        if (gone.length > 0) remove(gone);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });

    return () => controller.abort();
  }, [ready, failed, unresolvedKey, remove]);

  // Newest saved first. Removing a card updates `ids`, so it leaves the grid at once.
  const items = [...ids].reverse().flatMap((id) => (loaded[id] ? [loaded[id] as Product] : []));

  const isLoading = !ready || (unresolved.length > 0 && !failed);
  const hasError = ready && unresolved.length > 0 && failed;

  if (isLoading) {
    const placeholders = ready ? Math.min(Math.max(ids.length, 1), 8) : 4;
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          Loading your wishlist
        </p>
        <div className={GRID_CLASSES} aria-hidden="true">
          {Array.from({ length: placeholders }, (_, index) => (
            <div key={index} className="border border-[var(--sukla-muted-border)]/70 bg-white">
              <div className="aspect-square animate-pulse bg-[var(--sukla-sand)]" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/3 animate-pulse bg-[var(--sukla-sand)]" />
                <div className="h-4 w-3/4 animate-pulse bg-[var(--sukla-sand)]" />
                <div className="h-4 w-1/4 animate-pulse bg-[var(--sukla-sand)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div role="alert" className={PANEL_CLASSES}>
        <KnotGlyph size="md" className="text-[var(--sukla-taupe)]" />
        <h2 className="heading text-xl text-[var(--sukla-charcoal)]">We couldn&apos;t load your wishlist</h2>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/70 max-w-md mx-auto leading-relaxed">
          Your saved rugs are still stored on this device. Please try again.
        </p>
        <button type="button" onClick={() => setFailed(false)} className={BUTTON_CLASSES}>
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={PANEL_CLASSES}>
        <KnotGlyph size="md" className="text-[var(--sukla-taupe)]" />
        <h2 className="heading text-xl text-[var(--sukla-charcoal)]">Your wishlist is empty</h2>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/70 max-w-md mx-auto leading-relaxed">
          Tap the heart on any rug to save it here and come back to it later.
        </p>
        <Link href="/shop" className={BUTTON_CLASSES}>
          Explore rugs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p role="status" className="mb-6 font-sans text-sm text-[var(--sukla-charcoal)]/70">
        <span className="nums">{items.length}</span> saved {items.length === 1 ? 'rug' : 'rugs'}
      </p>
      <div className={GRID_CLASSES}>
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
    </div>
  );
};
