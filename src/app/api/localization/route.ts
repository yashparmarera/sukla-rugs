import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAvailableCountries } from '@/lib/shopify/client';
import {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  normalizeCountryCode,
  type LocalizedCountry
} from '@/lib/localization';

const CACHE_TTL_MS = 10 * 60 * 1000;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

let cache: { countries: LocalizedCountry[]; expiresAt: number } | null = null;

/** Countries come from Shopify Markets; cached briefly to avoid a request per page view. */
async function loadCountries(): Promise<LocalizedCountry[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.countries;

  const countries = await getAvailableCountries();
  // Do not cache an empty result, so a temporary API failure recovers quickly.
  if (countries.length > 0) cache = { countries, expiresAt: Date.now() + CACHE_TTL_MS };
  return countries;
}

export async function GET() {
  const [countries, store] = await Promise.all([loadCountries(), cookies()]);

  const requested = normalizeCountryCode(store.get(COUNTRY_COOKIE)?.value);
  // Fall back to the default if the saved country is no longer offered.
  const selected = countries.some((c) => c.isoCode === requested)
    ? requested
    : countries.some((c) => c.isoCode === DEFAULT_COUNTRY)
      ? DEFAULT_COUNTRY
      : countries[0]?.isoCode ?? DEFAULT_COUNTRY;

  return NextResponse.json({ countries, selected });
}

export async function POST(request: Request) {
  let body: { country?: unknown };
  try {
    body = (await request.json()) as { country?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Reject malformed input outright. Normalising first would silently turn
  // garbage into the default country and save it.
  if (typeof body.country !== 'string' || !/^[A-Za-z]{2}$/.test(body.country.trim())) {
    return NextResponse.json({ error: 'Invalid country.' }, { status: 400 });
  }

  const requested = normalizeCountryCode(body.country);
  const countries = await loadCountries();

  // Only accept countries Shopify actually offers.
  if (!countries.some((c) => c.isoCode === requested)) {
    return NextResponse.json({ error: 'That country is not available.' }, { status: 400 });
  }

  const response = NextResponse.json({ selected: requested });
  response.cookies.set(COUNTRY_COOKIE, requested, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  return response;
}
