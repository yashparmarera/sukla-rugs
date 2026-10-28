import React from 'react';
import Image from 'next/image';
import { HomeCustomSizeCalculator } from '@/components/product/CustomSizeCalculator';
import { CUSTOM_RUG_PRICING, MAX_SIDE_FT, MIN_SIDE_FT } from '@/lib/custom-rug-pricing';
import { whatsappUrl } from '@/lib/contact';

const CONSTRUCTION_LABELS = Object.values(CUSTOM_RUG_PRICING).map((pricing) => pricing.label);

const STEPS = [
  {
    title: 'Choose construction',
    body: `Pick ${CONSTRUCTION_LABELS.slice(0, -1).join(', ')} or ${CONSTRUCTION_LABELS.at(-1)}. Each has its own rate per sq ft.`
  },
  {
    title: 'Enter your size',
    body: `Add the width and length in feet or centimetres, from ${MIN_SIDE_FT} to ${MAX_SIDE_FT} ft a side. Standard sizes use our size chart; other sizes are priced by area.`
  },
  {
    title: 'See your quote',
    body: 'You get an estimated price and lead time. Send it to our team on WhatsApp and they confirm the final price.'
  }
] as const;

/**
 * Home page "Customise your rug" section. Server component: static copy around
 * the interactive calculator, which uses the same pricing table as the product page.
 */
export const CustomiseRugSection: React.FC = () => {
  return (
    <section
      aria-labelledby="customise-rug-heading"
      className="py-12 md:py-16 bg-[var(--sukla-ivory)] border-t border-[var(--sukla-muted-border)]"
    >
      <div className="editorial-container grid grid-cols-1 md:grid-cols-2 items-start gap-8 lg:gap-14">
        {/* Desktop: the image cell is sticky below the header (items-start keeps it from stretching to
            the row height), so it stays pinned while the content and an open calculator scroll.
            The source image is a 3:4 collage with a thin white border baked in; the scale plus
            overflow-hidden crops that border so the image meets its box edge to edge. */}
        <div className="md:sticky md:top-24">
          <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:min-h-[28rem] md:max-h-[680px] overflow-hidden bg-[var(--sukla-sand)]">
            <Image
              src="/images/customise.webp"
              alt="Artisans hand-knotting, tufting and weaving a rug, with trays of coloured wool yarn samples"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover object-center scale-[1.05]"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-6">
            <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans mb-2">
              Made to your measure
            </span>
            <h2
              id="customise-rug-heading"
              className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]"
            >
              Customise your rug
            </h2>
          </div>

          <HomeCustomSizeCalculator />

          <p className="mt-6 font-sans text-base text-[var(--sukla-charcoal)]/75 leading-relaxed">
            Need a size that is not on the product page? Choose a construction, enter the width and length you need,
            and get an instant estimated price for a custom-size rug.
          </p>

          <ol className="mt-6 space-y-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-[var(--sukla-muted-border)] pt-4"
              >
                <span className="nums text-xs tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="heading text-base text-[var(--sukla-charcoal)]">{step.title}</h3>
                  <p className="mt-1 font-sans text-sm text-[var(--sukla-charcoal)]/70 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 font-sans text-sm text-[var(--sukla-charcoal)]/70">
            Prefer to talk it through?{' '}
            <a
              href={whatsappUrl("Hi Sukla Rugs, I'd like a custom-size rug.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation font-semibold uppercase tracking-[0.18em] text-[10px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sukla-charcoal)]"
            >
              Message our team on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
