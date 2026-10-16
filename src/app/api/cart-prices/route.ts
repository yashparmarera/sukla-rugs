import { NextResponse } from 'next/server';
import { getVariantPrices } from '@/lib/shopify/client';
import { getSelectedCountry } from '@/lib/localization.server';

const VARIANT_ID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const MAX_VARIANTS = 50;

/**
 * Returns current prices for the given variants in the shopper's selected
 * country, so the browser cart can be repriced after a country change.
 */
export async function POST(request: Request) {
  let body: { variantIds?: unknown };
  try {
    body = (await request.json()) as { variantIds?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const variantIds = Array.isArray(body.variantIds)
    ? body.variantIds
        .filter((id): id is string => typeof id === 'string' && VARIANT_ID_PATTERN.test(id))
        .slice(0, MAX_VARIANTS)
    : [];

  if (variantIds.length === 0) {
    return NextResponse.json({ prices: {} });
  }

  const country = await getSelectedCountry();
  const prices = await getVariantPrices(variantIds, { country });
  return NextResponse.json({ prices });
}
