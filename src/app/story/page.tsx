import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { StatBadge } from '@/components/ui/StatBadge';

export const metadata = {
  title: 'Our Story & Bhadohi Heritage | SUKLA RUGS',
  description: 'Discover the heritage of SUKLA RUGS: from the historic loom houses of Bhadohi, Uttar Pradesh, India to refined architectural spaces worldwide.'
};

export default function StoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />

      <main className="flex-1">
        {/* Story Hero */}
        <section className="relative py-24 md:py-32 bg-[var(--sukla-charcoal)] text-white text-center">
          <div className="editorial-container max-w-3xl mx-auto space-y-6">
            <KnotGlyph size="md" className="text-[var(--sukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--sukla-taupe-light)] font-sans block">
              Heritage Narrative
            </span>
            <h1 className="display-xl text-4xl sm:text-5xl md:text-6xl">
              Contemporary Indian Luxury Rooted in Craftsmanship
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[var(--sukla-ivory)]/90 font-normal">
              &quot;Bhadohi to the World: Every rug tells a story.&quot;
            </p>
          </div>
        </section>

        {/* Opening Statement */}
        <section className="py-20 md:py-24 editorial-container max-w-3xl mx-auto text-center space-y-6">
          <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">Our Story</span>
          <p className="font-sans text-lg md:text-xl text-[var(--sukla-charcoal)]/80 leading-relaxed">
            At Sukla Rugs, we do not just manufacture carpets; we weave stories, preserve heritage, and bring the timeless art of Indian craftsmanship to floors across the globe. Born from a deep-rooted family legacy, our journey began generations ago with a simple loom and a profound respect for the artisanal craft.
          </p>
          <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
            Today, as the new generation takes the helm, we are proudly carrying forward this ancestral family business, blending traditional techniques with contemporary global aesthetics.
          </p>
        </section>

        {/* Our Heritage */}
        <section className="py-16 bg-[var(--sukla-cream)] border-y border-[var(--sukla-muted-border)]">
          <div className="editorial-container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">Our Heritage</span>
              <h2 className="display-lg text-2xl md:text-3xl text-[var(--sukla-charcoal)]">
                A Legacy Passed Down the Bloodline
              </h2>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/75 leading-relaxed">
                Rug making has been the heartbeat of our family for decades. The knowledge of selecting the finest yarns, mastering the perfect tension on the loom, and understanding the soul of a design has been passed down through our bloodline.
              </p>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/75 leading-relaxed">
                By honoring the wisdom of our elders and embracing modern innovation, we have transformed our family workshop into a globally recognized manufacturing and export house, without ever losing the personal touch that defines our work.
              </p>
            </div>

            <div className="relative aspect-[4/5] bg-[var(--sukla-sand)] border border-[var(--sukla-muted-border)] overflow-hidden shadow-subtle">
              <Image
                src="https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=85"
                alt="Bhadohi master weaver on a wooden loom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* The Art of Our Craft */}
        <section className="py-20 editorial-container max-w-3xl mx-auto text-center space-y-5">
          <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">The Art of Our Craft</span>
          <h2 className="display-lg text-2xl md:text-3xl text-[var(--sukla-charcoal)]">Woven by Master Artisans</h2>
          <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/75 leading-relaxed">
            Every piece that leaves our facility is a testament to the dedication of our master artisans. We specialize in a diverse range of premium floor coverings, including hand-knotted, hand-tufted, and jute rugs, all carefully crafted to elevate any space.
          </p>
        </section>

        {/* Bespoke Creations & Custom Designs */}
        <section className="py-16 bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)]">
          <div className="editorial-container max-w-3xl mx-auto text-center space-y-5">
            <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">
              Bespoke Creations &amp; Custom Designs
            </span>
            <h2 className="display-lg text-2xl md:text-3xl text-[var(--sukla-ivory)]">
              If You Can Imagine It, We Can Weave It
            </h2>
            <p className="font-sans text-base md:text-lg text-[var(--sukla-ivory)]/80 leading-relaxed">
              Your vision is our blueprint. We understand that every space is unique, which is why we offer comprehensive custom-order capabilities. Whether you are an interior designer seeking a highly specific color palette, a boutique hotel requiring distinct dimensions, or a homeowner with a personalized pattern in mind, our artisans can bring any design to life.
            </p>
          </div>
        </section>

        {/* From Our Looms to the World */}
        <section className="py-20 editorial-container max-w-3xl mx-auto text-center space-y-5">
          <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">From Our Looms to the World</span>
          <h2 className="display-lg text-2xl md:text-3xl text-[var(--sukla-charcoal)]">
            Local Artistry, Global Homes
          </h2>
          <p className="font-sans text-base text-[var(--sukla-charcoal)]/75 leading-relaxed">
            As an established manufacturer and worldwide exporter, Sukla Rugs bridges the gap between local artistry and global homes. We maintain strict quality control at every stage of the manufacturing process, ensuring that the final product not only meets but exceeds international standards.
          </p>
          <p className="font-sans text-base text-[var(--sukla-charcoal)]/75 leading-relaxed">
            Through seamless global shipping, a rug hand-woven by our family finds its way to yours, no matter where you are in the world.
          </p>
        </section>

        {/* Our Promise */}
        <section className="py-20 md:py-24 bg-[var(--sukla-cream)] border-t border-[var(--sukla-muted-border)]">
          <div className="editorial-container max-w-3xl mx-auto text-center space-y-6">
            <KnotGlyph size="md" className="text-[var(--sukla-terracotta)]" />
            <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">Our Promise</span>
            <h2 className="display-lg text-2xl md:text-3xl text-[var(--sukla-charcoal)]">Woven for a Lifetime</h2>
            <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/75 leading-relaxed">
              As we take our family&apos;s legacy into the future, our core values remain unchanged: uncompromising quality, ethical manufacturing, and a deep reverence for the artisans who make this all possible.
            </p>
            <p className="font-serif italic text-lg md:text-xl text-[var(--sukla-charcoal)]/80 leading-relaxed">
              &quot;When you choose Sukla Rugs, you are not just buying a piece of decor — you are bringing home a piece of our history, crafted with passion and woven for a lifetime.&quot;
            </p>
          </div>

          {/* Stats drawn from the story above, not invented figures */}
          <div className="editorial-container max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16">
            <StatBadge label="Craft Region" value="Bhadohi" sublabel="Uttar Pradesh, India" />
            <StatBadge label="Family Craft" value="Generations" sublabel="Of inherited mastery" />
            <StatBadge label="Reach" value="Worldwide" sublabel="Manufacturer &amp; exporter" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
