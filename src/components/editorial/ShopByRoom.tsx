import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { shopHref } from '@/lib/shop-menu';

interface Room {
  title: string;
  /** Small uppercase descriptor. */
  tag: string;
  description: string;
  image: string;
  href: string;
  /** Visible text after "Shop ". */
  ctaLabel: string;
  /** Must contain the visible CTA text (label-in-name). */
  ariaLabel: string;
  sizes: string;
  /** <li> classes (grid placement). */
  item: string;
  /** Image box aspect classes. */
  media: string;
  /** h3 size classes. */
  heading: string;
  /** Optional object-position class. */
  position?: string;
}

const WIDE_SIZES = '(max-width: 1023px) 100vw, (max-width: 1440px) 50vw, 640px';
const HALF_SIZES = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1440px) 25vw, 320px';

const ROOMS: readonly Room[] = [
  {
    title: 'Living Room',
    tag: 'Seating areas',
    description: 'Grounding anchors for grand & intimate seating areas',
    image: '/images/shopbyroom/living%20room.webp',
    href: shopHref('room', 'living-room'),
    ctaLabel: 'living room',
    ariaLabel: 'Shop living room rugs',
    sizes: WIDE_SIZES,
    item: 'md:col-span-2 lg:col-span-6 lg:row-span-2',
    media: 'aspect-[4/5] md:aspect-[3/2] lg:aspect-auto lg:min-h-[26rem] lg:flex-1',
    heading: 'text-3xl md:text-4xl lg:text-5xl',
  },
  {
    title: 'Bedroom',
    tag: 'Sleep & rest',
    description: 'Soft plush piles providing morning warmth barefoot',
    image: '/images/shopbyroom/bedroom.webp',
    href: shopHref('room', 'bedroom'),
    ctaLabel: 'bedroom',
    ariaLabel: 'Shop bedroom rugs',
    sizes: HALF_SIZES,
    item: 'lg:col-span-3 lg:self-start',
    media: 'aspect-[5/4] md:aspect-[4/5]',
    heading: 'text-2xl md:text-3xl lg:text-2xl xl:text-3xl',
  },
  {
    title: 'Dining Room',
    tag: 'Dine & gather',
    description: 'Low-profile weaves for smooth chair movement & stain resistance',
    image: '/images/shopbyroom/dining.webp',
    href: shopHref('room', 'dining-room'),
    ctaLabel: 'dining room',
    ariaLabel: 'Shop dining room rugs',
    sizes: HALF_SIZES,
    item: 'md:mt-12 lg:col-span-3 lg:mt-16 lg:self-start',
    media: 'aspect-[4/5] md:aspect-[4/5] lg:aspect-square',
    heading: 'text-2xl md:text-3xl lg:text-2xl xl:text-3xl',
  },
  {
    title: 'Entryway & Hallways',
    tag: 'High-traffic',
    description: 'Resilient high-traffic runners & organic natural jute textures',
    image: '/images/shopbyroom/hallway.webp',
    href: shopHref('collection', 'runners'),
    ctaLabel: 'runners',
    ariaLabel: 'Shop runners for entryways and hallways',
    sizes: WIDE_SIZES,
    item: 'md:col-span-2 lg:col-span-6 lg:self-start',
    media: 'aspect-[5/4] md:aspect-[3/2] lg:aspect-[5/2]',
    heading: 'text-2xl md:text-3xl lg:text-4xl',
  },
];

export const ShopByRoom: React.FC = () => (
  <section
    aria-labelledby="shop-by-space-heading"
    className="border-t border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] py-16 md:py-24"
  >
    <div className="editorial-container">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 border-b border-[var(--sukla-muted-border)] pb-8 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-3 text-xs tracking-[0.25em] text-[var(--sukla-terracotta-dark)]">
            <span aria-hidden="true" className="h-px w-10 bg-[var(--sukla-terracotta)]" />
            Architectural Placement
          </p>
          <h2
            id="shop-by-space-heading"
            className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em] text-[var(--sukla-charcoal)] md:text-5xl xl:text-6xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Shop by <em className="italic text-[var(--sukla-terracotta-dark)]">Space</em> &amp;{' '}
            <em className="italic text-[var(--sukla-terracotta-dark)]">Scale</em>
          </h2>
        </div>

        <div className="flex max-w-sm flex-col gap-5 lg:items-end lg:text-right">
          <p className="font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/75">
            Begin with the room you are dressing, then use the size guide to find the scale that fits it.
          </p>
          <Link
            href="/guides/rug-size"
            className="group/guide hover-underline-animation hidden items-center gap-2 self-start font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)] sm:inline-flex lg:self-auto"
          >
            Explore Interactive Size Guide
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 group-hover/guide:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Plates */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10"
      >
        {ROOMS.map((room, index) => {
          const numeral = String(index + 1).padStart(2, '0');
          return (
            <li key={room.title} className={`min-w-0 ${room.item}`}>
              <Link
                href={room.href}
                aria-label={room.ariaLabel}
                className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)]"
              >
                <div className={`relative w-full overflow-hidden bg-[var(--sukla-sand)] ${room.media}`}>
                  <Image
                    src={room.image}
                    alt={`${room.title} interior`}
                    fill
                    sizes={room.sizes}
                    className={`object-cover ${room.position ?? ''} motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105`}
                  />
                  <span
                    aria-hidden="true"
                    className="nums absolute left-0 top-3 bg-[var(--sukla-cream)] px-2.5 py-1 text-[11px] tracking-[0.25em] text-[var(--sukla-charcoal)] md:top-4 md:px-3"
                  >
                    {numeral}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2 border border-[var(--sukla-cream)]/70 opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:inset-3"
                  />
                </div>

                <div className="relative mt-5 border-t border-[var(--sukla-muted-border)] pt-4">
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-[var(--sukla-terracotta)] motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--sukla-terracotta-dark)]">
                    {room.tag}
                  </p>
                  <h3
                    className={`mt-2 font-serif font-normal leading-tight text-[var(--sukla-charcoal)] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-[var(--sukla-terracotta-dark)] ${room.heading}`}
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {room.title}
                  </h3>
                  <p className="mt-2 max-w-[38ch] font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/75">
                    {room.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--sukla-charcoal)] group-hover:text-[var(--sukla-terracotta-dark)]">
                    Shop {room.ctaLabel}
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile: the header link is hidden below sm, so repeat it here */}
      <Link
        href="/guides/rug-size"
        className="mt-10 flex min-h-11 items-center justify-center gap-2 border border-[var(--sukla-charcoal)] px-6 font-sans text-xs uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-cream)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sukla-charcoal)] motion-safe:transition-colors motion-safe:duration-300 sm:hidden"
      >
        Explore Interactive Size Guide
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </div>
  </section>
);
