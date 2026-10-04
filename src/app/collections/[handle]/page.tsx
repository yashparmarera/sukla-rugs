import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { getCollectionByHandle, getProducts } from '@/lib/shopify/client';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) return { title: 'Collection Not Found | SHUKLA RUGS' };

  return {
    title: `${collection.title} | SHUKLA RUGS`,
    description: collection.description
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const products = await getProducts({ collection: collection.handle });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1">
        {/* Collection Hero */}
        <section className="relative py-20 md:py-28 bg-[var(--shukla-charcoal)] text-white overflow-hidden">
          {collection.image && (
            <div className="absolute inset-0 z-0">
              <Image
                src={collection.image.url}
                alt={collection.title}
                fill
                priority
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--shukla-charcoal)] via-[var(--shukla-charcoal)]/60 to-transparent" />
            </div>
          )}

          <div className="relative z-10 editorial-container text-center max-w-3xl mx-auto space-y-4">
            <span
              className="inline-block text-[10px] uppercase tracking-[0.25em] font-sans px-3 py-1 font-semibold text-white"
              style={{ backgroundColor: collection.accentColor }}
            >
              Collection Taxonomy
            </span>
            <h1 className="display-xl text-4xl sm:text-5xl md:text-6xl">
              {collection.title}
            </h1>
            <p className="font-serif italic text-lg md:text-xl text-[var(--shukla-ivory)]/90 leading-relaxed">
              {collection.description}
            </p>
          </div>
        </section>

        {/* Collection Products Grid */}
        <section className="py-16 editorial-container">
          <div className="flex justify-between items-center pb-6 border-b border-[var(--shukla-muted-border)] mb-8 text-xs font-sans">
            <span className="uppercase tracking-[0.1em] text-[var(--shukla-taupe)]">
              Displaying <strong className="nums text-[var(--shukla-charcoal)]">{products.length}</strong> Designs
            </span>
            <div className="flex items-center gap-2">
              <KnotGlyph size="sm" className="text-[var(--shukla-terracotta)]" />
              <span className="uppercase tracking-widest text-[var(--shukla-charcoal)] font-semibold">
                Authentic Bhadohi Weave
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 3} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
