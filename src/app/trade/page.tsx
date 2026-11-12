import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeDesignerContent } from '@/components/editorial/TradeDesignerContent';

export const metadata: Metadata = {
  title: 'Trade Program for Architects & Designers | SUKLA RUGS',
  description:
    'Net pricing, strike-off swatches and a dedicated loom concierge for architects and interior designers.'
};

export default function TradePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          <TradeDesignerContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
