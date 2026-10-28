/**
 * Display-currency helpers (safe for client and server code).
 *
 * IMPORTANT: Shopify is the source of truth for what a customer is charged.
 * When Shopify already prices a country in its own currency (Markets), that
 * exact price is shown. Until then, the local amount shown here is a clearly
 * labelled APPROXIMATION of the store-currency price, and is never used for
 * checkout.
 */
import { formatMoney } from '@/lib/format-money';

/** ISO 4217 currency for each country the store currently offers. */
const COUNTRY_CURRENCY: Record<string, string> = {
  AE: 'AED',
  AT: 'EUR',
  BE: 'EUR',
  BG: 'EUR', // Bulgaria adopted the euro on 1 January 2026
  BH: 'BHD',
  CA: 'CAD',
  CY: 'EUR',
  CZ: 'CZK',
  DE: 'EUR',
  DK: 'DKK',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  GB: 'GBP',
  GR: 'EUR',
  HR: 'EUR',
  HU: 'HUF',
  IE: 'EUR',
  IN: 'INR',
  IT: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MT: 'EUR',
  MY: 'MYR',
  NL: 'EUR',
  PL: 'PLN',
  PT: 'EUR',
  RO: 'RON',
  SA: 'SAR',
  SE: 'SEK',
  SG: 'SGD',
  SI: 'EUR',
  SK: 'EUR',
  US: 'USD'
};

export const STORE_CURRENCY = 'USD';

/** Currency a shopper in this country expects to see. Unknown countries fall back to the store currency. */
export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? STORE_CURRENCY;
}

/** Narrow currency symbol, for example "₹" for INR. Falls back to the code. */
export function getCurrencySymbol(currencyCode: string): string {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).formatToParts(0);
    return parts.find((part) => part.type === 'currency')?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
}

export interface DisplayMoney {
  /** Text to show. Converted values are flagged by `approximate`, not by a symbol. */
  text: string;
  approximate: boolean;
}

/**
 * Formats a price for display in the shopper's currency.
 *
 * - Same currency, or no usable rate, or a non-store source currency: the exact
 *   amount is shown unchanged.
 * - Store currency to a different display currency: a rounded estimate using
 *   `rate` (units of display currency per 1 store-currency unit), with
 *   `approximate: true` and no prefix symbol.
 */
export function formatDisplayMoney(
  amount: string | number,
  sourceCurrency: string,
  displayCurrency: string,
  rate: number | null
): DisplayMoney {
  const value = typeof amount === 'number' ? amount : parseFloat(amount);
  if (Number.isNaN(value)) return { text: '', approximate: false };

  const canConvert =
    sourceCurrency === STORE_CURRENCY &&
    displayCurrency !== sourceCurrency &&
    typeof rate === 'number' &&
    Number.isFinite(rate) &&
    rate > 0;

  if (!canConvert) {
    return { text: formatMoney(value, sourceCurrency), approximate: false };
  }

  const converted = value * (rate as number);
  // Indian digit grouping (lakh/crore) for INR, standard grouping otherwise.
  const locale = displayCurrency === 'INR' ? 'en-IN' : 'en-US';

  try {
    const text = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: displayCurrency,
      // Whole units read as an estimate; very small amounts keep decimals.
      maximumFractionDigits: converted >= 100 ? 0 : 2,
      minimumFractionDigits: 0
    }).format(converted);
    // No "≈" prefix (owner request). `approximate` still drives the
    // "charged in the store currency at checkout" notes on the PDP and cart.
    return { text, approximate: true };
  } catch {
    return { text: formatMoney(value, sourceCurrency), approximate: false };
  }
}
