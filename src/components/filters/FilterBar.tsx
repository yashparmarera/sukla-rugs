'use client';

import React, { useEffect, useId, useOptimistic, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { SHOP_FILTER_GROUPS, SHOP_ROOT_HREF, type ShopFilterGroup } from '@/lib/shop-menu';

interface FilterBarProps {
  totalCount: number;
}

export const MOBILE_SELECT_CLASS =
  'w-full bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] p-3 text-xs text-[var(--sukla-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]';

/**
 * Shared filter state for the /shop controls. The desktop rail (FilterBar) and
 * the right-column sort row (SortControl) both read from the URL, so they share
 * this one hook to keep the routing/optimistic logic identical and drift-free.
 */
export function useShopFilterState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // The selects follow the URL. While the server re-renders after a change, the
  // optimistic query keeps the chosen option on screen instead of snapping back.
  const [query, setOptimisticQuery] = useOptimistic(searchParams.toString());
  const currentParams = new URLSearchParams(query);

  const currentSort = currentParams.get('sortBy') || 'featured';

  /**
   * Current option for a group. Values come from the URL, so anything that is not
   * one of the menu options (for example an old collection handle) shows "All".
   */
  const selectedValue = (group: ShopFilterGroup): string => {
    const raw = currentParams.get(group.param)?.trim().toLowerCase();
    return raw && group.options.some((option) => option.value === raw) ? raw : 'all';
  };

  const navigate = (nextQuery: string) => {
    startTransition(() => {
      setOptimisticQuery(nextQuery);
      router.push(nextQuery ? `${SHOP_ROOT_HREF}?${nextQuery}` : SHOP_ROOT_HREF, { scroll: false });
    });
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(query);
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate(params.toString());
    trackEvent('filter', { key, value });
  };

  const clearAllFilters = () => {
    navigate('');
  };

  // Any filter param in the URL counts, including `color` (no dropdown, but old
  // links still filter) and values the selects cannot display.
  const hasActiveFilters = [...SHOP_FILTER_GROUPS.map((group) => group.param), 'color'].some((key) => {
    const value = currentParams.get(key)?.trim().toLowerCase();
    return Boolean(value) && value !== 'all';
  });

  return { currentParams, currentSort, selectedValue, updateParam, clearAllFilters, hasActiveFilters };
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalCount }) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const idPrefix = useId();
  const panelId = `${idPrefix}-mobile-filters`;
  const panelTitleId = `${idPrefix}-mobile-filters-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const { selectedValue, updateParam, clearAllFilters, hasActiveFilters } = useShopFilterState();

  const closeMobileFilters = () => {
    setMobileFilterOpen(false);
    triggerRef.current?.focus();
  };

  // Mobile panel: move focus in when it opens, close on Escape.
  useEffect(() => {
    if (!mobileFilterOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileFilterOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileFilterOpen]);

  return (
    <>
      {/* Desktop Left Filter Rail — sized to its own content (no forced viewport
          height) so it ends right after the last filter instead of leaving empty
          space below. Sticky so it follows the scroll beside the grid. */}
      <div className="hidden lg:block lg:sticky lg:top-[89px] lg:self-start">
        <p className="eyebrow flex items-center gap-2 text-[var(--sukla-charcoal)] mb-3">
          <SlidersHorizontal aria-hidden="true" className="w-3.5 h-3.5 text-[var(--sukla-terracotta)]" /> Filter By
        </p>

        <div className="text-xs font-sans">
          {SHOP_FILTER_GROUPS.map((group) => {
            const selectId = `${idPrefix}-rail-${group.id}`;
            return (
              <div key={group.id} className="mb-3">
                <label
                  htmlFor={selectId}
                  className="block text-[10px] uppercase tracking-widest text-[var(--sukla-taupe)] mb-1"
                >
                  {group.heading}
                </label>
                <select
                  id={selectId}
                  value={selectedValue(group)}
                  onChange={(e) => updateParam(group.param, e.target.value)}
                  className={MOBILE_SELECT_CLASS}
                >
                  <option value="all">{group.allLabel}</option>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {hasActiveFilters && (
            <div className="pt-3 mt-1 border-t border-[var(--sukla-muted-border)]">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-[11px] text-[var(--sukla-terracotta)] hover:underline uppercase tracking-wider font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
              >
                <RotateCcw aria-hidden="true" className="w-3 h-3" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setMobileFilterOpen(true)}
        aria-expanded={mobileFilterOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
        className="lg:hidden flex items-center gap-2 border border-[var(--sukla-charcoal)] px-4 py-2 text-xs font-sans uppercase tracking-widest text-[var(--sukla-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
      >
        <SlidersHorizontal aria-hidden="true" className="w-4 h-4 text-[var(--sukla-terracotta)]" /> Filter & Sort
      </button>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={panelTitleId}
            className="bg-[var(--sukla-ivory)] w-full max-h-[85vh] rounded-t-2xl p-6 overflow-y-auto space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-[var(--sukla-muted-border)]">
              <h3 id={panelTitleId} className="heading text-base">Refine Catalogue</h3>
              <button
                ref={closeRef}
                type="button"
                onClick={closeMobileFilters}
                aria-label="Close filters"
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
              >
                <X aria-hidden="true" className="w-5 h-5 text-[var(--sukla-charcoal)]" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {SHOP_FILTER_GROUPS.map((group) => {
                const selectId = `${idPrefix}-mobile-${group.id}`;
                return (
                  <div key={group.id}>
                    <label
                      htmlFor={selectId}
                      className="block text-[10px] uppercase tracking-widest text-[var(--sukla-taupe)] mb-1"
                    >
                      {group.heading}
                    </label>
                    <select
                      id={selectId}
                      value={selectedValue(group)}
                      onChange={(e) => updateParam(group.param, e.target.value)}
                      className={MOBILE_SELECT_CLASS}
                    >
                      <option value="all">{group.allLabel}</option>
                      {group.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--sukla-muted-border)] flex flex-col gap-3">
              <button
                type="button"
                onClick={closeMobileFilters}
                className="w-full py-3.5 bg-[var(--sukla-charcoal)] text-white text-xs uppercase tracking-[0.1em] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
              >
                Apply Filters (<span className="nums">{totalCount}</span>)
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    closeMobileFilters();
                  }}
                  className="flex items-center justify-center gap-1 text-[11px] text-[var(--sukla-terracotta)] hover:underline uppercase tracking-wider font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
                >
                  <RotateCcw aria-hidden="true" className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
