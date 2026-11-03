import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ROOMS = [
  {
    title: 'Living Room',
    image: '/images/shopbyroom/living%20room.webp'
  },
  {
    title: 'Bedroom',
    image: '/images/shopbyroom/bedroom.webp'
  },
  {
    title: 'Dining Room',
    image: '/images/shopbyroom/dining.webp'
  },
  {
    title: 'Entryway & Hallways',
    image: '/images/shopbyroom/hallway.webp'
  }
];

export const ShopByRoom: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-[var(--sukla-cream)] border-y border-[var(--sukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div>
            <h2 className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]">
              <span className="relative inline-block cursor-default pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--sukla-charcoal)] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
                Shop by Space
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 md:gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.title}
              href="/shop"
              className="group relative flex flex-col overflow-hidden md:bg-[var(--sukla-ivory)] md:border md:border-[var(--sukla-muted-border)]"
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden bg-[var(--sukla-sand)]">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-[var(--sukla-charcoal)]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 hidden text-white md:block">
                  <h3 className="heading text-lg group-hover:text-[var(--sukla-terracotta)] transition-colors">
                    {room.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-center font-sans text-sm text-[var(--sukla-charcoal)] transition-colors group-hover:text-[var(--sukla-terracotta)] md:hidden">
                {room.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center font-sans uppercase tracking-[0.1em] text-xs px-8 py-3 border border-[var(--sukla-charcoal)] text-[var(--sukla-charcoal)] transition-all duration-300 hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-ivory)] focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)]"
          >
            Explore
          </Link>
        </div>

      </div>
    </section>
  );
};
