'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Droplets, HeartHandshake, Landmark, Hammer, Palette, Pause, Play, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BtsItem {
  id: string;
  /** Short label for the selector chip. */
  label: string;
  icon: LucideIcon;
  image: string;
  title: string;
  description: string;
}

/** Images are the six files in /public/images/BTS, in ascending order. */
const ITEMS: readonly BtsItem[] = [
  {
    id: 'traditional',
    label: 'Traditional Craftsmanship',
    icon: Hammer,
    image: '/images/BTS/bts-1.jpg',
    title: 'Traditional Craftsmanship by suklarugs',
    description:
      'At suklarugs, we honor traditional carpet-weaving techniques using time-tested tools to craft durable, high-quality rugs designed to last for generations.',
  },
  {
    id: 'empowerment',
    label: 'Empowerment Through Artistry',
    icon: HeartHandshake,
    image: '/images/BTS/bts-2.jpg',
    title: 'Empowerment Through Artistry by suklarugs',
    description:
      'Every rug from suklarugs brings beauty to your living room while directly empowering rural women artisans. Your order creates sustainable livelihoods for talented village women, supporting their families and preserving traditional craftsmanship.',
  },
  {
    id: 'legacy',
    label: 'A Legacy of Craftsmanship',
    icon: Landmark,
    image: '/images/BTS/bts-3.jpg',
    title: 'A Legacy of Craftsmanship by suklarugs',
    description:
      'With over 50 years of rich history, this traditional loom structure at suklarugs has been the heart of thousands of handcrafted carpets. Every thread reflects decades of timeless artistry, heritage, and enduring quality.',
  },
  {
    id: 'dyes',
    label: 'Hand-Dyes Process',
    icon: Droplets,
    image: '/images/BTS/bts-4.jpg',
    title: 'Hand-Dyes Process by suklarugs',
    description:
      'At suklarugs, every vibrant carpet begins with raw natural fibers. Here, raw wool yarn is carefully transported to undergo traditional hand-dyeing, ensuring rich colors, authentic texture, and long-lasting quality for every rug we create.',
  },
  {
    id: 'color',
    label: 'Precision Color Matching',
    icon: Palette,
    image: '/images/BTS/bts-5.jpg',
    title: 'Precision Color Matching by suklarugs',
    description:
      'At suklarugs, we use comprehensive yarn color tuft boxes to ensure perfect shade accuracy. This allows you to select and customize the exact color tones that harmoniously match your living room decor and interior aesthetics.',
  },
  {
    id: 'tufting',
    label: 'The Art of Tufting',
    icon: Sparkles,
    image: '/images/BTS/bts-6.jpg',
    title: 'The Art of Tufting by suklarugs',
    description:
      'This is no ordinary tool\u2014this tufting gun at suklarugs has brought life and elegance to countless living rooms. With precision craftsmanship, it transforms raw yarn into stunning, handcrafted rugs that elevate modern home interiors.',
  },
];

const AUTO_PLAY_INTERVAL = 2000;

/** Long, gently decelerating ease so each slide glides in instead of snapping. */
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const ITEM_HEIGHT = 64;

