import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';

export const BhadohiStorySection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)] overflow-hidden relative">
      <div className="editorial-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Stack */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full bg-[var(--shukla-black)] overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=85"
                alt="Master weaver tying knots in Bhadohi loom house"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-85"
              />
            </div>
            {/* Overlapping Badge Card */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[var(--shukla-cream)] text-[var(--shukla-charcoal)] border border-white/20 max-w-xs shadow-2xl">
              <KnotGlyph size="sm" className="text-[var(--shukla-terracotta)] mb-2" />
              <span className="block font-display text-sm uppercase tracking-wider font-semibold">
                Bhadohi Guild Standard
              </span>
              <p className="text-xs font-serif italic text-[var(--shukla-charcoal)]/80 mt-1">
                Up to 1,200,000 individually tied knots per rug over 16 weeks of dedicated hand weaving.
              </p>
            </div>
          </div>

          {/* Right Column: Story Text */}
          <div className="lg:col-span-6 space-y-6 lg:pl-8">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans">
              <KnotGlyph size="sm" />
              <span>Artisan Heritage • Uttar Pradesh, India</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide font-light leading-tight">
              Bhadohi: The Heart of Indian Rug Weaving
            </h2>

            <p className="font-serif italic text-lg text-[var(--shukla-taupe-light)] leading-relaxed">
              Centuries of craftsmanship flow through Bhadohi, where master weavers transform hand-spun wool and pure silk into enduring pieces of art.
            </p>

            <p className="text-xs font-sans text-[var(--shukla-ivory)]/80 leading-relaxed space-y-3">
              Every SUKLA RUG begins with natural raw materials—high-grade New Zealand wool, Bikaner long-staple fibers, and organic jute. Through our 7-stage craft process, raw fibers undergo hand-carding, natural vat-dyeing, precision warping, meticulous knotting, and sun washing.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button href="/process" variant="terracotta" size="md">
                Explore The 7 Craft Stages
              </Button>
              <Link
                href="/story"
                className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--shukla-ivory)] hover:text-[var(--shukla-terracotta)] hover-underline-animation py-2 font-medium"
              >
                Our Origin Story
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
