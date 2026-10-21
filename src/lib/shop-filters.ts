/**
 * SUKLA RUGS /shop filter matching for the mega menu params
 * (style, room, construction, material, collection).
 *
 * DATA INTEGRITY RULE: this helper only READS fields that exist on a real
 * Shopify product. It never invents tags, never fills in defaults and never
 * treats "no data" as a match. If nothing matches, /shop shows an explicit
 * empty state.
 *
 * Matching rules (conservative, documented):
 *
 * 1. Structured sources, checked for every filter. Curated data, so a
 *    case-insensitive substring match on the value is enough:
 *      - sukla metafields: style, room, construction + technique, material, shape
 *      - product.tags
 *      - product.productType
 *      - product.options[].values and variants[].selectedOptions[].value
 *
 * 2. Text sources (title + description). Marketing copy, so they are used
 *    only where a plain word or phrase is a reliable signal, and always with
 *    word boundaries:
 *      - material (wool, silk, jute and any other material slug)
 *      - construction (hand knotted, hand tufted, hand woven, handloom ...)
 *      - room: the exact phrases "living room", "bedroom", "dining room"
 *    STYLE NEVER MATCHES FREE TEXT. Words like "modern" or "neutral" are
 *    common filler; a style needs a tag, a sukla.style metafield, a product
 *    type or an option value.
 *
 * 3. Collection keywords (menu "Area Rugs" column). Used by /shop ONLY when a
 *    real Shopify collection with that handle does not exist:
 *      - runners: "runner" in title, tags, product type or option values
 *      - round-rugs: "round" in title, tags, product type or option values
 *      - shaped-rugs: a sukla.shape metafield, a "shaped" tag, or "shaped" in title
 *      - bestseller: a "bestseller" / "best-seller" tag only
 *      - premium-rugs: a "premium" tag or a product type containing "premium" only
 *    Any other collection handle never matches by keyword.
 *
 * Values are slugs (lowercase letters, digits, hyphens). Anything else is
 * ignored and never echoed back.
 */

import type { Product } from '@/types';
import { findMenuItem, type ShopFilterKey } from '@/lib/shop-menu';

export type ShopFilters = Partial<Record<ShopFilterKey, string>>;

const SLUG_PATTERN = /^[a-z0-9-]{1,40}$/;
const FILTER_KEYS: readonly ShopFilterKey[] = ['style', 'room', 'construction', 'material', 'collection'];

const KEY_LABELS: Record<ShopFilterKey | 'color', string> = {
  style: 'Style',
  room: 'Room',
  construction: 'Construction',
  material: 'Material',
  collection: 'Collection',
  color: 'Color'
};

/** Parse the raw /shop search params into validated filters. */
export function parseShopFilters(params: Partial<Record<string, string | string[] | undefined>>): ShopFilters {
  const filters: ShopFilters = {};
  for (const key of FILTER_KEYS) {
    const raw = params[key];
    const first = Array.isArray(raw) ? raw[0] : raw;
    const value = first?.trim().toLowerCase();
    if (!value || value === 'all' || !SLUG_PATTERN.test(value)) continue;
    filters[key] = value;
  }
  return filters;
}

/** Validated color slug for display only (color matching stays in getProducts). */
export function parseColorFilter(color: string | undefined): string | undefined {
  const value = color?.trim().toLowerCase();
  return value && value !== 'all' && SLUG_PATTERN.test(value) ? value : undefined;
}

/** Turn a slug into a readable label, e.g. "hand-knotted" -> "Hand Knotted". */
function humanise(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Labels for chips and empty states. Menu label first, else a humanised slug. */
export function describeFilter(key: ShopFilterKey | 'color', value: string): { keyLabel: string; label: string } {
  const menuItem = key === 'color' ? undefined : findMenuItem(key, value);
  return { keyLabel: KEY_LABELS[key], label: menuItem?.label ?? humanise(value) };
}

/** Values whose spelling differs from the plain slug. */
const PHRASE_ALIASES: Record<string, string> = {
  handloom: 'hand[\\s_-]?loom'
};

function phrasePattern(value: string): string {
  return PHRASE_ALIASES[value] ?? value.split('-').join('[\\s_-]?');
}

function loosePattern(value: string): RegExp {
  return new RegExp(phrasePattern(value), 'i');
}

function strictPattern(value: string): RegExp {
  return new RegExp(`\\b${phrasePattern(value)}\\b`, 'i');
}

function structuredText(product: Product, key: ShopFilterKey): string[] {
  const m = product.metafields;
  const fromMetafields: Array<string | undefined> =
    key === 'style'
      ? [m.style]
      : key === 'room'
        ? [m.room]
        : key === 'construction'
          ? [m.construction, m.technique]
          : key === 'material'
            ? [m.material]
            : [m.shape];

  return [
    ...fromMetafields,
    ...product.tags,
    product.productType,
    ...product.options.flatMap((option) => option.values),
    ...product.variants.flatMap((variant) => variant.selectedOptions.map((option) => option.value))
  ].filter((entry): entry is string => Boolean(entry && entry.trim()));
}

function freeText(product: Product): string {
  return `${product.title} ${product.description}`;
}

const TEXT_ELIGIBLE: ReadonlySet<ShopFilterKey> = new Set<ShopFilterKey>(['material', 'construction', 'room']);

function matchesCollectionKeyword(product: Product, handle: string): boolean {
  const titleTagsTypeOptions = [
    product.title,
    ...product.tags,
    product.productType,
    ...product.options.flatMap((option) => option.values)
  ].filter((entry): entry is string => Boolean(entry));

  switch (handle) {
    case 'runners':
      return titleTagsTypeOptions.some((entry) => /\brunners?\b/i.test(entry));
    case 'round-rugs':
      return titleTagsTypeOptions.some((entry) => /\bround\b/i.test(entry));
    case 'shaped-rugs':
      return (
        Boolean(product.metafields.shape?.trim()) ||
        product.tags.some((tag) => /\bshaped\b/i.test(tag)) ||
        /\bshaped\b/i.test(product.title)
      );
    case 'bestseller':
      return product.tags.some((tag) => /^best[\s-]?seller$/i.test(tag.trim()));
    case 'premium-rugs':
      return (
        product.tags.some((tag) => /^premium([\s-]?rugs?)?$/i.test(tag.trim())) ||
        /premium/i.test(product.productType ?? '')
      );
    default:
      return false;
  }
}

export function productMatchesFilter(product: Product, key: ShopFilterKey, value: string): boolean {
  if (key === 'collection') return matchesCollectionKeyword(product, value);

  const loose = loosePattern(value);
  if (structuredText(product, key).some((entry) => loose.test(entry))) return true;

  if (TEXT_ELIGIBLE.has(key)) {
    return strictPattern(value).test(freeText(product));
  }
  return false;
}

/** AND across style, room, construction, material. Collection is handled by /shop. */
export function applyShopFilters(products: Product[], filters: ShopFilters): Product[] {
  const keys: ShopFilterKey[] = ['style', 'room', 'construction', 'material'];
  return products.filter((product) =>
    keys.every((key) => {
      const value = filters[key];
      return !value || productMatchesFilter(product, key, value);
    })
  );
}
