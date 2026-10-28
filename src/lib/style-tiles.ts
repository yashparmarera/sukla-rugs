/**
 * Home page "shop by style" tiles.
 *
 * Labels and hrefs come from the Style column of SHOP_MENU, so a tile links to
 * exactly the URL a visitor gets by picking that style in the Shop menu or the
 * /shop filter bar (for example /shop?style=traditional).
 *
 * Tile images are the featured image of the first real Shopify product that
 * /shop would list for that style (same getProducts query, same
 * applyShopFilters matching). Nothing is invented: when no product matches, or
 * the fetch fails, the tile has no image and the page renders a neutral
 * placeholder.
 */

import { getProducts } from '@/lib/shopify/client';
import { applyShopFilters } from '@/lib/shop-filters';
import { SHOP_MENU } from '@/lib/shop-menu';
import type { Product } from '@/types';

export interface StyleTile {
  label: string;
  href: string;
  image?: { url: string; width?: number; height?: number };
}

const SHOPIFY_CDN_HOST = 'cdn.shopify.com';

/** Only Shopify-hosted images count; the mock catalog and placeholder use other hosts. */
function isShopifyImage(url: string | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).hostname === SHOPIFY_CDN_HOST;
  } catch {
    return false;
  }
}

/**
 * Styles left off the home page tiles (owner request). They stay in the Shop
 * menu and the /shop filter bar; only this home section skips them.
 */
const HOME_TILE_EXCLUDED_STYLES = new Set(['minimalist', 'neutral']);

export function getStyleMenuItems() {
  const column = SHOP_MENU.find((entry) => entry.id === 'style');
  return (column?.items ?? []).flatMap((entry) =>
    entry.param === 'style' && entry.value && !HOME_TILE_EXCLUDED_STYLES.has(entry.value)
      ? [{ label: entry.label, href: entry.href, value: entry.value }]
      : []
  );
}

/** Pure helper: pick each style's tile image from an already loaded product list. */
export function buildStyleTiles(products: Product[]): StyleTile[] {
  return getStyleMenuItems().map(({ label, href, value }) => {
    const match = applyShopFilters(products, { style: value }).find((product) =>
      isShopifyImage(product.featuredImage?.url)
    );
    const featured = match?.featuredImage;
    return {
      label,
      href,
      image: featured && isShopifyImage(featured.url) ? { url: featured.url, width: featured.width, height: featured.height } : undefined
    };
  });
}

/**
 * Load the catalogue once with the same query /shop uses (default 25 products,
 * style matching runs on that loaded set exactly as on /shop) and build the
 * tiles. Never throws.
 */
export async function getStyleTiles(country?: string): Promise<StyleTile[]> {
  try {
    const products = await getProducts({ country });
    return buildStyleTiles(products);
  } catch (error) {
    console.error('[Style tiles] Could not load products', error);
    return getStyleMenuItems().map(({ label, href }) => ({ label, href }));
  }
}
