'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { heroImages } from '@/components/hero/hero-images';

export const Hero: React.FC = () => {
  const [activeImage, setActiveImage] = useState(0);

  const moveSlide = (direction: number) => {
    setActiveImage((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    const slideshow = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(slideshow);
  }, []);

  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)]"
      aria-roledescription="carousel"
      aria-label="Sukla Rugs featured interiors"
    >
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === activeImage ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={index !== activeImage}
          >
            <Image
              src={image.src}
              alt={index === activeImage ? image.alt : ''}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover scale-105"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 editorial-container py-20 text-center max-w-4xl mx-auto">
        <div className="mx-auto max-w-2xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.42em] text-white">
            <span className="hero-text-backdrop">Handcrafted Rugs</span>
          </p>

          <h1 className="mt-6 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-0.02em] text-white leading-[0.88]">
            <span className="hero-text-backdrop">Rugs for <br />Every Space</span>
          </h1>

          <div className="mx-auto mt-8 h-px w-20 bg-white/80" />

          <p className="mt-7 font-sans text-sm sm:text-base leading-relaxed text-white max-w-md mx-auto">
            <span className="hero-text-backdrop">From serene corners to everyday journeys, our handcrafted rugs bring warmth, texture and character to every space.</span>
          </p>

          <div className="mt-8 flex justify-center">
            <Button href="/shop" variant="secondary" size="lg" className="rounded-full border-0 bg-[var(--shukla-cream)] px-9 py-4 text-[var(--shukla-charcoal)] hover:bg-white">
              <span>Explore Collections</span>
              <ArrowRight size={17} strokeWidth={1.7} className="ml-3" />
            </Button>
          </div>

          <div className="mt-5 flex justify-center gap-3" aria-label="Control hero slideshow">
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--shukla-charcoal)]"
              aria-label="Previous hero image"
              title="Previous hero image"
            >
              <ArrowLeft size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--shukla-charcoal)]"
              aria-label="Next hero image"
              title="Next hero image"
            >
              <ArrowRight size={18} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
