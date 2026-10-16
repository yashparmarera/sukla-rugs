import { cookies } from 'next/headers';
import { COUNTRY_COOKIE, normalizeCountryCode } from '@/lib/localization';

/**
 * Reads the shopper's selected country from the request cookie.
 * Server-only: do not import this from a client component.
 */
export async function getSelectedCountry(): Promise<string> {
  const store = await cookies();
  return normalizeCountryCode(store.get(COUNTRY_COOKIE)?.value);
}
