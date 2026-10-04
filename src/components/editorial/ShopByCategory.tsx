import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
  {
    title: 'Natural fibre rugs',
    image: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Shaggy rugs',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Washable rugs',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Viscose rugs',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85'
  }
];

export const ShopByCategory: React.FC = () => {
  return (
    <section className="bg-[var(--shukla-ivory)] py-16 md:py-20">
      <div className="editorial-container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading text-2xl md:text-3xl text-[var(--shukla-charcoal)]">
            Shop rugs by category
          </h2>
          <Link
            href="/shop"
            className="hidden text-xs font-sans uppercase tracking-[0.18em] text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover-underline-animation sm:block"
          >
            View all rugs
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8">
          {CATEGORIES.map((category) => (
            <Link key={category.title} href="/shop" className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--shukla-sand)]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-sm font-sans text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
