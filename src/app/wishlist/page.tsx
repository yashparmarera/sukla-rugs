import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { WishlistView } from '@/components/wishlist/WishlistView';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

export const metadata: Metadata = {
  title: 'Wishlist | SUKLA RUGS',
  description: 'The rugs you have saved on this device.',
  // Personal, device-local page: keep it out of search results.
  robots: { index: false, follow: false }
};

export default function WishlistPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="editorial-container">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans">
              <KnotGlyph size="sm" />
              <span>Saved Pieces</span>
            </div>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--sukla-charcoal)]">
              Your wishlist
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/75 leading-relaxed">
              Rugs you have saved on this device.
            </p>
          </div>

          <WishlistView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
