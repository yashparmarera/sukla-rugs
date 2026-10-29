import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Custom Rugs: Made Just for You | SUKLA RUGS',
  description:
    'Fully customizable rugs, designed by you and crafted by our skilled artisans. The process is easy, collaborative, and completely free of extra charges.',
};

/** Owner-supplied stage copy (verbatim) paired with the illustrations in public/images/custom-page. */
const PROCESS_STAGES = [
  {
    title: 'Initial Consultation',
    description:
      "You connect with us, and we discuss your client's specific vision, room requirements, color preferences, and budget to lay the right foundation.",
    image: '/images/custom-page/grid1.jpg',
    alt: 'Illustration of a woman on a sofa with a laptop, describing the rug she has in mind'
  },
  {
    title: 'Design & Visualization',
    description:
      'Our design team creates tailored rug patterns and color palettes based on your inputs and shares them with you for final approval.',
    image: '/images/custom-page/grid2.jpg',
    alt: 'Illustration of designers sketching a rug pattern at a table with colour drafts and a finished sample'
  },
  {
    title: 'Crafting & Weaving',
    description:
      'Master artisans bring the approved design to life on the loom, weaving each detail with precision and craftsmanship.',
    image: '/images/custom-page/grid3.jpg',
    alt: 'Illustration of two artisans weaving a rug by hand on a wooden loom'
  },
  {
    title: 'Quality Inspection & Delivery',
    description:
      'After thorough quality checks, the finished custom rug is safely packaged and delivered directly to your client’s doorstep.',
    image: '/images/custom-page/grid4.jpg',
    alt: 'Illustration of a courier delivering a rolled rug to a smiling customer, and the rug unrolled in her living room'
  }
] as const;

export default function CustomisationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-cream)]">
      <Header />

      <main className="flex-1">
        {/* Intro: craft collage on the left, text on the right from md up.
            On mobile the text comes first (it holds the page h1), then the image. */}
        <section className="bg-[var(--sukla-ivory)] border-b border-[var(--sukla-muted-border)] py-8 md:py-12">
          <div className="editorial-container grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
            <div className="max-w-2xl space-y-4">
              <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--sukla-charcoal)]">
                Custom Rugs, Made Just for You
              </h1>
              <h2 className="font-sans text-sm md:text-base text-[var(--sukla-taupe)]">
                Create Your Dream Rug with Sukla Rugs
              </h2>
              <p className="font-sans text-sm md:text-base text-[var(--sukla-charcoal)]/75 leading-relaxed max-w-prose">
                At Sukla Rugs, we believe a home should reflect the people who live in it. Every rug we customise is
                designed with you and handcrafted by our skilled artisans in Bhadohi. Whether you arrive with a clear
                vision or only an idea, our team will guide you through each step. The process is simple and
                collaborative, and there are no extra charges for customisation.
              </p>
            </div>

            {/* Compact collage: capped at 320px on mobile, 360px from lg up */}
            <figure className="mx-auto w-full max-w-xs overflow-hidden border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] md:order-first md:mx-0 md:max-w-[360px] md:justify-self-start">
              <Image
                src="/images/customisation-2.webp"
                alt="Artisans hand-knotting, hand-shearing and hand-tufting rugs, with trays of wool colour samples"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 768px) 320px, 360px"
                className="h-auto w-full"
              />
            </figure>
          </div>
        </section>

        {/* Process: the four stages as cards (image on top, then eyebrow, title, description).
            One column on mobile, 2x2 from sm, a single row of four from lg. */}
        <section className="py-10 md:py-14" aria-labelledby="customisation-process-heading">
          <div className="editorial-container">
            <h2
              id="customisation-process-heading"
              className="display-lg mb-8 text-center text-2xl sm:text-3xl md:mb-10 md:text-4xl text-[var(--sukla-charcoal)]"
            >
              Our Rug Customization Process
            </h2>

            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {PROCESS_STAGES.map((stage, index) => (
                <li key={stage.title} className="mx-auto flex w-full max-w-sm flex-col gap-4 sm:max-w-none">
                  <figure className="overflow-hidden border border-[var(--sukla-muted-border)] bg-[var(--sukla-ivory)]">
                    <Image
                      src={stage.image}
                      alt={stage.alt}
                      width={1024}
                      height={1024}
                      sizes="(max-width: 640px) 384px, (max-width: 1024px) 45vw, 320px"
                      className="h-auto w-full"
                    />
                  </figure>

                  <div className="space-y-2">
                    <span className="eyebrow block text-xs text-[var(--sukla-terracotta)]">Stage {index + 1}</span>
                    <h3 className="display-lg text-xl md:text-2xl text-[var(--sukla-charcoal)]">{stage.title}</h3>
                    <p className="font-sans text-sm text-[var(--sukla-charcoal)]/75 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>      </main>

      <Footer />
    </div>
  );
}
