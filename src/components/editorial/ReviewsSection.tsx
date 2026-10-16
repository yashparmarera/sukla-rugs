import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/shopify/mock-data';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--sukla-cream)] border-b border-[var(--sukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <KnotGlyph size="sm" className="text-[var(--sukla-terracotta)]" />
          <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe)] font-sans">
            Client Testimonials & Patrons
          </span>
          <h2 className="display-lg text-3xl md:text-4xl text-[var(--sukla-charcoal)]">
            Acclaimed by Designers &amp; Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-8 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] flex flex-col justify-between space-y-6 shadow-subtle hover:border-[var(--sukla-taupe)] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-[var(--sukla-terracotta)] gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--sukla-terracotta)]" />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-sans text-[var(--sukla-taupe)]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Patron
                    </span>
                  )}
                </div>

                <h3 className="heading text-base text-[var(--sukla-charcoal)]">
                  &quot;{review.title}&quot;
                </h3>

                <p className="font-serif italic text-sm text-[var(--sukla-charcoal)]/80 leading-relaxed">
                  {review.content}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--sukla-muted-border)] flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="block font-medium text-[var(--sukla-charcoal)]">{review.author}</span>
                  <span className="block text-[10px] text-[var(--sukla-taupe)]">{review.location}</span>
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
