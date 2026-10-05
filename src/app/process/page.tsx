import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { SectionRule } from '@/components/ui/SectionRule';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'The 7 Craft Stages of Master Knotting | SUKLA RUGS',
  description: 'Trace the 14-week journey of a Sukla rug from raw fiber sourcing and vat dyeing to master hand knotting, shearing, and sun washing in Bhadohi, UP.'
};

const STAGES = [
  {
    num: '01',
    title: 'Fiber Sourcing & Hand-Carding',
    subtitle: 'Selecting Premium New Zealand & Bikaner Raw Wool',
    description: 'Every rug begins with raw fiber selection. We source high-crimp, long-staple New Zealand wool for resilient softness and Bikaner wool for structural elasticity. Fibers are hand-carded using traditional wooden combs to align the natural strands.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '02',
    title: 'Hand-Spinning Raw Yarn',
    subtitle: 'Preserving Organic Texture & Irregular Abrash',
    description: 'Using traditional wooden spinning wheels (charkhas), master spinners convert carded wool into yarn. The subtle variations in twist density are intentional—this organic irregularity creates the prized abrash color tone depth in finished rugs.',
    image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '03',
    title: 'Eco-Friendly Vat Dyeing',
    subtitle: 'Non-Toxic AZO-Free Pigment Ingestion',
    description: 'Yarns are submerged in open copper vats heated over controlled flame. We use non-toxic, eco-certified dyes to achieve rich terracotta, indigo, and olive hues that resist fading across decades of light exposure.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '04',
    title: 'Loom Warping & Pattern Drafting',
    subtitle: 'Setting the Foundation on Vertical Wooden Looms',
    description: 'Cotton or silk warp threads are stretched under precise tension onto heavy vertical loom frames. Master weavers refer to detailed hand-painted graph maps (Naksha) that dictate knot placement down to individual pixels.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '05',
    title: 'Hand-Knotting & Weaving',
    subtitle: 'Up to 1,200,000 Individually Tied Knots',
    description: 'Sustained over 12 to 16 weeks, master artisans tie each knot by hand, slicing the yarn with a curved weaver’s knife (Chhuri) before packing the row down with a heavy iron comb (Panja).',
    image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '06',
    title: 'Washing & Natural Sun Drying',
    subtitle: 'Herbal Washing & Sun Bleaching',
    description: 'Freshly cut rugs undergo multiple wash cycles with natural eco-soaps and pure water to release loose fibers and enhance luster. Rugs are then dried flat under the sun on Bhadohi open drying lawns.',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=85'
  },
  {
    num: '07',
    title: 'Hand Shearing & Final Quality Check',
    subtitle: 'Precision Sculpting & Edge Binding',
    description: 'Master shears sculpt the pile height to exact millimeter tolerances, carving design outlines for tactile definition. Every selvage edge is hand-bound before receiving the SUKLA RUGS stamp of authenticity.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85'
  }
];

export default function ProcessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans">
              <KnotGlyph size="sm" />
              <span>Artisanal Alchemy</span>
            </div>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              The 7 Stages of Master Knotting
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--shukla-charcoal)]/75 leading-relaxed">
              A <span className="nums">14</span>-week journey of patience, discipline, and human touch in Bhadohi, Uttar Pradesh.
            </p>
          </div>

          {/* Timeline of Stages */}
          <div className="space-y-24 max-w-5xl mx-auto">
            {STAGES.map((stage, idx) => (
              <div
                key={stage.num}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative aspect-[4/3] w-full bg-[var(--shukla-sand)] border border-[var(--shukla-muted-border)] overflow-hidden shadow-subtle">
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="nums absolute top-4 left-4 text-2xl font-semibold px-3 py-1 bg-[var(--shukla-charcoal)] text-white">
                      {stage.num}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <span className="eyebrow block text-xs text-[var(--shukla-terracotta)]">
                    Stage <span className="nums">{stage.num}</span>
                  </span>
                  <h2 className="display-lg text-2xl md:text-3xl text-[var(--shukla-charcoal)]">
                    {stage.title}
                  </h2>
                  <h3 className="font-sans text-base text-[var(--shukla-taupe)]">
                    {stage.subtitle}
                  </h3>
                  <p className="text-xs font-sans text-[var(--shukla-charcoal)]/85 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <SectionRule className="my-20" />

          {/* Call to action */}
          <div className="text-center max-w-xl mx-auto space-y-6">
            <h3 className="display-lg text-2xl">Experience the Finished Masterpieces</h3>
            <p className="font-sans text-sm text-[var(--shukla-charcoal)]/75 leading-relaxed">
              Browse our collections to see how these <span className="nums">7</span> craft stages coalesce into enduring floor textiles.
            </p>
            <Button href="/shop" variant="primary" size="lg">
              Explore Rug Catalogue
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