/** Wrap v into the range [min, max). */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export const BehindTheScenes: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const count = ITEMS.length;
  const currentIndex = ((step % count) + count) % count;

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + count) % count;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    let diff = index - currentIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    if (diff === 0) return 'active';
    if (diff === -1) return 'prev';
    if (diff === 1) return 'next';
    return 'hidden';
  };

  // Reduced-motion visitors still get automatic slides, just with a shorter,
  // calmer glide instead of the full 1.4s travel.
  const spring = { duration: reduceMotion ? 0.6 : 1.4, ease: SOFT_EASE } as const;
  const cardSpring = spring;

  return (
    <section
      aria-labelledby="behind-the-scenes-heading"
      className="py-12 md:py-20 bg-white border-b border-[var(--sukla-muted-border)]"
    >
      <div className="editorial-container">
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <h2
            id="behind-the-scenes-heading"
            className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]"
          >
            <span className="relative inline-block cursor-default pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--sukla-charcoal)] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
              Behind the Scenes
            </span>
          </h2>
        </div>

        <div
          className="relative mx-auto flex w-full max-w-6xl flex-col overflow-hidden border-0 md:border md:border-[var(--sukla-muted-border)] lg:flex-row"
        >
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center border border-[var(--sukla-charcoal)]/20 bg-[var(--sukla-cream)] text-[var(--sukla-charcoal)] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sukla-terracotta)]"
          >
            {isPaused ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
          </button>
          {/* Selector list */}
          <div className="relative z-30 w-full min-h-[360px] overflow-hidden bg-[var(--sukla-charcoal)] px-6 sm:px-10 lg:min-h-[560px] lg:w-[42%] lg:px-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-16 bg-gradient-to-b from-[var(--sukla-charcoal)] via-[var(--sukla-charcoal)]/80 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-16 bg-gradient-to-t from-[var(--sukla-charcoal)] via-[var(--sukla-charcoal)]/80 to-transparent" />

            <div
              className="relative z-20 flex h-full min-h-[360px] w-full items-center justify-start lg:min-h-[560px]"
              role="tablist"
              aria-label="Behind the scenes"
              aria-orientation="vertical"
            >
              {ITEMS.map((item, index) => {
                const isActive = index === currentIndex;
                const wrapped = wrap(-(count / 2), count / 2, index - currentIndex);
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    style={{ height: ITEM_HEIGHT, width: 'fit-content', maxWidth: '100%' }}
                    animate={{
                      y: wrapped * ITEM_HEIGHT,
                      opacity: 1 - Math.abs(wrapped) * 0.25,
                    }}
                    transition={spring}
                    className="absolute flex items-center justify-start"
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`bts-tab-${item.id}`}
                      aria-selected={isActive}
                      aria-controls={`bts-card-${item.id}`}
                      onClick={() => handleChipClick(index)}
                      className={`group relative flex items-center gap-3 rounded-full border px-5 py-3 text-left transition-all duration-[1200ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sukla-terracotta)] ${
                        isActive
                          ? 'z-10 border-[var(--sukla-cream)] bg-[var(--sukla-cream)] text-[var(--sukla-charcoal)]'
                          : 'border-white/20 bg-transparent text-white/60 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <Icon aria-hidden="true" className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-[var(--sukla-terracotta-dark)]' : 'text-white/40'}`} strokeWidth={1.6} />
                      <span className="font-sans text-xs uppercase tracking-[0.1em] sm:text-[13px] whitespace-nowrap">
                        {item.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Image cards */}
          <div className="relative flex min-h-[460px] flex-1 items-center justify-center overflow-hidden border-t border-[var(--sukla-muted-border)] bg-[var(--sukla-sand)] px-6 py-14 sm:min-h-[600px] lg:min-h-[560px] lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
            <div className="relative aspect-[4/5] w-full max-w-[400px]">
              {ITEMS.map((item, index) => {
                const status = getCardStatus(index);
                const isActive = status === 'active';
                const isPrev = status === 'prev';
                const isNext = status === 'next';

                return (
                  <motion.div
                    key={item.id}
                    id={`bts-card-${item.id}`}
                    role="tabpanel"
                    aria-labelledby={`bts-tab-${item.id}`}
                    aria-hidden={!isActive}
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -90 : isNext ? 90 : 0,
                      scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                      rotate: isPrev ? -3 : isNext ? 3 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    }}
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                    transition={cardSpring}
                    className="absolute inset-0 origin-center overflow-hidden border-0 border-[var(--sukla-cream)] bg-[var(--sukla-cream)] shadow-subtle md:border-8"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1023px) 80vw, 400px"
                      className={`object-cover transition-all duration-[1400ms] ease-out ${
                        isActive ? 'grayscale-0 blur-0' : 'grayscale blur-[2px] brightness-75'
                      }`}
                    />

                    {/* initial={false}: the first render uses the animate values, so the server HTML does not
                        depend on the visitor's reduced-motion setting (which only the client knows). */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: SOFT_EASE }}
                          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-28 sm:p-6 sm:pt-32"
                        >
                          <span className="mb-3 flex w-fit items-center gap-2.5 rounded-full border border-white/30 bg-[var(--sukla-cream)] px-4 py-2 font-sans text-[11px] uppercase tracking-[0.15em] text-[var(--sukla-charcoal)]">
                            <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--sukla-terracotta-dark)]" strokeWidth={1.6} />
                            {item.label}
                          </span>
                          <p className="font-sans text-xs leading-relaxed text-white/85 sm:text-[13px]">
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
