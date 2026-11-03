import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';

/** Figures and steps below come from the existing Bhadohi / 7-stage copy; nothing new is claimed. */
const STATS = [
  { value: '1,200,000', label: 'Hand-tied knots, up to, in a single rug' },
  { value: '16', label: 'Weeks of dedicated hand weaving' },
  { value: '7', label: 'Craft stages from raw fibre to finished rug' }
] as const;

const PROCESS_STEPS = ['Hand-carding', 'Natural vat-dyeing', 'Precision warping', 'Meticulous knotting', 'Sun washing'] as const;

export const BhadohiStorySection: React.FC = () => {
  return (
    <section
      aria-labelledby="bhadohi-heading"
      className="relative overflow-hidden border-y border-[var(--sukla-muted-border)] bg-white py-20 md:py-28"
    >
      <div className="editorial-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Image */}
          <div className="relative lg:order-2 lg:col-span-5">
            {/* Offset outline behind the photo */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden h-full w-full border border-[var(--sukla-terracotta)]/60 sm:block"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sukla-sand)]">
              <Image
                src="/images/Hero%20Images%20Without%20text/3.jpg"
                alt="Master weaver at a vertical loom in a Bhadohi loom house"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[68%_center]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent"
              />
              <p className="absolute bottom-5 left-5 right-5 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-white">
                <KnotGlyph size="sm" className="text-white" />
                Bhadohi Guild Standard
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-7 lg:order-1 lg:col-span-7 lg:pr-6">
            <p className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[var(--sukla-terracotta-dark)]">
              <KnotGlyph size="sm" />
              <span>Artisan Heritage &bull; Uttar Pradesh, India</span>
            </p>

            <h2
              id="bhadohi-heading"
              className="display-lg text-3xl leading-[1.1] text-[var(--sukla-charcoal)] sm:text-4xl md:text-5xl"
            >
              Bhadohi: The Heart of
              <br className="hidden sm:block" /> Indian Rug Weaving
            </h2>

            <div aria-hidden="true" className="h-px w-16 bg-[var(--sukla-terracotta)]" />

            <p className="font-serif text-xl italic leading-relaxed text-[var(--sukla-charcoal)]/85 md:text-2xl">
              Centuries of craftsmanship flow through Bhadohi, where master weavers transform hand-spun wool and pure
              silk into enduring pieces of art.
            </p>

            <p className="max-w-xl font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/75 md:text-base">
              Every SUKLA RUG begins with natural raw materials: high-grade New Zealand wool, Bikaner long-staple
              fibres, and organic jute. Our 7-stage craft process takes those fibres through each step below.
            </p>

            <ul className="flex flex-wrap gap-2" aria-label="Craft process steps">
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

            <div className="flex flex-wrap items-center gap-5 pt-1">
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
