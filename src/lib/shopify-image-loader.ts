import type { ImageLoaderProps } from 'next/image';
/**
 * Loader for every Shopify-hosted image (cards, gallery, thumbnails, cart,
 * collections). Resizes through Shopify's own CDN (`?width=`), so these requests
 * never consume Vercel image transformations. Shopify does not upscale beyond
 * the source. Any `height`, `crop`, `w` or `h` already on the URL is dropped so
 * the aspect ratio stays intact; `v` (cache version) is kept.
 * Non-Shopify URLs are returned unchanged, so only attach this loader to images
 * that can be Shopify-hosted (a local path would skip /_next/image entirely).
 */
export function shopifyCdnLoader({ src, width }: ImageLoaderProps): string {
  try {
    const url = new URL(src);
    if (url.hostname !== 'cdn.shopify.com') return src;
    for (const key of ['height', 'crop', 'w', 'h']) url.searchParams.delete(key);
    url.searchParams.set('width', String(Math.round(width)));
    return url.toString();
  } catch {
    return src;
  }
}
