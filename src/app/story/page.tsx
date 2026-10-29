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
        <section className="relative w-full">
          <h1 className="sr-only">Contemporary Indian Luxury Rooted in Craftsmanship</h1>
          <Image
            src="/images/aboutusbanner.webp"
            alt="Sukla Rugs: Bhadohi to the World, every rug tells a story"
            width={2400}
            height={1000}
            priority
            sizes="100vw"
            className="w-full h-auto"
          />
        </section>

        {/* Opening Statement */}
        <section className="pt-8 md:pt-10 pb-20 md:pb-28 editorial-container">
          {/* Welcome */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="eyebrow text-xs text-[var(--sukla-terracotta)] block">About Us</span>
            <h2 className="display-lg text-3xl md:text-4xl text-[var(--sukla-charcoal)]">
              Welcome to Sukla Rugs: Our Story Begins in the Carpet City
            </h2>
            <div className="flex items-center justify-center gap-4 pt-2" aria-hidden="true">
              <span className="h-px w-12 bg-[var(--sukla-terracotta)]/50" />
              <span className="font-serif italic text-[var(--sukla-terracotta)] text-lg">Since 1977</span>
              <span className="h-px w-12 bg-[var(--sukla-terracotta)]/50" />
            </div>
            <p className="font-sans text-lg md:text-xl text-[var(--sukla-charcoal)]/80 leading-relaxed">
              In 1977, our family laid the foundation of what would become a lifelong passion in Bhadohi, Uttar Pradesh, India&apos;s legendary Carpet City. We started with a simple vision: to craft rugs that carry the soul of traditional artistry into the modern home.
            </p>
            <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/70 leading-relaxed">
              Today, as a second-generation family business, Sukla Rugs proudly carries that original vision forward, preserving the techniques passed down through our family while sharing our heritage with the world.
            </p>
          </div>

          {/* Two pillars */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 max-w-5xl mx-auto md:divide-x divide-[var(--sukla-muted-border)]">
            <article className="space-y-4 md:pr-12 text-center md:text-left">
              <span className="eyebrow text-[11px] text-[var(--sukla-terracotta)] block">01</span>
              <h3 className="display-lg text-2xl text-[var(--sukla-charcoal)]">The Hands Behind the Heritage</h3>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
                Every piece we create is a testament to the artisans who dedicate their lives to this craft. From the intricate, timeless rhythms of hand-knotted designs to the rich, earthy textures of hand-tufted wool and natural jute, our rugs are not just manufactured. They are born on the loom, woven with patience, precision, and a deep respect for the raw materials.
              </p>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
                When you bring one of our creations into your space, you are bringing home a tangible piece of Bhadohi&apos;s celebrated history.
              </p>
            </article>
            <article className="space-y-4 md:pl-12 text-center md:text-left">
              <span className="eyebrow text-[11px] text-[var(--sukla-terracotta)] block">02</span>
              <h3 className="display-lg text-2xl text-[var(--sukla-charcoal)]">From Our Looms to Your Living Room</h3>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
                We believe a rug is far more than a floor covering. It is the foundation of your sanctuary: where your family gathers, where your pets curl up to rest, and where your bare feet find warmth and comfort after a long day. It is the quiet backdrop to your favorite memories.
              </p>
              <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
                We ship our creations globally because the desire for authentic, soulful craftsmanship knows no borders.
              </p>
            </article>
          </div>

          {/* Closing */}
          <div className="mt-16 md:mt-20 max-w-2xl mx-auto text-center space-y-4 border-t border-[var(--sukla-muted-border)] pt-12">
            <p className="font-serif italic text-xl md:text-2xl text-[var(--sukla-charcoal)] leading-relaxed">
              Our legacy starts here at the loom, but it is fulfilled in your home.
            </p>
            <p className="font-sans text-base text-[var(--sukla-charcoal)]/70 leading-relaxed">
              Thank you for letting the Sukla Rugs family&apos;s life work become a beautiful part of your everyday moments.
            </p>
          </div>
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
                src="/images/customisation-2.webp"
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
