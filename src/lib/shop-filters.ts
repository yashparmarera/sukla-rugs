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
 *      - sukla metafields (namespace `sukla`, never `custom`):
 *          style  -> sukla.style AND sukla.palette (so style=neutral matches a
 *                    product whose palette list contains "Neutral")
 *          room   -> sukla.room
 *          construction -> sukla.construction, else sukla.technique
 *          material -> sukla.material
 *        List metafields arrive as JSON array strings ('["Modern","Minimalist"]').
 *        parseMetafieldValues() turns them into real values before comparing,
 *        so matching never runs on raw JSON text. Plain strings behave as before.
 *        Shopify GIDs (gid://shopify/...) in a list are not labels: they are
 *        dropped and never match (and never throw).
 *      - product.tags
 *      - product.productType
 *      - product.options[].values and variants[].selectedOptions[].value
 *
 * 2. Text sources (title + description). Marketing copy, so they are used
 *    only where a plain word or phrase is a reliable signal, and always with
 *    word boundaries:
 *      - material (wool, silk, jute and any other material slug)
 *      - construction (hand knotted, hand tufted, hand woven, handloom, flatweave ...)
 *      - room: the exact phrases "living room", "bedroom", "dining room"
 *    STYLE NEVER MATCHES FREE TEXT. Words like "modern" or "neutral" are
 *    common filler; a style needs a tag, a sukla.style metafield, a product
 *    type or an option value.
 *
 * 3. Collection keywords (menu "Area Rugs" column). Used by /shop ONLY when a
 *    real Shopify collection with that handle does not exist:
 *      - runners: sukla.rug_format equal to "Runner" (case-insensitive), OR
 *        "runner" in title, tags, product type or option values
 *      - round-rugs: sukla.shape equal to "Round" (case-insensitive), OR
 *        "round" in title, tags, product type or option values
 *      - shaped-rugs: a sukla.shape value that is present and is NOT
 *        rectangular / rectangle / square / round (e.g. Irregular, Oval,
 *        Scalloped, Organic), OR a "shaped" tag, OR "shaped" in title.
 *        A product with shape Rectangular or Round does NOT match shaped-rugs.
 *      - bestseller: a "bestseller" / "best-seller" tag only
 *      - premium-rugs: sukla.premium equal to "true" (case-insensitive), OR a
 *        "premium" tag, OR a product type containing "premium". A false or
 *        absent sukla.premium never matches by itself.
 *
 *    Metafield keys read by the storefront (all in namespace `sukla`):
 *    style, room, shape, construction, technique, material (text or list text),
 *    palette (list text), premium (boolean), rug_format (single text).
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
  handloom: 'hand[\\s_-]?loom',
  flatweave: 'flat[\\s_-]?weave'
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

/**
 * Read a metafield value as a list of comparable strings.
 *
 * Shopify returns list metafields as a JSON array string, for example
 * '["Modern","Minimalist"]', and single-value metafields as plain text. This
 * parser is defensive: JSON.parse is only attempted on values that look like
 * an array, a parse failure falls back to the raw string, entries are trimmed
 * and non-string entries are dropped. Plain strings come back as a one item
 * list, so single-value behaviour is unchanged.
 *
 * Shopify GIDs (gid://shopify/...), which a reference-type list metafield
 * returns, are NOT human labels and are dropped here so they never match.
 */
export function parseMetafieldValues(raw: string | undefined): string[] {
  const text = raw?.trim();
  if (!text) return [];

  let parsed: unknown = text;
  if (text.startsWith('[')) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  const items: unknown[] = Array.isArray(parsed) ? parsed : [text];
  return items
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !item.startsWith('gid://shopify/'));
}

function hasMetafieldValue(raw: string | undefined, expected: string): boolean {
  return parseMetafieldValues(raw).some((entry) => entry.toLowerCase() === expected);
}

/** Shape values that are ordinary rugs, not "shaped" rugs. */
const PLAIN_SHAPES: ReadonlySet<string> = new Set(['rectangular', 'rectangle', 'square', 'round']);

function structuredText(product: Product, key: ShopFilterKey): string[] {
  const m = product.metafields;
  // Construction: sukla.construction first, sukla.technique only as a fallback.
  const construction = parseMetafieldValues(m.construction);
  const fromMetafields: string[] =
    key === 'style'
      ? [...parseMetafieldValues(m.style), ...parseMetafieldValues(m.palette)]
      : key === 'room'
        ? parseMetafieldValues(m.room)
        : key === 'construction'
          ? construction.length > 0
            ? construction
            : parseMetafieldValues(m.technique)
          : key === 'material'
            ? parseMetafieldValues(m.material)
            : parseMetafieldValues(m.shape);

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
      return (
        hasMetafieldValue(product.metafields.rug_format, 'runner') ||
        titleTagsTypeOptions.some((entry) => /\brunners?\b/i.test(entry))
      );
    case 'round-rugs':
      return (
        hasMetafieldValue(product.metafields.shape, 'round') ||
        titleTagsTypeOptions.some((entry) => /\bround\b/i.test(entry))
      );
    case 'shaped-rugs':
      return (
        parseMetafieldValues(product.metafields.shape).some((shape) => !PLAIN_SHAPES.has(shape.toLowerCase())) ||
        product.tags.some((tag) => /\bshaped\b/i.test(tag)) ||
        /\bshaped\b/i.test(product.title)
      );
    case 'bestseller':
      return product.tags.some((tag) => /^best[\s-]?seller$/i.test(tag.trim()));
    case 'premium-rugs':
      return (
        hasMetafieldValue(product.metafields.premium, 'true') ||
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
