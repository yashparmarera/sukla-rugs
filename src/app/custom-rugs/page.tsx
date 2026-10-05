import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Custom & Bespoke Rug Projects | SUKLA RUGS',
  description: 'Specify bespoke dimensions, custom yarn color dye matching, and original patterns handcrafted to your architectural drawings in Bhadohi.'
};

export default function CustomRugsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Bespoke Architecture
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              Custom &amp; Bespoke Rug Projects
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--shukla-charcoal)]/75 leading-relaxed">
              When standard catalog dimensions do not align with your room plans, our Bhadohi loom houses execute custom shapes, sizes up to 24’ x 36’, and precise Pantone dye matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-8">
            <div className="space-y-3">
              <h3 className="heading text-lg">Custom Dimensions &amp; Shapes</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                Circular, L-shaped sectional runners, curved cutouts for fireplace hearths, or oversize grand hall carpets woven seamless on wide vertical looms.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="heading text-lg">ARS &amp; Pantone Color Matching</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                Provide paint swatches or fabric memos. Our master dye lab in Bhadohi formulates custom non-toxic dye baths for exact color harmony.
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button href="/design-consultation" variant="primary" size="lg">
              Start Custom Rug Inquiry
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
