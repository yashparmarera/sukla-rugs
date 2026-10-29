import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ROOMS = [
  {
    title: 'Living Room',
    subtitle: 'Grounding anchors for grand & intimate seating areas',
    image: '/images/shopbyroom/living%20room.webp',
    recommendation: "Suggested: 8' x 10' or 9' x 12' Hand-Knotted Oushak"
  },
  {
    title: 'Bedroom',
    subtitle: 'Soft plush piles providing morning warmth barefoot',
    image: '/images/shopbyroom/bedroom.webp',
    recommendation: "Suggested: 8' x 10' High-Low Artisan Loop"
  },
  {
    title: 'Dining Room',
    subtitle: 'Low-profile weaves for smooth chair movement & stain resistance',
    image: '/images/shopbyroom/dining.webp',
    recommendation: "Suggested: 8' x 10' Reversible Flatweave"
  },
  {
    title: 'Entryway & Hallways',
    subtitle: 'Resilient high-traffic runners & organic natural jute textures',
    image: '/images/shopbyroom/hallway.webp',
    recommendation: "Suggested: 3' x 10' Organic Jute Runner"
  }
];

export const ShopByRoom: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--sukla-cream)] border-y border-[var(--sukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans mb-2">
              Architectural Placement
            </span>
            <h2 className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]">
              Shop by Space &amp; Scale
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation flex items-center gap-2 font-semibold"
          >
            Explore Interactive Size Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.title}
              href="/shop"
              className="group relative flex flex-col bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sukla-sand)]">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--sukla-charcoal)]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="heading text-lg mb-1 group-hover:text-[var(--sukla-terracotta)] transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs font-sans text-white/80 line-clamp-2">
                    {room.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[var(--sukla-ivory)] border-t border-[var(--sukla-muted-border)] flex items-center justify-between text-xs font-sans text-[var(--sukla-charcoal)]">
                <span className="font-sans text-[var(--sukla-taupe)] text-[11px] truncate">
                  {room.recommendation}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--sukla-charcoal)] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
