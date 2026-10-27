'use client';

import React from 'react';
import { useShopFilterState } from './FilterBar';

interface SortControlProps {
  totalCount: number;
}

/**
 * Right-column slim row: the "Showing N Rugs" count (with the sr-only aria-live
 * status) and the Sort <select>. Shares URL/optimistic logic with FilterBar via
 * useShopFilterState so sort behavior is identical to the old combined bar.
 */
export const SortControl: React.FC<SortControlProps> = ({ totalCount }) => {
  const { currentSort, updateParam } = useShopFilterState();

  return (
    <div className="flex items-center justify-between gap-6 text-xs font-sans mb-6">
      <span className="text-[var(--sukla-taupe)] uppercase tracking-[0.1em] text-[11px]">
        Showing <strong className="nums text-[var(--sukla-charcoal)]">{totalCount}</strong> Rugs
      </span>
      <p className="sr-only" role="status" aria-live="polite">
        {totalCount} {totalCount === 1 ? 'rug' : 'rugs'} shown
      </p>

      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="hidden sm:inline uppercase tracking-widest text-[var(--sukla-taupe)] text-[11px]"
        >
          Sort:
        </span>
        <select
          aria-label="Sort rugs"
          value={currentSort}
          onChange={(e) => updateParam('sortBy', e.target.value)}
          className="bg-transparent border border-[var(--sukla-muted-border)] px-3 py-1.5 text-xs text-[var(--sukla-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)] font-sans font-medium"
        >
          <option value="featured">Featured Curations</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Loom Releases</option>
        </select>
      </div>
    </div>
  );
};
