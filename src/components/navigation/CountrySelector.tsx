'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import type { LocalizedCountry } from '@/lib/localization';
import { getCurrencyForCountry } from '@/lib/currency';
import { repriceLocalCart } from '@/lib/shopify/local-cart';

interface LocalizationState {
  countries: LocalizedCountry[];
  selected: string;
}

interface CountrySelectorProps {
  /** Use the compact, full-width layout inside the mobile menu. */
  variant?: 'header' | 'menu';
}

/** Lower-case and strip accents so "turkiye" finds "Türkiye" and "cote" finds "Côte d'Ivoire". */
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/**
 * Countries listed first among equally good matches. India is the brand's home
 * market, so typing "i" shows it ahead of Ireland, Israel and Italy.
 */
const PRIORITY_COUNTRIES = ['IN'];

/**
 * Filters countries by name, ISO code or display currency and ranks the result:
 * 1. name starts with the text (or the ISO code or currency code matches exactly)
 * 2. any word in the name, or the currency code, starts with the text
 * 3. the name contains the text
 * Within a rank, priority countries come first, then alphabetical order.
 * An empty query returns the original list unchanged.
 */
function searchCountries(
  countries: LocalizedCountry[],
  query: string,
  currencyOf: (country: LocalizedCountry) => string
): LocalizedCountry[] {
  const q = normalize(query);
  if (!q) return countries;

  const matches: Array<{ country: LocalizedCountry; rank: number; priority: number }> = [];

  for (const country of countries) {
    const name = normalize(country.name);
    const iso = country.isoCode.toLowerCase();
    const currency = currencyOf(country).toLowerCase();

    let rank: number;
    if (name.startsWith(q) || iso === q || currency === q) rank = 0;
    else if (currency.startsWith(q) || name.split(/[\s\-'’]+/).some((word) => word.startsWith(q))) rank = 1;
    else if (q.length >= 2 && name.includes(q)) rank = 2; // one letter only matches word starts, to avoid noise
    else continue;

    matches.push({ country, rank, priority: PRIORITY_COUNTRIES.includes(country.isoCode) ? 0 : 1 });
  }

  return matches
    .sort((a, b) => a.rank - b.rank || a.priority - b.priority || a.country.name.localeCompare(b.country.name))
    .map((match) => match.country);
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ variant = 'header' }) => {
  const router = useRouter();
  const [state, setState] = useState<LocalizationState | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    let cancelled = false;

    fetch('/api/localization')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LocalizationState | null) => {
        if (!cancelled && data?.countries) setState(data);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  // Put the cursor in the search box on desktop. Skipped in the mobile menu so
  // the on-screen keyboard does not cover the list the moment it opens.
  useEffect(() => {
    if (open && variant === 'header') searchRef.current?.focus();
  }, [open, variant]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  const chooseCountry = useCallback(
    async (isoCode: string) => {
      if (!state || isoCode === state.selected || isSaving) {
        setOpen(false);
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        const res = await fetch('/api/localization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: isoCode })
        });
        if (!res.ok) throw new Error('save failed');

        // Reprice anything already in the cart using Shopify's prices for the
        // new country, so the cart never shows stale amounts or the wrong currency.
        try {
          const cartRaw = window.localStorage.getItem('sukla_cart_v1');
          const lines: Array<{ merchandise?: { id?: string } }> = cartRaw ? JSON.parse(cartRaw).lines ?? [] : [];
          const variantIds = lines.map((line) => line.merchandise?.id).filter((id): id is string => Boolean(id));

          if (variantIds.length > 0) {
            const priceRes = await fetch('/api/cart-prices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ variantIds })
            });
            if (priceRes.ok) {
              const { prices } = (await priceRes.json()) as {
                prices: Record<string, { amount: string; currencyCode: string }>;
              };
              repriceLocalCart(prices);
            }
          }
        } catch {
          // Cart repricing is best-effort. Checkout always uses Shopify's own prices.
        }

        setState({ ...state, selected: isoCode });
        setOpen(false);
        // Re-render server components so product prices come back in the new context.
        router.refresh();
      } catch {
        setError('Could not change country. Please try again.');
      } finally {
        setIsSaving(false);
      }
    },
    [state, isSaving, router]
  );

  if (!state || state.countries.length === 0) return null;

  const current = state.countries.find((c) => c.isoCode === state.selected) ?? state.countries[0];

  // What the shopper sees for a country vs. what Shopify actually charges there.
  // They differ until Markets is enabled for that country.
  const displayCurrencyOf = (country: LocalizedCountry) => getCurrencyForCountry(country.isoCode);
  const isEstimate = (country: LocalizedCountry) => displayCurrencyOf(country) !== country.currency.isoCode;
  const currentDisplayCurrency = displayCurrencyOf(current);
  const results = searchCountries(state.countries, query, displayCurrencyOf);

  return (
    <div ref={containerRef} className={`relative ${variant === 'menu' ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => {
          if (!open) setQuery('');
          setOpen((value) => !value);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Country and currency: ${current.name}, ${currentDisplayCurrency}. Change country`}
        className={`inline-flex items-center gap-1.5 font-sans text-xs text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] transition-colors ${
          variant === 'menu'
            ? 'w-full justify-between border border-[var(--sukla-muted-border)] px-3 py-3'
            : 'p-1.5'
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Globe className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          <span className="nums">
            {current.isoCode} · {currentDisplayCurrency}
          </span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[var(--sukla-taupe)] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] shadow-xl ${
            variant === 'menu' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="px-4 py-3 border-b border-[var(--sukla-muted-border)]">
            <span className="eyebrow text-[10px] text-[var(--sukla-taupe)] block">Shipping country</span>
            {isEstimate(current) && (
              <p className="mt-1 text-[11px] font-sans leading-relaxed text-[var(--sukla-charcoal)]/70">
                Prices in {currentDisplayCurrency} are approximate. Your order is charged in{' '}
                {current.currency.isoCode} at checkout.
              </p>
            )}
          </div>

          <div className="px-4 py-3 border-b border-[var(--sukla-muted-border)]">
            <label htmlFor={`${listId}-search`} className="sr-only">
              Search countries or currencies
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-[var(--sukla-taupe)]"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                id={`${listId}-search`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  // Enter picks the top result, so typing "i" then Enter selects India.
                  if (event.key === 'Enter' && results[0]) {
                    event.preventDefault();
                    chooseCountry(results[0].isoCode);
                  }
                }}
                placeholder="Search country or currency"
                autoComplete="off"
                spellCheck={false}
                aria-controls={listId}
                className="w-full border border-[var(--sukla-muted-border)] bg-white py-2 pl-8 pr-3 text-xs font-sans text-[var(--sukla-charcoal)] placeholder:text-[var(--sukla-taupe)] focus:border-[var(--sukla-charcoal)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sukla-charcoal)]"
              />
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {query.trim() ? `${results.length} ${results.length === 1 ? 'country' : 'countries'} found` : ''}
            </p>
          </div>

          <ul id={listId} role="listbox" aria-label="Country" className="max-h-72 overflow-y-auto py-1">
            {results.length === 0 && (
              <li role="presentation" className="px-4 py-3 text-xs font-sans text-[var(--sukla-taupe)]">
                No country or currency matches &ldquo;{query.trim()}&rdquo;.
              </li>
            )}
            {results.map((country) => {
              const isSelected = country.isoCode === state.selected;
              return (
                <li key={country.isoCode} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={isSaving}
                    onClick={() => chooseCountry(country.isoCode)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-xs font-sans transition-colors hover:bg-[var(--sukla-sand)] disabled:opacity-60 ${
                      isSelected ? 'bg-[var(--sukla-cream)] font-semibold' : ''
                    }`}
                  >
                    <span className="truncate">{country.name}</span>
                    <span className="nums inline-flex items-center gap-2 text-[var(--sukla-taupe)] shrink-0">
                      {displayCurrencyOf(country)}
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--sukla-terracotta)]" aria-hidden="true" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {error && (
            <p role="alert" className="px-4 py-2 text-[11px] font-sans text-rose-700 border-t border-[var(--sukla-muted-border)]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
