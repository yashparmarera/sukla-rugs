import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

export const metadata = {
  title: 'Artisans of Bhadohi | SHUKLA RUGS',
  description: 'Meet the master weaver collective of Bhadohi, Uttar Pradesh. Generations of human skill behind every hand-knotted and hand-tufted rug.'
};

export default function ArtisansPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              The Hands Behind The Loom
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              Artisans of Bhadohi
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--shukla-charcoal)]/75 max-w-2xl mx-auto leading-relaxed">
              Behind every SHUKLA RUG are the hands of master weavers whose craft knowledge has been refined across generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-8">
            <div className="space-y-4">
              <h2 className="heading text-xl">A Tradition of Mastery</h2>
              <p className="font-serif italic text-sm text-[var(--shukla-charcoal)]/80">
                &quot;Weaving is a language of rhythm. Every knot tied is a continuation of our ancestors&apos; memory.&quot;
              </p>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/85 leading-relaxed">
                In our Bhadohi loom houses, weaving families work in clean, well-lit spaces with fair living wages, health support, and respect for artisanal autonomy. We guarantee zero child labor and honor the artisan as an equal partner in global luxury.
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-[var(--shukla-sand)] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=85"
                alt="Artisan weaver tying knots"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
