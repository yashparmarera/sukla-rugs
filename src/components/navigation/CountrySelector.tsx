'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Globe } from 'lucide-react';
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

export const CountrySelector: React.FC<CountrySelectorProps> = ({ variant = 'header' }) => {
  const router = useRouter();
  const [state, setState] = useState<LocalizationState | null>(null);
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={containerRef} className={`relative ${variant === 'menu' ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
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

          <ul id={listId} role="listbox" aria-label="Country" className="max-h-72 overflow-y-auto py-1">
            {state.countries.map((country) => {
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
