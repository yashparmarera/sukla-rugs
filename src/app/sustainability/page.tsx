import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Leaf, ShieldCheck, Droplet, Recycle } from 'lucide-react';

export const metadata = {
  title: 'Sustainability & Ethical Craft | SUKLA RUGS',
  description: 'Our environmental pledge: 100% natural biodegradable wool and jute, non-toxic AZO-free dyes, and fair-wage artisan employment in Bhadohi.'
};

export default function SustainabilityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Ethical Responsibility
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide text-[var(--shukla-charcoal)]">
              Sustainability & Material Integrity
            </h1>
            <p className="font-serif italic text-base md:text-lg text-[var(--shukla-charcoal)]/80 max-w-2xl mx-auto">
              Heirloom rugs are inherently sustainable because they are crafted from renewable natural fibers designed to last generations rather than landfills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <Leaf className="w-8 h-8 text-emerald-700" />
              <h3 className="font-display text-lg uppercase tracking-wide">100% Organic Natural Fibers</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                We use pure New Zealand wool, un-dyed Indian raw wool, Bikaner silk, and natural jute. No synthetic plastic yarns (polyester, polypropylene, or nylon) are ever permitted in our looms.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <Droplet className="w-8 h-8 text-blue-700" />
              <h3 className="font-display text-lg uppercase tracking-wide">AZO-Free Eco Dyeing</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                All dye pigments used in our Bhadohi vat dye houses are certified non-toxic, AZO-free, and heavy-metal-free, protecting both worker health and home indoor air quality.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <ShieldCheck className="w-8 h-8 text-[var(--shukla-terracotta)]" />
              <h3 className="font-display text-lg uppercase tracking-wide">Fair Living Wages & Care</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                Our weavers receive wages 35% above regional minimum baselines, healthcare access, safe ergonomics, and educational scholarships for weaver children.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <Recycle className="w-8 h-8 text-amber-700" />
              <h3 className="font-display text-lg uppercase tracking-wide">Biodegradable Legacy</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                At the end of its multi-decade lifespan, a 100% natural wool or jute rug safely returns to the earth without leaving microplastic residues.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
