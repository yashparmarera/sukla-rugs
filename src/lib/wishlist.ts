/**
 * Wishlist storage contract (shared by the browser store and the API route).
 *
 * Only Shopify product GIDs are stored, never prices or copies of product
 * data, so the wishlist page always shows current Shopify data.
 */

/** localStorage key. Versioned so the shape can change later. */
export const WISHLIST_STORAGE_KEY = 'sukla.wishlist.v1';

/** Upper bound for saved products, in storage and per API request. */
export const MAX_WISHLIST_ITEMS = 50;

/** Shopify product GID, for example gid://shopify/Product/1234567890. */
export const PRODUCT_ID_PATTERN = /^gid:\/\/shopify\/Product\/\d+$/;

/** Returns valid, de-duplicated product ids (max MAX_WISHLIST_ITEMS), preserving order. */
export function sanitizeProductIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const value of input) {
    if (typeof value === 'string' && PRODUCT_ID_PATTERN.test(value)) seen.add(value);
    if (seen.size >= MAX_WISHLIST_ITEMS) break;
  }
  return [...seen];
}

/** Parses the raw localStorage string. Anything unexpected yields an empty list. */
export function parseStoredWishlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return sanitizeProductIds(JSON.parse(raw));
  } catch {
    return [];
  }
}
