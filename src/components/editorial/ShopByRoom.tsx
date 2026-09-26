import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ROOMS = [
  {
    title: 'Living Room',
    subtitle: 'Grounding anchors for grand & intimate seating areas',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
    query: 'living-room',
    recommendation: "Suggested: 8' x 10' or 9' x 12' Hand-Knotted Oushak"
  },
  {
    title: 'Bedroom',
    subtitle: 'Soft plush piles providing morning warmth barefoot',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85',
    query: 'bedroom',
    recommendation: "Suggested: 8' x 10' High-Low Artisan Loop"
  },
  {
    title: 'Dining Room',
    subtitle: 'Low-profile weaves for smooth chair movement & stain resistance',
    image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=85',
    query: 'dining-room',
    recommendation: "Suggested: 8' x 10' Reversible Flatweave"
  },
  {
    title: 'Entryway & Hallways',
    subtitle: 'Resilient high-traffic runners & organic natural jute textures',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=85',
    query: 'entryway',
    recommendation: "Suggested: 3' x 10' Organic Jute Runner"
  }
];

export const ShopByRoom: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--shukla-cream)] border-y border-[var(--shukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="block text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans mb-2">
              Architectural Placement
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[var(--shukla-charcoal)] uppercase">
              Shop by Space & Scale
            </h2>
          </div>
          <Link
            href="/guides/rug-size"
            className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover-underline-animation flex items-center gap-2 font-semibold"
          >
            Explore Interactive Size Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.title}
              href={`/shop?room=${room.query}`}
              className="group relative flex flex-col bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--shukla-sand)]">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--shukla-charcoal)]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-lg uppercase tracking-wider mb-1 group-hover:text-[var(--shukla-terracotta)] transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs font-sans text-white/80 line-clamp-2">
                    {room.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[var(--shukla-ivory)] border-t border-[var(--shukla-muted-border)] flex items-center justify-between text-xs font-sans text-[var(--shukla-charcoal)]">
                <span className="font-serif italic text-[var(--shukla-taupe)] text-[11px] truncate">
                  {room.recommendation}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--shukla-charcoal)] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
