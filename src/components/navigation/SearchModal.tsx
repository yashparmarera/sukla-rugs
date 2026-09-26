'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { getProducts } from '@/lib/shopify/client';
import { trackEvent } from '@/lib/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Hand-Knotted Oushak', 'Jute Runner', 'Living Room 8x10', 'Bhadohi', 'Silk Highlight', 'Terracotta'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await getProducts({ query });
      setResults(res);
      setLoading(false);
      trackEvent('search', { query, resultCount: res.length });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center pt-16 md:pt-24 px-4 pb-12">
        <div className="relative w-full max-w-3xl bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] shadow-2xl p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--shukla-muted-border)]">
            <h2 className="font-display text-lg uppercase tracking-wider text-[var(--shukla-charcoal)]">Search Catalogue</h2>
            <button
              onClick={onClose}
              className="p-2 text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative my-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--shukla-taupe)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by collection, technique, material, or color (e.g. Oushak, Wool, Terracotta)..."
              autoFocus
              className="w-full bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] pl-12 pr-10 py-4 text-sm font-sans focus:outline-none focus:border-[var(--shukla-charcoal)] placeholder:text-[var(--shukla-taupe)]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)] text-xs uppercase"
              >
                Clear
              </button>
            )}
          </div>

          {/* Popular Search Suggestions */}
          {!query && (
            <div className="py-4 border-t border-[var(--shukla-muted-border)]/60">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-3">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] text-xs text-[var(--shukla-charcoal)] hover:border-[var(--shukla-charcoal)] transition-colors font-sans"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {loading && (
            <div className="text-center py-12 text-xs font-sans text-[var(--shukla-taupe)] uppercase tracking-widest">
              Searching catalogue...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-serif italic text-lg text-[var(--shukla-charcoal)]">
                No rugs found matching &quot;{query}&quot;
              </p>
              <p className="text-xs font-sans text-[var(--shukla-taupe)]">
                Try searching for materials like &quot;Wool&quot; or collections like &quot;Oushak&quot;.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] font-sans">
                {results.length} Result{results.length > 1 ? 's' : ''} Found
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 bg-[var(--shukla-cream)]/70 border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] transition-all group"
                  >
                    <div className="relative w-16 h-20 shrink-0 bg-[var(--shukla-sand)] overflow-hidden">
                      {product.featuredImage && (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] truncate">
                        {product.collection.title}
                      </span>
                      <h4 className="font-display text-sm tracking-wide text-[var(--shukla-charcoal)] group-hover:text-[var(--shukla-terracotta)] transition-colors truncate">
                        {product.title}
                      </h4>
                      <span className="block font-sans text-xs text-[var(--shukla-charcoal)]/80 mt-1 font-medium">
                        From ${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-US')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--shukla-taupe)] group-hover:translate-x-1 group-hover:text-[var(--shukla-charcoal)] transition-all shrink-0 mr-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
