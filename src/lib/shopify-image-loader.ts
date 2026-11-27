import type { ImageLoaderProps } from 'next/image';

/**
 * Loader for the product gallery's large images. Resizes through Shopify's own
 * CDN (`?width=`) so these requests do not consume Vercel image transformations.
 * Non-Shopify URLs are returned unchanged.
 */
export function shopifyCdnLoader({ src, width }: ImageLoaderProps): string {
  try {
    const url = new URL(src);
    if (url.hostname !== 'cdn.shopify.com') return src;
    url.searchParams.set('width', String(width));
    return url.toString();
  } catch {
    return src;
  }
}
