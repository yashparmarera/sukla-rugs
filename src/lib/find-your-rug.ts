/**
 * Home page "Find Your Rug" tabs (Style / Construction).
 *
 * Labels and hrefs come from the Style and Construction columns of SHOP_MENU,
 * so every tile links to exactly the /shop filter URL the Shop menu and filter
 * bar use (for example /shop?construction=hand-knotted).
 *
 * Tile images are the featured image of the first real Shopify product that
 * /shop would list for that value (same getProducts query, same
 * applyShopFilters matching). Nothing is invented: when no product matches, or
 * the fetch fails, the tile has no image and renders a neutral placeholder.
 */

import { getProducts } from '@/lib/shopify/client';
import { applyShopFilters } from '@/lib/shop-filters';
import { SHOP_MENU, type ShopFilterKey } from '@/lib/shop-menu';
import { isShopifyImage } from '@/lib/style-tiles';
import type { Product } from '@/types';

export interface FindYourRugTile {
  label: string;
  href: string;
  image?: { url: string; width?: number; height?: number };
}

export interface FindYourRugGroup {
  id: 'style' | 'construction';
  heading: string;
  tiles: FindYourRugTile[];
}

const GROUPS: ReadonlyArray<{ id: FindYourRugGroup['id']; heading: string }> = [
  { id: 'style', heading: 'Style' },
  { id: 'construction', heading: 'Construction' }
];

/**
 * Values left off this home section (owner request). They stay in the Shop
 * menu and the /shop filter bar; only "Find Your Rug" skips them.
 */
const EXCLUDED_VALUES: Readonly<Record<string, ReadonlySet<string>>> = {
  style: new Set(['contemporary', 'neutral']),
  construction: new Set(['handloom'])
};

function menuItems(columnId: string) {
  const column = SHOP_MENU.find((entry) => entry.id === columnId);
  return (column?.items ?? []).flatMap((entry) =>
    entry.param && entry.value && !EXCLUDED_VALUES[entry.param]?.has(entry.value)
      ? [{ label: entry.label, href: entry.href, param: entry.param as ShopFilterKey, value: entry.value }]
      : []
  );
}

/**
 * Owner-supplied cover images, keyed by "<filter>:<value>".
 * Style covers live in /public/images/find ("Solid" is the renamed Minimalist
 * style, so its filter value stays `minimalist` and the file is solid.jpg).
 * Construction covers live in /public/constructioncover; the Flatweave file is
 * named flatweaven.jpg on disk. Values without a file here keep using the
 * first matching real Shopify product image.
 */
const COVER_IMAGES: Readonly<Record<string, string>> = {
  'style:traditional': '/images/find/traditional.jpg',
  'style:modern': '/images/find/modern.jpg',
  'style:abstract': '/images/find/abstract.jpg',
  'style:minimalist': '/images/find/solid.jpg',
  'construction:hand-knotted': '/constructioncover/handknotted.jpg',
  'construction:hand-tufted': '/constructioncover/handtufted.jpg',
  'construction:hand-woven': '/constructioncover/handwoven.jpg',
  'construction:flatweave': '/constructioncover/flatweaven.jpg'
};

/** Pure helper: pick each tile's image from an already loaded product list. */
export function buildFindYourRugGroups(products: Product[]): FindYourRugGroup[] {
  return GROUPS.map(({ id, heading }) => ({
    id,
    heading,
    tiles: menuItems(id).map(({ label, href, param, value }) => {
      const cover = COVER_IMAGES[`${param}:${value}`];
      if (cover) return { label, href, image: { url: cover } };
      const match = applyShopFilters(products, { [param]: value }).find((product) =>
        isShopifyImage(product.featuredImage?.url)
      );
      const featured = match?.featuredImage;
      return {
        label,
        href,
        image:
          featured && isShopifyImage(featured.url)
            ? { url: featured.url, width: featured.width, height: featured.height }
            : undefined
      };
    })
  }));
}

/** Load the catalogue with the same query /shop uses and build both groups. Never throws. */
export async function getFindYourRugGroups(country?: string): Promise<FindYourRugGroup[]> {
  try {
    const products = await getProducts({ country });
    return buildFindYourRugGroups(products);
  } catch (error) {
    console.error('[Find your rug] Could not load products', error);
    return GROUPS.map(({ id, heading }) => ({
      id,
      heading,
      tiles: menuItems(id).map(({ label, href, param, value }) => {
        const cover = COVER_IMAGES[`${param}:${value}`];
        return cover ? { label, href, image: { url: cover } } : { label, href };
      })
    }));
  }
}
