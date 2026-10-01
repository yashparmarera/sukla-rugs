import React from 'react';
import Metadata from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { BrandStatement } from '@/components/editorial/BrandStatement';
import { ShopByRoom } from '@/components/editorial/ShopByRoom';
import { ShopByCategory } from '@/components/editorial/ShopByCategory';
import { ProductCard } from '@/components/product/ProductCard';
import { BhadohiStorySection } from '@/components/craft/BhadohiStorySection';
import { DesignConsultationBanner } from '@/components/services/DesignConsultationBanner';
import { ReviewsSection } from '@/components/editorial/ReviewsSection';
import { JournalPreview } from '@/components/journal/JournalPreview';
import { getProducts } from '@/lib/shopify/client';
import { Button } from '@/components/ui/Button';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { BrandEntrance } from '@/components/entry/BrandEntrance';

export const metadata = {
  title: 'SUKLA RUGS | Ultra-Premium Handcrafted Indian Rugs | Bhadohi',
  description: 'Contemporary Indian luxury rooted in craftsmanship. Explore hand-knotted Oushak, Persian hand-tufted, modern flatweaves, and organic jute rugs handcrafted in Bhadohi, UP.',
  openGraph: {
    title: 'SUKLA RUGS | Ultra-Premium Handcrafted Indian Rugs',
    description: 'Every rug tells a story. Contemporary Indian luxury handcrafted in Bhadohi, Uttar Pradesh.',
    url: 'https://shuklarugsv1.vercel.app',
    siteName: 'SUKLA RUGS'
  }
};

export default async function HomePage() {
  const signatureProducts = await getProducts({ limit: 6 });

  return (
    <BrandEntrance>
      <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero />

        {/* Shop by Room Architectural Layout */}
        <ShopByRoom />

        {/* Signature Rugs Section */}
        <section className="py-20 md:py-28 bg-[var(--shukla-ivory)] border-t border-[var(--shukla-muted-border)]">
          <div className="editorial-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
              <div>
                <span className="block text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans mb-2">
                  Signature Curations
                </span>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[var(--shukla-charcoal)] uppercase">
                  Featured Loom Releases
                </h2>
              </div>
              <Button href="/shop" variant="outline" size="sm">
                View All Handcrafted Rugs
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {signatureProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 3} />
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Rug Category */}
        <ShopByCategory />

        {/* Bhadohi Story & 7 Craft Stages */}
        <BhadohiStorySection />

        {/* Brand Ethos Statement */}
        <BrandStatement />

        {/* Design Consultation & Concierge Banner */}
        <DesignConsultationBanner />

        {/* Client Reviews */}
        <ReviewsSection />

        {/* Journal Preview */}
        <JournalPreview />

        {/* Final Brand Banner CTA */}
        <section className="py-24 bg-[var(--shukla-cream)] border-t border-[var(--shukla-muted-border)] text-center">
          <div className="editorial-container max-w-3xl mx-auto space-y-6">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-[var(--shukla-charcoal)]">
              Transform Your Architecture
            </h2>
            <p className="font-serif italic text-lg text-[var(--shukla-charcoal)]/80">
              Discover why top interior architects specify SUKLA RUGS for luxury residences worldwide.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Button href="/shop" variant="primary" size="lg">
                Shop All Rugs
              </Button>
              <Button href="/find-your-rug" variant="secondary" size="lg">
                Find Your Rug
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </BrandEntrance>
  );
}
