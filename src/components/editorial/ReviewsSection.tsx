import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/shopify/mock-data';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { ReviewsSlider } from '@/components/editorial/ReviewsSlider';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="font-[family-name:var(--font-montserrat)] py-8 md:py-14 bg-[var(--sukla-cream)] border-b border-[var(--sukla-muted-border)]">
      <div className="editorial-container">

        <div className="mx-auto mb-6 md:mb-8 flex flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-5">
          <KnotGlyph size="lg" className="!h-14 !w-14 shrink-0 text-[var(--sukla-terracotta)]" />
          <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe-text)] font-[family-name:var(--font-montserrat)] md:whitespace-nowrap">
            Client Testimonials &amp; Patrons
          </span>
          <span aria-hidden="true" className="hidden h-6 w-px bg-[var(--sukla-muted-border)] md:block" />
          <h2 className="display-lg font-[family-name:var(--font-montserrat)] !font-light text-2xl md:text-3xl text-[var(--sukla-charcoal)] md:whitespace-nowrap">
            Acclaimed by Designers &amp; Homeowners
          </h2>
        </div>

        <ReviewsSlider>
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="basis-[82%] shrink-0 snap-center p-4 text-center md:basis-auto md:shrink md:text-left md:p-6 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] flex flex-col justify-between space-y-3 md:space-y-4 md:shadow-subtle md:hover:border-[var(--sukla-taupe)] transition-colors"
            >
              {(review.rating || review.verifiedPurchase || review.title || review.content) && (
                <div className="space-y-2 md:space-y-4">
                  {(review.rating || review.verifiedPurchase) && (
                    <div className="flex items-center justify-center md:justify-between">
                      <div className="flex text-[var(--sukla-terracotta)] gap-1">
                        {[...Array(review.rating ?? 0)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--sukla-terracotta)]" />
                        ))}
                      </div>
                      {review.verifiedPurchase && (
                        <span className="hidden md:flex items-center gap-1 text-[10px] uppercase font-[family-name:var(--font-montserrat)] text-[var(--sukla-taupe-text)]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Patron
                        </span>
                      )}
                    </div>
                  )}

                  {review.title && (
                    <h3 className="heading font-[family-name:var(--font-montserrat)] !font-medium text-base md:text-lg text-[var(--sukla-charcoal)] leading-snug">
                      &quot;{review.title}&quot;
                    </h3>
                  )}

                  {review.content && (
                    <p className="font-[family-name:var(--font-montserrat)] not-italic font-normal text-sm md:text-[15px] text-[var(--sukla-charcoal)]/80 leading-relaxed line-clamp-6 md:line-clamp-none">
                      {review.content}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-0 md:pt-4 md:border-t md:border-[var(--sukla-muted-border)] flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs font-[family-name:var(--font-montserrat)]">
                <div className="flex flex-row md:flex-row items-center gap-3 text-left">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={`${review.author}, reviewer`}
                      width={56}
                      height={56}
                      className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full border border-[var(--sukla-muted-border)] object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full border border-[var(--sukla-muted-border)] bg-[var(--sukla-sand)] text-sm font-medium text-[var(--sukla-charcoal)]"
                    >
                      {review.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </span>
                  )}
                  <div>
                    <span className="block text-sm font-semibold text-[var(--sukla-charcoal)]">{review.author}</span>
                    <span className="block text-[11px] text-[var(--sukla-taupe-text)]">{review.location}</span>
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
        </ReviewsSlider>

      </div>
    </section>
  );
};
