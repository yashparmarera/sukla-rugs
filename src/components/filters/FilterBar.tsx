'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { FilterState } from '@/types';
import { trackEvent } from '@/lib/analytics';

interface FilterBarProps {
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalCount }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse current state from URL search params
  const currentCollection = searchParams.get('collection') || 'all';
  const currentMaterial = searchParams.get('material') || 'all';
  const currentColor = searchParams.get('color') || 'all';
  const currentConstruction = searchParams.get('construction') || 'all';
  const currentSort = searchParams.get('sortBy') || 'featured';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
    trackEvent('filter', { key, value });
  };

  const clearAllFilters = () => {
    router.push('/shop', { scroll: false });
  };

  const hasActiveFilters = Boolean(
    currentCollection !== 'all' ||
    currentMaterial !== 'all' ||
    currentColor !== 'all' ||
    currentConstruction !== 'all'
  );

  return (
    <>
      {/* Desktop Sticky Filter Bar */}
      <div className="bg-[var(--shukla-cream)] border-y border-[var(--shukla-muted-border)] py-4 my-8 sticky top-[73px] z-30 shadow-subtle">
        <div className="editorial-container flex flex-wrap items-center justify-between gap-4">
          
          {/* Active Filter Selectors */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-sans">
            <span className="flex items-center gap-2 font-display uppercase tracking-widest text-[var(--shukla-charcoal)] font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--shukla-terracotta)]" /> Filter:
            </span>

            {/* Collection Filter */}
            <select
              value={currentCollection}
              onChange={(e) => updateParam('collection', e.target.value)}
              className="bg-transparent border border-[var(--shukla-muted-border)] px-3 py-1.5 text-xs text-[var(--shukla-charcoal)] focus:outline-none focus:border-[var(--shukla-charcoal)] font-sans"
            >
              <option value="all">All Collections</option>
              <option value="hand-knotted-oushak">Hand-Knotted Oushak</option>
              <option value="persian-hand-tufted">Persian Hand-Tufted</option>
              <option value="modern-hand-tufted">Modern Hand-Tufted</option>
              <option value="hand-woven-rugs">Hand-Woven Rugs</option>
              <option value="the-artisan-loop-collection">The Artisan Loop</option>
              <option value="hand-woven-jute">Hand-Woven Jute</option>
            </select>

            {/* Material Filter */}
            <select
              value={currentMaterial}
              onChange={(e) => updateParam('material', e.target.value)}
              className="bg-transparent border border-[var(--shukla-muted-border)] px-3 py-1.5 text-xs text-[var(--shukla-charcoal)] focus:outline-none focus:border-[var(--shukla-charcoal)] font-sans"
            >
              <option value="all">All Materials</option>
              <option value="wool">New Zealand Wool</option>
              <option value="silk">Bikaner Silk Accent</option>
              <option value="jute">Organic Natural Jute</option>
              <option value="cotton">Cotton Warp</option>
            </select>

            {/* Color Filter */}
            <select
              value={currentColor}
              onChange={(e) => updateParam('color', e.target.value)}
              className="bg-transparent border border-[var(--shukla-muted-border)] px-3 py-1.5 text-xs text-[var(--shukla-charcoal)] focus:outline-none focus:border-[var(--shukla-charcoal)] font-sans"
            >
              <option value="all">All Colors</option>
              <option value="terracotta">Terracotta & Rust</option>
              <option value="indigo">Indigo & Slate</option>
              <option value="olive">Olive & Moss</option>
              <option value="rose">Dusty Rose & Clay</option>
              <option value="ivory">Ivory & Cream</option>
              <option value="jute">Natural Sand & Jute</option>
            </select>

            {/* Construction Filter */}
            <select
              value={currentConstruction}
              onChange={(e) => updateParam('construction', e.target.value)}
              className="bg-transparent border border-[var(--shukla-muted-border)] px-3 py-1.5 text-xs text-[var(--shukla-charcoal)] focus:outline-none focus:border-[var(--shukla-charcoal)] font-sans"
            >
              <option value="all">All Techniques</option>
              <option value="hand-knotted">Hand-Knotted</option>
              <option value="hand-tufted">Hand-Tufted</option>
              <option value="flatweave">Flatweave</option>
              <option value="loop">Artisan Loop</option>
              <option value="braided">Hand-Braided</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-[11px] text-[var(--shukla-terracotta)] hover:underline uppercase tracking-wider font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-[var(--shukla-charcoal)] px-4 py-2 text-xs font-sans uppercase tracking-widest text-[var(--shukla-charcoal)]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--shukla-terracotta)]" /> Filter & Sort
          </button>

          {/* Total Count & Sorting */}
          <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto text-xs font-sans">
            <span className="text-[var(--shukla-taupe)] uppercase tracking-wider text-[11px]">
              Showing <strong className="text-[var(--shukla-charcoal)]">{totalCount}</strong> Rugs
            </span>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline uppercase tracking-widest text-[var(--shukla-taupe)] text-[11px]">
                Sort:
              </span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="bg-transparent border border-[var(--shukla-muted-border)] px-3 py-1.5 text-xs text-[var(--shukla-charcoal)] focus:outline-none font-sans font-medium"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Loom Releases</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--shukla-ivory)] w-full max-h-[85vh] rounded-t-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--shukla-muted-border)]">
              <h3 className="font-display text-sm uppercase tracking-wider">Refine Catalogue</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-[var(--shukla-charcoal)]" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] mb-1">
                  Collection
                </label>
                <select
                  value={currentCollection}
                  onChange={(e) => updateParam('collection', e.target.value)}
                  className="w-full bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-3 text-xs"
                >
                  <option value="all">All Collections</option>
                  <option value="hand-knotted-oushak">Hand-Knotted Oushak</option>
                  <option value="persian-hand-tufted">Persian Hand-Tufted</option>
                  <option value="modern-hand-tufted">Modern Hand-Tufted</option>
                  <option value="hand-woven-rugs">Hand-Woven Rugs</option>
                  <option value="the-artisan-loop-collection">The Artisan Loop</option>
                  <option value="hand-woven-jute">Hand-Woven Jute</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] mb-1">
                  Material
                </label>
                <select
                  value={currentMaterial}
                  onChange={(e) => updateParam('material', e.target.value)}
                  className="w-full bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-3 text-xs"
                >
                  <option value="all">All Materials</option>
                  <option value="wool">New Zealand Wool</option>
                  <option value="silk">Bikaner Silk Accent</option>
                  <option value="jute">Organic Natural Jute</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)] mb-1">
                  Color Family
                </label>
                <select
                  value={currentColor}
                  onChange={(e) => updateParam('color', e.target.value)}
                  className="w-full bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-3 text-xs"
                >
                  <option value="all">All Colors</option>
                  <option value="terracotta">Terracotta & Rust</option>
                  <option value="indigo">Indigo & Slate</option>
                  <option value="olive">Olive & Moss</option>
                  <option value="rose">Dusty Rose & Clay</option>
                  <option value="ivory">Ivory & Cream</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--shukla-muted-border)] flex gap-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-[var(--shukla-charcoal)] text-white text-xs uppercase tracking-widest font-semibold"
              >
                Apply Filters ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
