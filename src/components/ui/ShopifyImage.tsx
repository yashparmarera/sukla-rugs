'use client';

import Image, { type ImageProps } from 'next/image';
import { shopifyCdnLoader } from '@/lib/shopify-image-loader';

/**
 * next/image that resizes through Shopify's CDN. Needed in Server Components,
 * which cannot pass the loader function to next/image directly.
 */
export function ShopifyImage(props: Omit<ImageProps, 'loader'>) {
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded from props
  return <Image {...props} loader={shopifyCdnLoader} />;
}
