import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { StatBadge } from '@/components/ui/StatBadge';

export const metadata = {
  title: 'Our Story & Bhadohi Heritage | SHUKLA RUGS',
  description: 'Discover the heritage of SHUKLA RUGS: from the historic loom houses of Bhadohi, Uttar Pradesh, India to refined architectural spaces worldwide.'
};

export default function StoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1">
        {/* Story Hero */}
        <section className="relative py-24 md:py-32 bg-[var(--shukla-charcoal)] text-white text-center">
          <div className="editorial-container max-w-3xl mx-auto space-y-6">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--shukla-taupe-light)] font-sans block">
              Heritage Narrative
            </span>
            <h1 className="display-xl text-4xl sm:text-5xl md:text-6xl">
              Contemporary Indian Luxury Rooted in Craftsmanship
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[var(--shukla-ivory)]/90 font-normal">
              &quot;Bhadohi to the World: Every rug tells a story.&quot;
            </p>
          </div>
        </section>

        {/* Story Body */}
        <section className="py-20 editorial-container max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--shukla-terracotta)] font-sans block font-semibold">
                The Origin
              </span>
              <h2 className="display-lg text-2xl md:text-3xl text-[var(--shukla-charcoal)]">
                Bhadohi, Uttar Pradesh
              </h2>
              <p className="font-sans text-base text-[var(--shukla-charcoal)]/75 leading-relaxed">
                Known globally as India’s carpet hub, Bhadohi’s weaving history spans centuries along the Ganges River.
              </p>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/85 leading-relaxed">
                SHUKLA RUGS was established to bridge this deep regional heritage with contemporary global interior architecture. We work directly with master weaver families in Bhadohi, upholding fair wages, organic material sourcing, and uncompromising quality standards.
              </p>
            </div>

            <div className="relative aspect-[4/5] bg-[var(--shukla-sand)] border border-[var(--shukla-muted-border)] overflow-hidden shadow-subtle">
              <Image
                src="https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=85"
                alt="Bhadohi master weaver on wooden loom"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[var(--shukla-muted-border)]">
            <StatBadge label="Craft Region" value="Bhadohi" sublabel="Uttar Pradesh, India" />
            <StatBadge label="Knot Density" value="Up to 1.2M" sublabel="Knots per rug" />
            <StatBadge label="Natural Fibers" value="100%" sublabel="NZ Wool, Silk & Jute" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
