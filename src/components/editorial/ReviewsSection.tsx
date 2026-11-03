import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/shopify/mock-data';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-36 bg-[var(--sukla-cream)] border-b border-[var(--sukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-24 space-y-3">
          <KnotGlyph size="sm" className="text-[var(--sukla-terracotta)]" />
          <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe)] font-sans">
            Client Testimonials & Patrons
          </span>
          <h2 className="display-lg text-2xl md:text-5xl text-[var(--sukla-charcoal)]">
            Acclaimed by Designers &amp; Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-10">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-0 text-center md:text-left md:p-8 lg:p-10 md:bg-[var(--sukla-ivory)] md:border md:border-[var(--sukla-muted-border)] flex flex-col justify-between space-y-6 md:shadow-subtle md:hover:border-[var(--sukla-taupe)] transition-colors"
            >
              {(review.rating || review.verifiedPurchase || review.title || review.content) && (
                <div className="space-y-4">
                  {(review.rating || review.verifiedPurchase) && (
                    <div className="flex items-center justify-center md:justify-between">
                      <div className="flex text-[var(--sukla-terracotta)] gap-1">
                        {[...Array(review.rating ?? 0)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--sukla-terracotta)]" />
                        ))}
                      </div>
                      {review.verifiedPurchase && (
                        <span className="hidden md:flex items-center gap-1 text-[10px] uppercase font-sans text-[var(--sukla-taupe)]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Patron
                        </span>
                      )}
                    </div>
                  )}

                  {review.title && (
                    <h3 className="heading text-lg md:text-xl text-[var(--sukla-charcoal)]">
                      &quot;{review.title}&quot;
                    </h3>
                  )}

                  {review.content && (
                    <p className="font-serif italic text-base text-[var(--sukla-charcoal)]/80 leading-relaxed">
                      {review.content}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-0 md:pt-4 md:border-t md:border-[var(--sukla-muted-border)] flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs font-sans">
                <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={`${review.author}, reviewer`}
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 rounded-full border border-[var(--sukla-muted-border)] object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--sukla-muted-border)] bg-[var(--sukla-sand)] text-sm font-medium text-[var(--sukla-charcoal)]"
                    >
                      {review.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </span>
                  )}
                  <div>
                    <span className="block text-sm font-medium text-[var(--sukla-charcoal)]">{review.author}</span>
                    <span className="block text-[11px] text-[var(--sukla-taupe)]">{review.location}</span>
                  </div>
                </div>
                {review.productHandle && review.productTitle && (
                  <Link
                    href={`/products/${review.productHandle}`}
                    className="text-[10px] uppercase tracking-wider text-[var(--sukla-terracotta)] hover:underline font-medium"
                  >
                    {review.productTitle}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
