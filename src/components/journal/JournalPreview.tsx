import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MOCK_JOURNAL_ARTICLES } from '@/lib/shopify/mock-data';

export const JournalPreview: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--shukla-ivory)]">
      <div className="editorial-container">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="block text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans mb-2">
              The Shukla Journal
            </span>
            <h2 className="display-lg text-2xl md:text-3xl lg:text-4xl text-[var(--shukla-charcoal)]">
              Stories on Craft & Materiality
            </h2>
          </div>
          <Link
            href="/journal"
            className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover-underline-animation flex items-center gap-2 font-semibold"
          >
            Read All Journal Articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_JOURNAL_ARTICLES.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="group flex flex-col bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] overflow-hidden shadow-subtle hover:border-[var(--shukla-taupe)] transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--shukla-sand)]">
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)]">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-sans text-[var(--shukla-taupe)] mb-2">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="heading text-base text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs font-sans text-[var(--shukla-charcoal)]/70 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--shukla-muted-border)] flex items-center justify-between text-xs font-sans font-semibold text-[var(--shukla-charcoal)]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[var(--shukla-terracotta)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
