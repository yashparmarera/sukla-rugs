import { STORE_CURRENCY } from '@/lib/currency';

/**
 * Daily exchange rates by ExchangeRate-API (https://www.exchangerate-api.com).
 * Used ONLY to show approximate local prices. Checkout always uses Shopify.
 */
const RATES_URL = `https://open.er-api.com/v6/latest/${STORE_CURRENCY}`;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4000;

let cache: { rates: Record<string, number>; expiresAt: number } | null = null;

async function loadRates(): Promise<Record<string, number> | null> {
  if (cache && cache.expiresAt > Date.now()) return cache.rates;

  try {
    const response = await fetch(RATES_URL, {
      // A slow rates provider must never hold up a page render.
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: CACHE_TTL_MS / 1000 }
    });
    if (!response.ok) return cache?.rates ?? null;

    const data = (await response.json()) as { result?: string; rates?: Record<string, number> };
    if (data.result !== 'success' || !data.rates) return cache?.rates ?? null;

    cache = { rates: data.rates, expiresAt: Date.now() + CACHE_TTL_MS };
    return cache.rates;
  } catch {
    // Keep serving the last good rates if the provider is briefly unavailable.
    return cache?.rates ?? null;
  }
}

/**
 * Units of `currency` per 1 unit of the store currency, or null when no rate is
 * available (callers then show the exact store-currency price).
 */
export async function getStoreCurrencyRate(currency: string): Promise<number | null> {
  if (!/^[A-Z]{3}$/.test(currency)) return null;
  if (currency === STORE_CURRENCY) return 1;

  const rates = await loadRates();
  const rate = rates?.[currency];
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0 ? rate : null;
}
