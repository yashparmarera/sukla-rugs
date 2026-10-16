/**
 * Shared localization primitives (safe to import from client and server code).
 *
 * The shopper's country is stored in a cookie. Every Shopify request then asks
 * for prices "in context" of that country, so the currency, price and symbol
 * always come from Shopify Markets. Nothing here converts currencies.
 */
export const COUNTRY_COOKIE = 'sukla_country';
export const DEFAULT_COUNTRY = 'US';

export interface LocalizedCountry {
  isoCode: string;
  name: string;
  currency: {
    isoCode: string;
    symbol: string;
  };
}

/** Returns a valid upper-case ISO country code, or the default for anything else. */
export function normalizeCountryCode(value: string | null | undefined): string {
  const code = (value ?? '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : DEFAULT_COUNTRY;
}

/** Distinct currencies offered across the available countries, in first-seen order. */
export function getDistinctCurrencies(countries: LocalizedCountry[]): Array<{ isoCode: string; symbol: string }> {
  const seen = new Map<string, { isoCode: string; symbol: string }>();
  for (const country of countries) {
    if (!seen.has(country.currency.isoCode)) seen.set(country.currency.isoCode, country.currency);
  }
  return [...seen.values()];
}
