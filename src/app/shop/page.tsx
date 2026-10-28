import React, { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterBar } from '@/components/filters/FilterBar';
import { SortControl } from '@/components/filters/SortControl';
import { ProductCard } from '@/components/product/ProductCard';
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips';
import { getProducts, getCollectionByHandle } from '@/lib/shopify/client';
import { getSelectedCountry } from '@/lib/localization.server';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { applyShopFilters, describeFilter, parseColorFilter, parseShopFilters, productMatchesFilter } from '@/lib/shop-filters';
import { isMenuCollection, SHOP_ROOT_HREF } from '@/lib/shop-menu';

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    material?: string;
    color?: string;
    construction?: string;
    room?: string;
    style?: string;
    sortBy?: string;
  }>;
}

export const metadata = {
  title: 'Shop All Handcrafted Rugs | SUKLA RUGS',
  description: 'Browse our complete catalogue of handcrafted Indian rugs. Filter by collection, material, color family, room, and size. White-glove delivery worldwide.'
};

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const country = await getSelectedCountry();
  const filters = parseShopFilters(params);
  const menuCollection = filters.collection && isMenuCollection(filters.collection) ? filters.collection : undefined;

  // material / construction / room / style are matched below by the documented
  // helper in shop-filters.ts, so they are not passed to getProducts.
  let products = await getProducts({
    country,
    collection: params.collection,
    color: params.color,
    sortBy: params.sortBy,
    strictCollection: menuCollection ? true : undefined
  });

  // Menu "Area Rugs" handles: use the real Shopify collection when it exists.
  // Only when the collection does not exist do we fall back to keyword matching
  // over real products (never mock data, never invented tags).
  if (menuCollection && products.length === 0) {
    const realCollection = await getCollectionByHandle(menuCollection, { country });
    if (!realCollection) {
      const allProducts = await getProducts({ country, color: params.color, sortBy: params.sortBy });
      products = allProducts.filter((product) => productMatchesFilter(product, 'collection', menuCollection));
    }
  }

  products = applyShopFilters(products, filters);

  const colorFilter = parseColorFilter(params.color);
  const activeLabels = (['style', 'room', 'construction', 'material', 'collection'] as const).flatMap((key) => {
    const value = filters[key];
    return value ? [describeFilter(key, value).label] : [];
  });
  const emptyHeading =
    activeLabels.length === 1 ? `No rugs match ${activeLabels[0]} yet` : 'No rugs match these filters yet';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="editorial-container">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans">
              <KnotGlyph size="sm" />
              <span>Master Catalogue</span>
            </div>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--sukla-charcoal)]">
              All Handcrafted Rugs
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/75 leading-relaxed">
              Each piece is individually woven in Bhadohi, India using natural long-staple wool, organic jute, and silk.
            </p>
          </div>

          {/* Two-column shell: left filter rail (desktop) + right content column */}
          <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10 lg:items-start my-8">

            {/* Column 1 — Interactive URL-Persisted Filter Rail (mobile button + modal live here too) */}
            <Suspense fallback={<div className="hidden lg:block h-96 bg-[var(--sukla-sand)] animate-pulse" />}>
              <FilterBar totalCount={products.length} />
            </Suspense>

            {/* Column 2 — Sort row, active chips, then grid or empty state */}
            <div className="min-w-0">
              <SortControl totalCount={products.length} />

              <ActiveFilterChips filters={filters} color={colorFilter} searchParams={params} />

              {/* Product Grid or Empty State */}
              {products.length === 0 && activeLabels.length > 0 ? (
                <div className="py-24 text-center space-y-4 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)]">
                  <KnotGlyph size="md" className="text-[var(--sukla-taupe)]" />
                  <h2 className="heading text-xl text-[var(--sukla-charcoal)]">{emptyHeading}</h2>
                  <p className="font-sans text-sm text-[var(--sukla-charcoal)]/70 max-w-md mx-auto leading-relaxed">
                    We only list rugs that exist in our catalogue. As new pieces are added, they will appear here.
                  </p>
                  <Link
                    href={SHOP_ROOT_HREF}
                    className="inline-block bg-[var(--sukla-charcoal)] px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
                  >
                    View All Rugs
                  </Link>
                </div>
              ) : products.length === 0 ? (
                <div className="py-24 text-center space-y-4 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)]">
                  <KnotGlyph size="md" className="text-[var(--sukla-taupe)]" />
                  <h2 className="heading text-xl text-[var(--sukla-charcoal)]">
                    No Rugs Match Your Filter Criteria
                  </h2>
                  <p className="font-sans text-sm text-[var(--sukla-charcoal)]/70 max-w-md mx-auto leading-relaxed">
                    Try selecting a broader material or color family, or clear your active filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                  {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} priority={idx < 4} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
