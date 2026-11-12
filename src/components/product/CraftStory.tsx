import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Hand, Leaf, MapPin, Palette, Ruler, Hammer, Truck } from 'lucide-react';

type IconType = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>;

const BADGES: { icon: IconType; label: string }[] = [
  { icon: Hand, label: 'Handcrafted' },
  { icon: Leaf, label: 'Natural Materials' },
  { icon: MapPin, label: 'Made in India' }
];

const CRAFT_POINTS: { icon: IconType; text: string }[] = [
  { icon: Hand, text: 'Made by hand by skilled artisans' },
  { icon: Leaf, text: 'Natural materials such as wool' }
];

const STEPS: { icon: IconType; title: string; text: string }[] = [
  { icon: Palette, title: 'Choose a design', text: 'Browse our collections.' },
  { icon: Ruler, title: 'Pick a size', text: 'Or request a custom size.' },
  { icon: Hammer, title: 'We craft it', text: 'Made to order by artisans.' },
  { icon: Truck, title: 'Delivered', text: 'Sent to your door.' }
];

const ICON_CLASS = 'w-4 h-4 mt-0.5 shrink-0 text-[var(--sukla-terracotta)]';
const LINK_CLASS =
  'inline-block text-xs uppercase tracking-[0.1em] text-[var(--sukla-terracotta)] font-semibold hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

/** Shared, non-product-specific craft story shown on every product page. */
export const CraftStory: React.FC = () => (
  <section
    aria-labelledby="craft-story-heading"
    className="mt-16 pt-12 border-t border-[var(--sukla-muted-border)]"
  >
    <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-14">
      {BADGES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 text-xs uppercase tracking-[0.15em] font-sans text-[var(--sukla-charcoal)]"
        >
          <Icon className="w-5 h-5 text-[var(--sukla-terracotta)]" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 md:items-stretch">
      <div className="max-w-xl space-y-5">
        <span className="eyebrow text-xs text-[var(--sukla-taupe)] block">Our craft</span>
        <h2
          id="craft-story-heading"
          className="display-lg text-2xl sm:text-3xl text-[var(--sukla-charcoal)]"
        >
          Crafted by Artisan Hands
        </h2>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/75 leading-relaxed">
          Every Sukla rug is made by skilled artisans using traditional techniques that have been
          passed down through generations of Indian rug makers.
        </p>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/75 leading-relaxed">
          We work with natural materials such as wool, and each rug is shaped by hand, so small
          variations are part of its character.
        </p>
        <ul className="space-y-2 text-sm font-sans text-[var(--sukla-charcoal)]/80">
          {CRAFT_POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2.5">
              <Icon className={ICON_CLASS} aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <Link href="/story" className={LINK_CLASS}>
          Learn more about our story
        </Link>
      </div>
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-0 w-full overflow-hidden bg-[var(--sukla-sand)]">
        <Image
          src="/images/BTS/bts-2.jpg"
          alt="A worker carrying large hanks of natural, undyed wool yarn outdoors"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </div>

    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 md:items-stretch">
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-0 w-full overflow-hidden bg-[var(--sukla-sand)] order-2 md:order-1">
        <Image
          src="/images/BTS/bts-4.jpg"
          alt="An artisan hand-knotting a rug on a vertical loom strung with cream warp threads"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-[30%_50%]"
        />
      </div>
      <div className="max-w-xl space-y-5 order-1 md:order-2">
        <span className="eyebrow text-xs text-[var(--sukla-taupe)] block">How it works</span>
        <h2 className="display-lg text-2xl sm:text-3xl text-[var(--sukla-charcoal)]">
          From Loom to Your Home
        </h2>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/75 leading-relaxed">
          Choose a design you love in a listed size, or ask us for a custom size. Your rug is made
          to order and delivered to your door.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-2.5">
              <Icon className={ICON_CLASS} aria-hidden="true" />
              <span className="font-sans text-sm text-[var(--sukla-charcoal)]/80">
                <span className="block font-semibold text-[var(--sukla-charcoal)]">{title}</span>
                {text}
              </span>
            </li>
          ))}
        </ul>
        <Link href="/custom-rugs" className={LINK_CLASS}>
          Explore custom rugs
        </Link>
      </div>
    </div>
  </section>
);
