import React from 'react';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { SectionRule } from '@/components/ui/SectionRule';

export const BrandStatement: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--shukla-ivory)] text-center">
      <div className="editorial-container max-w-4xl mx-auto space-y-6">
        
        <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />

        <h2 className="font-display text-xs uppercase tracking-[0.3em] text-[var(--shukla-taupe)]">
          The Sukla Rugs Ethos
        </h2>

        <p className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide font-light text-[var(--shukla-charcoal)] uppercase leading-tight">
          &quot;Every rug tells a story.&quot;
        </p>

        <p className="font-serif italic text-lg md:text-xl text-[var(--shukla-charcoal)]/80 leading-relaxed max-w-2xl mx-auto font-normal">
          In the historic looms of Bhadohi, Uttar Pradesh, rug making is an enduring discipline of patience. Thousands of individually tied knots, hand-dyed organic yarns, and generations of inherited mastery yield textiles of quiet luxury and permanent resonance.
        </p>

        <SectionRule className="my-8" />
      </div>
    </section>
  );
};
