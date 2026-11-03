'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Hero slides. Images are the text-free photos in
 * public/images/Hero Images Without text, in order of the number in each file
 * name. The headline is live text (responsive, selectable, translatable)
 * instead of being baked into the artwork.
 *
 * `focus` is the phone-only crop point (object-position). On a tall screen the
 * 16:9 photo is cropped to a narrow slice, so each slide keeps its subject in
 * frame: the hanging rug, the weaver's hand, and the weaver at the loom. Full
 * literal classes so Tailwind sees them.
 */
const HERO_SLIDES = [
  {
    src: '/images/Hero%20Images%20Without%20text/1.jpg',
    alt: 'Handcrafted Sukla Rugs styled in a slate-walled interior',
    focus: 'object-[52%_center] md:object-center',
    eyebrow: 'Get 15% off your first rug',
    headline: 'Sukla Rugs- Designed for Living',
    // The original artwork wrapped this headline after "Designed".
    headlineWidth: 'md:max-w-[58vw]',
    eyebrowBearing: 0.047, // G
    headingBearing: 0.047 // S
  },
  {
    src: '/images/Hero%20Images%20Without%20text/2.jpg',
    alt: 'An artisan\u2019s hand guiding cotton yarn beside weaving tools',
    focus: 'object-[58%_center] md:object-center',
    eyebrow: 'Bhadohi Weaves',
    headline: 'Redefining Floor Artistry',
    headlineWidth: '',
    eyebrowBearing: 0.109, // B
    headingBearing: 0.109 // R
  },
  {
    src: '/images/Hero%20Images%20Without%20text/3.jpg',
    alt: 'A Sukla Rugs weaver working at a vertical loom',
    focus: 'object-[70%_center] md:object-center',
    eyebrow: 'Custom Rugs',
    headline: 'Crafted Without Compromise',
    headlineWidth: '',
    eyebrowBearing: 0.047, // C
    headingBearing: 0.047 // C
  }
] as const;

const SLIDE_INTERVAL_MS = 4500;

/** Small label sits this far right of the headline's left edge, in its own em. */
const EYEBROW_INDENT_EM = 0.3;

export const Hero: React.FC = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // A timeout keyed on the active slide: any manual change restarts the full
  // interval, so a slide the visitor just picked is never cut short.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setActiveImage((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [activeImage, isPlaying]);

  const goTo = (index: number) => setActiveImage((index + HERO_SLIDES.length) % HERO_SLIDES.length);

  const controlButton =
    'flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[var(--sukla-charcoal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40';

  return (
    <section
      className="relative w-full min-h-[78svh] md:min-h-[85vh] overflow-hidden bg-[var(--sukla-charcoal)]"
      aria-roledescription="carousel"
      aria-label="Sukla Rugs featured interiors"
    >
      <h1 className="sr-only">Sukla Rugs: Handcrafted Rugs for Every Space</h1>

      {/* Photos */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeImage;

        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={isActive ? slide.alt : ''}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${slide.focus}`}
            />

            {/* Phones only: bottom fade for legibility. From tablet up the text sits
                directly on the photo, exactly as in the original artwork. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:hidden"
            />
          </div>
        );
      })}

      {/* Text, button and controls: one stack, so the button and the slideshow
          controls stay in the same place on every slide. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end md:items-center">
        <div className="w-full px-5 pb-10 pt-24 md:px-0 md:pb-0 md:pl-[3.2vw] md:pt-0">
          <div className="max-w-xl md:max-w-none">
            {/* All slide texts share one grid cell; the cell is as tall as the
                longest (two-line) headline and shorter ones sit at its bottom. */}
            <div className="grid">
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeImage;

                return (
                  <div
                    key={slide.src}
                    className={`col-start-1 row-start-1 self-end transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden={!isActive}
                  >
                    {/* Sizes scale with the viewport to match the artwork: eyebrow
                        about 1.45vw, headline about 4.2vw, Montserrat Light, uppercase. */}
                    {/* Each line is pulled left by its first letter's side bearing
                        (in em, so it scales with the font size). The ink of the label
                        and the headline then starts on exactly the same vertical line. */}
                    <p
                      style={{ marginLeft: `${EYEBROW_INDENT_EM - slide.eyebrowBearing}em` }}
                      className="font-[family-name:var(--font-montserrat)] text-[clamp(0.75rem,1.45vw,1.6rem)] font-normal uppercase tracking-[0.02em] leading-none text-white"
                    >
                      {slide.eyebrow}
                    </p>
                    <h2
                      style={{ marginLeft: `${-slide.headingBearing}em` }}
                      className={`mt-2 md:mt-[0.9vw] font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4.2vw,5.5rem)] leading-[1.18] font-light uppercase tracking-normal text-white ${slide.headlineWidth}`}
                    >
                      {slide.headline}
                    </h2>
                  </div>
                );
              })}
            </div>

            {/* Button and controls share one shrink-wrapped column, so the controls
                are centred exactly beneath the Explore button. */}
            <div className="pointer-events-auto mt-4 inline-flex flex-col items-center sm:mt-8">
              <Button
                href="/shop"
                variant="secondary"
                size="lg"
                className="rounded-full border! border-white/60! bg-white/15! text-white! backdrop-blur-md px-5! py-2.5! text-[10px]! sm:px-9! sm:py-4! sm:text-xs! hover:border-white! hover:bg-white! hover:text-[var(--sukla-charcoal)]!"
              >
                <span>Explore Collections</span>
                <ArrowRight size={17} strokeWidth={1.7} className="ml-2 h-3.5 w-3.5 sm:ml-3 sm:h-[17px] sm:w-[17px]" />
              </Button>

              {/* Slideshow controls: previous, pause/play, next. */}
              <div
                className="mt-5 flex items-center md:mt-6"
                role="group"
                aria-label="Hero slideshow controls"
              >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(activeImage - 1)}
                  className={controlButton}
                  aria-label="Previous slide"
                  title="Previous slide"
                >
                  <ArrowLeft size={16} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((playing) => !playing)}
                  className={controlButton}
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? <Pause size={15} strokeWidth={1.6} /> : <Play size={15} strokeWidth={1.6} />}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeImage + 1)}
                  className={controlButton}
                  aria-label="Next slide"
                  title="Next slide"
                >
                  <ArrowRight size={16} strokeWidth={1.6} />
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
