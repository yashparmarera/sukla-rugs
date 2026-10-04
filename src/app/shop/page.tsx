import React, { Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterBar } from '@/components/filters/FilterBar';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/shopify/client';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    material?: string;
    color?: string;
    construction?: string;
    room?: string;
    sortBy?: string;
  }>;
}

export const metadata = {
  title: 'Shop All Handcrafted Rugs | SHUKLA RUGS',
  description: 'Browse our complete catalogue of handcrafted Indian rugs. Filter by collection, material, color family, room, and size. White-glove delivery worldwide.'
};

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const products = await getProducts({
    collection: params.collection,
    material: params.material,
    color: params.color,
    construction: params.construction,
    room: params.room,
    sortBy: params.sortBy
  });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-12">
        <div className="editorial-container">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans">
              <KnotGlyph size="sm" />
              <span>Master Catalogue</span>
            </div>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              All Handcrafted Rugs
            </h1>
            <p className="font-serif italic text-base md:text-lg text-[var(--shukla-charcoal)]/80">
              Each piece is individually woven in Bhadohi, India using natural long-staple wool, organic jute, and silk.
            </p>
          </div>

          {/* Interactive URL-Persisted Filter Bar */}
          <Suspense fallback={<div className="h-16 bg-[var(--shukla-sand)] animate-pulse my-8" />}>
            <FilterBar totalCount={products.length} />
          </Suspense>

          {/* Product Grid or Empty State */}
          {products.length === 0 ? (
            <div className="py-24 text-center space-y-4 border border-[var(--shukla-muted-border)] bg-[var(--shukla-cream)] my-8">
              <KnotGlyph size="md" className="text-[var(--shukla-taupe)]" />
              <h2 className="heading text-xl text-[var(--shukla-charcoal)]">
                No Rugs Match Your Filter Criteria
              </h2>
              <p className="font-serif italic text-sm text-[var(--shukla-charcoal)]/70 max-w-md mx-auto">
                Try selecting a broader material or color family, or clear your active filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
