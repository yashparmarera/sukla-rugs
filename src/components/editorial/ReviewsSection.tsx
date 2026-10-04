import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/shopify/mock-data';
import { KnotGlyph } from '@/components/ui/KnotGlyph';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--shukla-cream)] border-b border-[var(--shukla-muted-border)]">
      <div className="editorial-container">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <KnotGlyph size="sm" className="text-[var(--shukla-terracotta)]" />
          <span className="block text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans">
            Client Testimonials & Patrons
          </span>
          <h2 className="display-lg text-3xl md:text-4xl text-[var(--shukla-charcoal)]">
            Acclaimed by Designers &amp; Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-8 bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] flex flex-col justify-between space-y-6 shadow-subtle hover:border-[var(--shukla-taupe)] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-[var(--shukla-terracotta)] gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--shukla-terracotta)]" />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-sans text-[var(--shukla-taupe)]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Patron
                    </span>
                  )}
                </div>

                <h3 className="heading text-base text-[var(--shukla-charcoal)]">
                  &quot;{review.title}&quot;
                </h3>

                <p className="font-serif italic text-sm text-[var(--shukla-charcoal)]/80 leading-relaxed">
                  {review.content}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--shukla-muted-border)] flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="block font-medium text-[var(--shukla-charcoal)]">{review.author}</span>
                  <span className="block text-[10px] text-[var(--shukla-taupe)]">{review.location}</span>
                </div>
                {review.productHandle && review.productTitle && (
                  <Link
                    href={`/products/${review.productHandle}`}
                    className="text-[10px] uppercase tracking-wider text-[var(--shukla-terracotta)] hover:underline font-medium"
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
