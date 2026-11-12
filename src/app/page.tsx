import React from 'react';
import Metadata from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { ShopByRoom } from '@/components/editorial/ShopByRoom';
import { ShopBySize } from '@/components/editorial/ShopBySize';
import { FindYourRug } from '@/components/editorial/FindYourRug';
import { BehindTheScenes } from '@/components/editorial/BehindTheScenes';
import { getFindYourRugGroups } from '@/lib/find-your-rug';
import { CustomiseRugSection } from '@/components/editorial/CustomiseRugSection';
import { ProductCard } from '@/components/product/ProductCard';
import { BhadohiStorySection } from '@/components/craft/BhadohiStorySection';
import { DesignConsultationBanner } from '@/components/services/DesignConsultationBanner';
import { ReviewsSection } from '@/components/editorial/ReviewsSection';
import { JournalPreview } from '@/components/journal/JournalPreview';
import { getProducts } from '@/lib/shopify/client';
import { getSelectedCountry } from '@/lib/localization.server';
import { Button } from '@/components/ui/Button';

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
  const country = await getSelectedCountry();
  const [signatureProducts, findYourRugGroups] = await Promise.all([
    getProducts({ limit: 8, country }),
    getFindYourRugGroups(country)
  ]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero />

        {/* Shop by Room Architectural Layout */}
        <ShopByRoom />

        {/* Shop by Size */}
        <ShopBySize />

        {/* Find Your Rug: Style / Construction tabs from Shopify data */}
        <FindYourRug groups={findYourRugGroups} />

        {/* Behind the Scenes carousel */}
        <BehindTheScenes />

        {/* Signature Rugs Section */}
        <section className="py-12 md:py-28 bg-white border-t border-[var(--sukla-muted-border)]">
          <div className="editorial-container">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:items-end md:text-left mb-10 md:mb-12 space-y-4 md:space-y-0">
              <div>
                <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans mb-2">
                  Signature Curations
                </span>
                <h2 className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]">
                  Featured Loom Releases
                </h2>
              </div>
              <div className="hidden md:block">
                <Button href="/shop" variant="outline" size="sm">View All Handcrafted Rugs</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-5 md:gap-y-8 lg:grid-cols-4">
              {signatureProducts.map((product, idx) => (<ProductCard key={product.id} product={product} priority={idx < 4} />))}
            </div>
            <div className="mt-10 flex justify-center md:hidden">
              <Button href="/shop" variant="outline" size="sm">View All Handcrafted Rugs</Button>
            </div>
          </div>
        </section>

        {/* Customise your rug: custom-size estimate */}
        <CustomiseRugSection />

        {/* Bhadohi Story & 7 Craft Stages */}
        <BhadohiStorySection />

        {/* Design Consultation & Concierge Banner */}
        <DesignConsultationBanner />

        {/* Client Reviews */}
        <ReviewsSection />

        {/* Journal Preview */}
        <JournalPreview />
      </main>

      <Footer />
      </div>
    </>
  );
}
