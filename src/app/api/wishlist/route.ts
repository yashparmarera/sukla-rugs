import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/shopify/client';
import { getSelectedCountry } from '@/lib/localization.server';
import { sanitizeProductIds } from '@/lib/wishlist';

const NO_STORE = { 'Cache-Control': 'no-store' };

/**
 * Returns the current Shopify data for the product GIDs saved in the
 * shopper's browser, priced for their selected country. Ids that are not
 * valid GIDs are ignored, at most 50 are read, and products that no longer
 * exist are simply absent from the result (the client prunes them).
 */
export async function POST(request: Request) {
  let body: { ids?: unknown };
  try {
    body = (await request.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  const ids = sanitizeProductIds(body.ids);
  if (ids.length === 0) {
    return NextResponse.json({ products: [] }, { headers: NO_STORE });
  }

  const country = await getSelectedCountry();
  const products = await getProductsByIds(ids, { country });
  if (!products) {
    return NextResponse.json({ error: 'Products are temporarily unavailable.' }, { status: 502, headers: NO_STORE });
  }

  // The cards never render the long HTML description, so it is not sent.
  return NextResponse.json(
    { products: products.map((product) => ({ ...product, descriptionHtml: undefined })) },
    { headers: NO_STORE }
  );
}
