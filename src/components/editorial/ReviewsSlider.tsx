'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewsSliderProps {
  children: React.ReactNode;
}

const trackClass =
  '-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)] motion-reduce:scroll-auto';

const arrowClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-[var(--sukla-muted-border)] bg-[var(--sukla-ivory)] text-[var(--sukla-charcoal)] transition-colors hover:border-[var(--sukla-charcoal)] disabled:opacity-40 disabled:hover:border-[var(--sukla-muted-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]';

/**
 * Reviews track. Desktop (md and up): a plain 3-column grid, no controls.
 * Mobile: a horizontal scroll-snap slider with previous/next buttons, numbered
 * position ("2 / 6") and one dot per review so it is clear there are more.
 */
export function ReviewsSlider({ children }: ReviewsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = React.Children.count(children);

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    updateActive();
    window.addEventListener('resize', updateActive);
    return () => window.removeEventListener('resize', updateActive);
  }, [updateActive]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[Math.max(0, Math.min(count - 1, index))] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={trackRef}
        role="region"
        aria-label="Customer reviews"
        tabIndex={0}
        onScroll={updateActive}
        className={trackClass}
      >
        {children}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous review"
            className={arrowClass}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="nums text-xs tracking-[0.2em] text-[var(--sukla-charcoal)]" aria-live="polite">
              {active + 1} / {count}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to review ${index + 1} of ${count}`}
                  aria-current={index === active ? 'true' : undefined}
                  className="flex h-4 w-4 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
                >
                  <span
                    className={`block rounded-full transition-all motion-reduce:transition-none ${
                      index === active
                        ? 'h-2 w-5 bg-[var(--sukla-terracotta)]'
                        : 'h-2 w-2 bg-[var(--sukla-charcoal)]/25'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === count - 1}
            aria-label="Next review"
            className={arrowClass}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
