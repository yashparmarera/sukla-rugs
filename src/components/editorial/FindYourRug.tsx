'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { FindYourRugGroup } from '@/lib/find-your-rug';

interface FindYourRugProps {
  /** Style and Construction groups built from real Shopify data (see src/lib/find-your-rug.ts). */
  groups: FindYourRugGroup[];
}

/** Full literal classes so Tailwind sees them. Keeps rows balanced for 5 or 6 tiles. */
function basisClass(count: number): string {
  if (count >= 6) {
    return 'basis-[calc(50%-0.75rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(16.666%-1.25rem)]';
  }
  if (count === 5) {
    return 'basis-[calc(50%-0.75rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(20%-1.2rem)]';
  }
  return 'basis-[calc(50%-0.75rem)] md:basis-[calc(25%-1.125rem)]';
}

export const FindYourRug: React.FC<FindYourRugProps> = ({ groups }) => {
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (groups.length === 0) return null;

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % groups.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + groups.length) % groups.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = groups.length - 1;
    else return;
    event.preventDefault();
    const target = groups[next];
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  };

  return (
    <section
      aria-labelledby="find-your-rug-heading"
      className="py-20 bg-white border-b border-[var(--sukla-muted-border)]"
    >
      <div className="editorial-container">
        <div className="flex flex-col items-center text-center mb-10">
          <h2
            id="find-your-rug-heading"
            className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]"
          >
            <span className="relative inline-block cursor-default pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--sukla-charcoal)] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
              Choose Your Craft
            </span>
          </h2>

          <div role="tablist" aria-label="Choose your craft by" className="mt-6 flex items-center justify-center gap-8">
            {groups.map((group, index) => {
              const selected = group.id === activeId;
              return (
                <button
                  key={group.id}
                  ref={(el) => {
                    tabRefs.current[group.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`find-your-rug-tab-${group.id}`}
                  aria-selected={selected}
                  aria-controls={`find-your-rug-panel-${group.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(group.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`border-b pb-1 font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sukla-charcoal)] ${
                    selected
                      ? 'border-[var(--sukla-charcoal)] text-[var(--sukla-charcoal)]'
                      : 'border-transparent text-[var(--sukla-charcoal)]/60 hover:text-[var(--sukla-charcoal)]'
                  }`}
                >
                  {group.heading}
                </button>
              );
            })}
          </div>
        </div>

        {groups.map((group) => (
          <div
            key={group.id}
            role="tabpanel"
            id={`find-your-rug-panel-${group.id}`}
            aria-labelledby={`find-your-rug-tab-${group.id}`}
            hidden={group.id !== activeId}
          >
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10">
              {group.tiles.map((tile) => (
                <li key={tile.href} className={basisClass(group.tiles.length)}>
                  <Link
                    href={tile.href}
                    aria-label={`Shop ${tile.label} rugs`}
                    className="group block text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sukla-charcoal)]"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--sukla-sand)]">
                      {tile.image ? (
                        <Image
                          src={tile.image.url}
                          alt={`${tile.label} rug`}
                          fill
                          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 18vw"
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        />
                      ) : (
                        <div aria-hidden="true" className="craft-texture absolute inset-0" />
                      )}
                    </div>
                    <p className="mt-4 font-sans text-sm md:text-base text-[var(--sukla-charcoal)] transition-colors group-hover:text-[var(--sukla-terracotta)]">
                      {tile.label}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
