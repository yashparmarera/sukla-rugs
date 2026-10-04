import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { MOCK_JOURNAL_ARTICLES } from '@/lib/shopify/mock-data';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'The Journal | Craft, Materiality & Interiors | SHUKLA RUGS',
  description: 'Editorial perspectives on Indian rug weaving heritage, material science, and interior architecture.'
};

export default function JournalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Editorial Publications
            </span>
            <h1 className="display-xl text-4xl sm:text-5xl md:text-6xl text-[var(--shukla-charcoal)]">
              The Shukla Journal
            </h1>
            <p className="font-serif italic text-base md:text-lg text-[var(--shukla-charcoal)]/80">
              In-depth essays on Bhadohi craft heritage, material analysis, and luxury interior curation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_JOURNAL_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={`/journal/${article.slug}`}
                className="group flex flex-col bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] overflow-hidden shadow-subtle hover:border-[var(--shukla-taupe)] transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--shukla-sand)]">
                  <Image
                    src={article.image.url}
                    alt={article.title}
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
                    <h2 className="heading text-lg text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs font-serif italic text-[var(--shukla-charcoal)]/75 mt-2 line-clamp-3">
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
      </main>

      <Footer />
    </div>
  );
}
