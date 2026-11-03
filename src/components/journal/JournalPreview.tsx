import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MOCK_JOURNAL_ARTICLES } from '@/lib/shopify/mock-data';

export const JournalPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-[var(--sukla-ivory)]">
      <div className="editorial-container">
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:items-end md:text-left mb-10 md:mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="block text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans mb-2">
              The Sukla Journal
            </span>
            <h2 className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--sukla-charcoal)]">
              Stories on Craft & Materiality
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden md:flex text-xs font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation items-center gap-2 font-semibold"
          >
            Read All Journal Articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-8">
          {MOCK_JOURNAL_ARTICLES.slice(0, 3).map((article, idx) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className={`group flex-col overflow-hidden transition-all md:bg-[var(--sukla-cream)] md:border md:border-[var(--sukla-muted-border)] md:shadow-subtle md:hover:border-[var(--sukla-taupe)] ${idx === 2 ? 'hidden md:flex' : 'flex'}`}
            >
              <div className="relative aspect-[3/4] md:aspect-[16/10] w-full overflow-hidden bg-[var(--sukla-sand)]">
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <span className="absolute top-3 left-3 hidden md:block text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)]">
                  {article.category}
                </span>
              </div>

              <div className="pt-4 text-center md:p-6 md:text-left flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="hidden md:flex items-center gap-2 text-[10px] uppercase font-sans text-[var(--sukla-taupe)] mb-2">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="heading text-sm md:text-base text-[var(--sukla-charcoal)] group-hover:text-[var(--sukla-terracotta)] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="hidden md:block text-xs font-sans text-[var(--sukla-charcoal)]/70 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="hidden md:flex pt-3 border-t border-[var(--sukla-muted-border)] items-center justify-between text-xs font-sans font-semibold text-[var(--sukla-charcoal)]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[var(--sukla-terracotta)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/journal"
            className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation flex items-center gap-2 font-semibold"
          >
            Read All Journal Articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
