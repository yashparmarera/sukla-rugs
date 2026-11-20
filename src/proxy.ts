import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COUNTRY_COOKIE, DEFAULT_COUNTRY } from '@/lib/localization';
import { isSupportedCountry } from '@/lib/currency';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Country from the hosting platform's geo header, else the Accept-Language region. */
function detectCountry(request: NextRequest): string {
  const geo = request.headers.get('x-vercel-ip-country')?.trim().toUpperCase();
  if (geo && /^[A-Z]{2}$/.test(geo) && isSupportedCountry(geo)) return geo;

  // Only used when the geo header is absent (local dev, other hosts).
  if (!geo) {
    const languages = request.headers.get('accept-language') ?? '';
    for (const part of languages.split(',')) {
      const tag = part.split(';')[0].trim();
      const region = /^[A-Za-z]{2,3}-([A-Za-z]{2})$/.exec(tag)?.[1]?.toUpperCase();
      if (region && isSupportedCountry(region)) return region;
    }
  }
  return DEFAULT_COUNTRY;
}

/**
 * First visit only: when there is no country cookie, pick one and save it in the
 * same cookie the country selector uses. A saved cookie (auto or manual) is never changed.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(COUNTRY_COOKIE)) return NextResponse.next();

  const country = detectCountry(request);

  // Make the cookie visible to this request's server render.
  request.cookies.set(COUNTRY_COOKIE, country);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(COUNTRY_COOKIE, country, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
