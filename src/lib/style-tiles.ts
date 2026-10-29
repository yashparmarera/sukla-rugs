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
import { applyShopFilters, productMatchesFilter } from '@/lib/shop-filters';
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
 * `contemporary` is excluded here because the home section shows the Runners
 * collection tile in its place (owner request) — see HOME_TILE_EXTRA_ITEMS.
 */
const HOME_TILE_EXCLUDED_STYLES = new Set(['minimalist', 'neutral', 'contemporary']);

/**
 * Non-style tiles added to the home section. Each names a menu column id and the
 * value of the item within it, so the label/href come straight from SHOP_MENU
 * (no duplicated strings) and the tile image is matched by that facet.
 */
const HOME_TILE_EXTRA_ITEMS: ReadonlyArray<{ columnId: string; value: string }> = [
  { columnId: 'area-rugs', value: 'runners' }
];

interface TileMenuItem {
  label: string;
  href: string;
  param: string;
  value: string;
}

export function getStyleMenuItems(): TileMenuItem[] {
  const styleColumn = SHOP_MENU.find((entry) => entry.id === 'style');
  const styleTiles = (styleColumn?.items ?? []).flatMap((entry) =>
    entry.param === 'style' && entry.value && !HOME_TILE_EXCLUDED_STYLES.has(entry.value)
      ? [{ label: entry.label, href: entry.href, param: entry.param, value: entry.value }]
      : []
  );

  const extraTiles = HOME_TILE_EXTRA_ITEMS.flatMap(({ columnId, value }) => {
    const column = SHOP_MENU.find((entry) => entry.id === columnId);
    const entry = column?.items.find((it) => it.value === value && it.param);
    return entry && entry.param && entry.value
      ? [{ label: entry.label, href: entry.href, param: entry.param, value: entry.value }]
      : [];
  });

  return [...styleTiles, ...extraTiles];
}

/** Pure helper: pick each tile's image from an already loaded product list. */
export function buildStyleTiles(products: Product[]): StyleTile[] {
  return getStyleMenuItems().map(({ label, href, param, value }) => {
    // Style facets run through applyShopFilters; collection facets (e.g. Runners)
    // match by the documented collection-keyword helper, since applyShopFilters
    // intentionally ignores the collection key.
    const matches =
      param === 'collection'
        ? products.filter((product) => productMatchesFilter(product, 'collection', value))
        : applyShopFilters(products, { [param]: value });
    const match = matches.find((product) => isShopifyImage(product.featuredImage?.url));
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
