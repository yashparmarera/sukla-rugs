import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';

/** Copy: /story (1977, Carpet City, second-generation) and /process (7 stage names, 12 to 16 weeks of hand-knotting in stage 05). */
const STATS = [
  { value: '1977', label: 'Family foundation laid in Bhadohi' },
  { value: '7', label: 'Craft stages, from fibre sourcing to final quality check' },
  { value: '12–16', label: 'Weeks of hand-knotting and weaving per rug' }
] as const;

const PROCESS_STEPS = [
  'Fiber Sourcing & Hand-Carding',
  'Hand-Spinning Raw Yarn',
  'Eco-Friendly Vat Dyeing',
  'Loom Warping & Pattern Drafting',
  'Hand-Knotting & Weaving',
  'Washing & Natural Sun Drying',
  'Hand Shearing & Final Quality Check'
] as const;

export const BhadohiStorySection: React.FC = () => {
  return (
    <section
      aria-labelledby="bhadohi-heading"
      className="relative overflow-hidden border-y border-[var(--sukla-muted-border)] bg-white py-12 md:py-28"
    >
      <div className="editorial-container">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Image */}
          <div className="relative lg:order-2 lg:col-span-5">
            {/* Offset outline behind the photo */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden h-full w-full border border-[var(--sukla-terracotta)]/60 md:block"
            />
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden bg-[var(--sukla-sand)]">
              <Image
                src="/images/Hero%20Images%20Without%20text/3.jpg"
                alt="Master weaver at a vertical loom in a Bhadohi loom house"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[68%_center]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 hidden h-1/3 md:block bg-gradient-to-t from-black/55 to-transparent"
              />
              <p className="absolute bottom-5 left-5 right-5 hidden items-center gap-2 md:flex font-sans text-[11px] uppercase tracking-[0.22em] text-white">
                <KnotGlyph size="sm" className="text-white" />
                Bhadohi Guild Standard
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-7 text-center lg:text-left lg:order-1 lg:col-span-7 lg:pr-6">
            <p className="inline-flex items-center justify-center gap-2 lg:justify-start font-sans text-[11px] uppercase tracking-[0.25em] text-[var(--sukla-terracotta-dark)]">
              <KnotGlyph size="sm" />
              <span>Since 1977 &bull; Bhadohi, Uttar Pradesh, India</span>
            </p>

            <h2
              id="bhadohi-heading"
              className="display-lg text-2xl leading-[1.1] text-[var(--sukla-charcoal)] sm:text-4xl md:text-5xl"
            >
              Our Story Begins
              <br className="hidden sm:block" /> in the Carpet City
            </h2>

            <div aria-hidden="true" className="mx-auto lg:mx-0 h-px w-16 bg-[var(--sukla-terracotta)]" />

            <p className="font-serif text-xl italic leading-relaxed text-[var(--sukla-charcoal)]/85 md:text-2xl">
              Our rugs are not just manufactured. They are born on the loom, woven with patience, precision, and a deep
              respect for the raw materials.
            </p>

            <p className="mx-auto lg:mx-0 max-w-xl font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/75 md:text-base">
              In 1977, our family laid the foundation in Bhadohi, India's legendary Carpet City. Today, as a
              second-generation family business, we carry that vision forward through seven craft stages.
            </p>

            <ul className="flex flex-wrap justify-center lg:justify-start gap-2" aria-label="Craft process steps">
              {PROCESS_STEPS.map((step) => (
                <li
                  key={step}
                  className="border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.14em] text-[var(--sukla-charcoal)]"
                >
                  {step}
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-1 border-y border-[var(--sukla-muted-border)] sm:grid-cols-3 sm:divide-x sm:divide-[var(--sukla-muted-border)]">
              {STATS.map((stat) => (
                <div key={stat.label} className="py-5 sm:px-5 sm:first:pl-0">
                  <dt className="nums display-lg text-3xl text-[var(--sukla-charcoal)]">{stat.value}</dt>
                  <dd className="mt-1 font-sans text-xs leading-relaxed text-[var(--sukla-charcoal)]/70">{stat.label}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-1">
              <Button href="/process" variant="terracotta" size="md">
                Explore The 7 Craft Stages
              </Button>
              <Link
                href="/story"
                className="hover-underline-animation py-2 font-sans text-xs font-medium uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta-dark)]"
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
