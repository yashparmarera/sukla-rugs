import type { Product } from '@/types';
import { parseMetafieldValues } from '@/lib/shop-filters';
import { BRAND_NAME } from '@/lib/product-display';

const IN_STOCK = 'https://schema.org/InStock';
const OUT_OF_STOCK = 'https://schema.org/OutOfStock';

type JsonLd = Record<string, unknown>;

function availability(available: boolean): string {
  return available ? IN_STOCK : OUT_OF_STOCK;
}

/**
 * schema.org Product data for a product page, built only from real Shopify
 * fields. Every field is omitted when the store has no value for it. There is
 * deliberately no offers.url (no site URL is configured in the repository),
 * no aggregateRating, no review and no itemCondition.
 */
export function buildProductJsonLd(product: Product): JsonLd {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title
  };

  const description = product.description.replace(/\s+/g, ' ').trim();
  if (description) data.description = description;

  // The data layer substitutes a stock placeholder when a product has no photo.
  const images = product.images.filter((img) => img.id !== 'placeholder-img' && img.url).map((img) => img.url);
  if (images.length > 0) data.image = images;

  const sku = product.variants.find((variant) => variant.sku?.trim())?.sku?.trim();
  if (sku) data.sku = sku;

  data.brand = { '@type': 'Brand', name: BRAND_NAME };

  const material = parseMetafieldValues(product.metafields.material).join(', ');
  if (material) data.material = material;

  const color =
    parseMetafieldValues(product.metafields.palette).join(', ') || product.metafields.color_family?.trim();
  if (color) data.color = color;

  if (product.variants.length === 1) {
    const variant = product.variants[0];
    data.offers = {
      '@type': 'Offer',
      priceCurrency: variant.price.currencyCode,
      price: variant.price.amount,
      availability: availability(variant.availableForSale)
    };
  } else if (product.variants.length > 1) {
    data.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      offerCount: product.variants.length,
      availability: availability(product.availableForSale)
    };
  }

  return data;
}

/** Safe for an inline <script>: "<" is escaped so the data can never close the tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
