import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { MOCK_JOURNAL_ARTICLES } from '@/lib/shopify/mock-data';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = MOCK_JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) return { title: 'Article Not Found | SHUKLA RUGS' };

  return {
    title: `${article.title} | SHUKLA RUGS Journal`,
    description: article.excerpt
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = MOCK_JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <article className="editorial-container max-w-3xl mx-auto space-y-8">
          
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)] font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans block font-semibold">
              {article.category} • {article.readTime}
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)] leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-sans text-[var(--shukla-taupe)] pt-2 border-t border-[var(--shukla-muted-border)]">
              <span>By {article.author}</span>
              <span>•</span>
              <span>Published {article.publishedAt}</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full bg-[var(--shukla-sand)] border border-[var(--shukla-muted-border)] overflow-hidden">
            <Image
              src={article.image.url}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="prose prose-stone max-w-none text-sm font-serif italic leading-relaxed text-[var(--shukla-charcoal)]/90 space-y-6 pt-4">
            <p className="text-base font-normal">{article.excerpt}</p>
            <p className="font-sans text-xs not-italic leading-relaxed">{article.content}</p>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
