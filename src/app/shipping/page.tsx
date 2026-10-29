import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { FaqDocument } from '@/components/legal/FaqDocument';
import { SHIPPING_FAQ, buildFaqJsonLd } from '@/lib/legal/shipping-faq';
import { serializeJsonLd } from '@/lib/product-jsonld';

export const metadata: Metadata = {
  title: 'Shipping, Customs & Returns FAQ | SUKLA RUGS',
  description:
    'International shipping times, carriers, tracking, customs duties and taxes, and returns for Sukla Rugs orders.'
};

export default function ShippingFaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqJsonLd(SHIPPING_FAQ)) }}
      />
      <Header />
      <FaqDocument doc={SHIPPING_FAQ} />
      <Footer />
    </div>
  );
}
