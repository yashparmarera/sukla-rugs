import { parseMetafieldValues } from '@/lib/shop-filters';
import { findMenuItem } from '@/lib/shop-menu';
import type { ProductMetafields, WeightUnit } from '@/types';

const TITLE_SEPARATORS = [' | ', ' - ', ' \u2013 ', ' \u2014 ', ', '];
const MIN_DISPLAY_LENGTH = 20;

/**
 * Returns a shorter title for display, for catalog titles that are long
 * keyword strings (for example marketplace-style listings).
 *
 * This is a display rule only. The product data is never modified, and the
 * full title stays available to callers through `isShortened`. The durable fix
 * is a shorter title in Shopify; this keeps long titles from dominating the
 * page until then.
 */
export function getDisplayTitle(title: string): { display: string; isShortened: boolean } {
  const trimmed = title.trim();

  let cutAt = -1;
  for (const separator of TITLE_SEPARATORS) {
    const index = trimmed.indexOf(separator, MIN_DISPLAY_LENGTH);
    if (index !== -1 && (cutAt === -1 || index < cutAt)) {
      cutAt = index;
    }
  }

  if (cutAt === -1) {
    return { display: trimmed, isShortened: false };
  }

  return { display: trimmed.slice(0, cutAt).trim(), isShortened: true };
}

export interface DescriptionFeature {
  /** Short lead-in, when the bullet has one (for example "Soft and comfortable underfoot"). */
  heading?: string;
  /** The body text of the bullet. */
  text: string;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/** "HAND-TUFTED WOOL CONSTRUCTION" -> "Hand-tufted wool construction". Mixed case is left alone. */
function softenAllCaps(value: string): string {
  const letters = value.replace(/[^A-Za-z]/g, '');
  if (letters.length < 4 || letters !== letters.toUpperCase()) return value;
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Splits "LEAD-IN - body", "LEAD-IN: body" or "Lead-in- Body" into a heading
 * and body. Returns just the text when no clear lead-in exists.
 */
function splitLeadIn(line: string): DescriptionFeature {
  const dashOrColon = line.match(/^(.{3,60}?)\s*[\u2013\u2014:]\s+(.{12,})$/);
  if (dashOrColon) {
    return { heading: softenAllCaps(dashOrColon[1].trim()), text: dashOrColon[2].trim() };
  }

  // Marketplace style: "Unique Floral Design- Beautiful ..." / "Soft Feel-Made with ..."
  const hyphen = line.match(/^(.{3,45}?[A-Za-z])-\s?([A-Z].{12,})$/);
  if (hyphen) {
    return { heading: softenAllCaps(hyphen[1].trim()), text: hyphen[2].trim() };
  }

  return { text: line };
}

/**
 * Turns the product's real description into a list of features. Uses the
 * list items from `descriptionHtml` when present, otherwise falls back to the
 * plain description's lines. Returns an empty list when there is no structure
 * to show; callers should then render the plain description instead.
 *
 * Only text is read. Shopify's HTML (which can carry classes from pasted
 * listings) is never rendered.
 */
export function extractDescriptionFeatures(descriptionHtml?: string, description?: string): DescriptionFeature[] {
  const fromHtml = [...(descriptionHtml ?? '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0);

  const lines =
    fromHtml.length >= 2
      ? fromHtml
      : (description ?? '')
          .split(/\r?\n/)
          .map((line) => line.replace(/^[\u2022\-*]\s*/, '').trim())
          .filter((line) => line.length > 0);

  // A single paragraph is not a feature list.
  if (lines.length < 2) return [];

  return lines.map(splitLeadIn);
}

const MAX_INTRO_LENGTH = 600;
const MIN_INTRO_SENTENCE_LENGTH = 120;

function htmlToPlainText(html: string): string {
  return decodeEntities(
    html
      .replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns the text of the leading paragraph(s) of `descriptionHtml`: everything
 * before the first list or heading. Text only, so Shopify's HTML is never
 * rendered. Capped near 600 characters, ending on a sentence when one fits.
 * Returns an empty string when the description starts with a list or heading,
 * or has no HTML.
 */
export function extractDescriptionIntro(descriptionHtml?: string): string {
  const html = descriptionHtml ?? '';
  const firstStructure = html.search(/<(ul|ol|h[1-6])[\s>]/i);
  const leading = firstStructure === -1 ? html : html.slice(0, firstStructure);
  const text = htmlToPlainText(leading);
  if (text.length <= MAX_INTRO_LENGTH) return text;

  const window = text.slice(0, MAX_INTRO_LENGTH);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (sentenceEnd >= MIN_INTRO_SENTENCE_LENGTH) return window.slice(0, sentenceEnd + 1);

  const lastSpace = window.lastIndexOf(' ');
  const cut = lastSpace > MIN_INTRO_SENTENCE_LENGTH ? window.slice(0, lastSpace) : window;
  return cut.replace(/[,;:\-\u2013\u2014\s]+$/, '') + '\u2026';
}

function normaliseForCompare(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * The intro paragraph to show above the feature list in "About this rug".
 * Empty when there is no intro, no feature list (the plain description is
 * shown instead then), or the intro only repeats the short description under
 * the title or the feature text itself.
 */
export function getDescriptionIntroForDisplay(options: {
  descriptionHtml?: string;
  features: DescriptionFeature[];
  shortDescription: string;
}): string {
  const { descriptionHtml, features, shortDescription } = options;
  if (features.length === 0) return '';

  const intro = extractDescriptionIntro(descriptionHtml);
  const normIntro = normaliseForCompare(intro);
  if (!normIntro) return '';

  const normShort = normaliseForCompare(shortDescription);
  if (normShort && (normIntro.includes(normShort) || normShort.includes(normIntro))) return '';

  // Features read from plain lines (no <li> in the HTML) would be repeated here.
  const repeatsFeature = features.some((feature) => {
    const normFeature = normaliseForCompare(feature.text);
    return normFeature.length > 0 && normIntro.includes(normFeature);
  });
  return repeatsFeature ? '' : intro;
}

/** Brand name written into every page title. */
export const BRAND_NAME = 'SUKLA RUGS';

/** Meta descriptions are trimmed to about this many characters. */
const META_DESCRIPTION_LENGTH = 160;

/** Appends " | SUKLA RUGS" to a title unless it already ends with the brand (any case, "|", "-", en or em dash). */
export function withBrandSuffix(title: string): string {
  const stripped = title.replace(/\s*[|\u2013\u2014-]\s*sukla rugs\s*$/i, '').trim();
  return `${stripped} | ${BRAND_NAME}`;
}

/** Trims plain text to about 160 characters on a word boundary; adds an ellipsis only when trimmed. */
export function trimMetaDescription(text: string): string | undefined {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return undefined;
  if (clean.length <= META_DESCRIPTION_LENGTH) return clean;

  const window = clean.slice(0, META_DESCRIPTION_LENGTH + 1);
  const lastSpace = window.lastIndexOf(' ');
  const cut = lastSpace > 0 ? window.slice(0, lastSpace) : window.slice(0, META_DESCRIPTION_LENGTH);
  return cut.replace(/[,;:\-\u2013\u2014\s]+$/, '') + '\u2026';
}

/**
 * Title and description for a product page's metadata. Uses the Shopify
 * "Search engine listing" values when set; otherwise the full product title
 * (not the shortened display title) and the start of the plain description.
 * Nothing is invented. The brand appears exactly once because the root layout
 * has no title template.
 */
export function buildProductMetadata(product: {
  title: string;
  description: string;
  seo?: { title?: string; description?: string };
}): { title: string; description: string | undefined } {
  const seoTitle = product.seo?.title?.trim();
  const seoDescription = product.seo?.description?.trim();
  return {
    title: withBrandSuffix(seoTitle || product.title),
    description: seoDescription || trimMetaDescription(product.description)
  };
}

const MAX_SHORT_DESCRIPTION = 170;
const MIN_SENTENCE_LENGTH = 60;

/**
 * Builds the short line shown under the product title, using only real store text.
 *
 * Preference order:
 *  1. The merchant-written `short_description` metafield, when set.
 *  2. The body of the first feature in the product's own description.
 *  3. The start of the plain description.
 *
 * The result ends on a sentence boundary when one fits, is never longer than
 * about 170 characters, and is empty when it would just repeat the title.
 */
export function buildShortDescription(options: {
  override?: string;
  features: DescriptionFeature[];
  description?: string;
  title: string;
}): string {
  const { override, features, description, title } = options;
  const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

  let source = clean(override ?? '');
  if (!source) {
    const firstFeature = features.find((feature) => feature.text.length >= 40);
    source = firstFeature
      ? clean(firstFeature.text)
      : clean((description ?? '').replace(/^About this item\s*/i, ''));
  }
  if (!source) return '';

  // Never repeat the title itself.
  const titleStart = clean(title).toLowerCase().slice(0, 30);
  if (titleStart && source.toLowerCase().startsWith(titleStart)) return '';

  if (source.length <= MAX_SHORT_DESCRIPTION) return source;

  const window = source.slice(0, MAX_SHORT_DESCRIPTION);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (sentenceEnd >= MIN_SENTENCE_LENGTH) return window.slice(0, sentenceEnd + 1);

  const lastSpace = window.lastIndexOf(' ');
  const cut = lastSpace > MIN_SENTENCE_LENGTH ? window.slice(0, lastSpace) : window;
  return cut.replace(/[,;:\-\u2013\u2014\s]+$/, '') + '\u2026';
}

/**
 * Reads a listed size such as "(2.6x10 ft)" or "5 x 8 ft" from the product
 * title. It returns the text exactly as the listing wrote it. No unit
 * conversion is applied, because "2.6" can mean 2 ft 6 in or 2.6 ft.
 */
export function parseListedSize(title: string): string | null {
  const match = title.match(/(\d+(?:\.\d+)?)\s*[x\u00D7]\s*(\d+(?:\.\d+)?)\s*(ft|feet|foot|')/i);
  if (!match) return null;
  const unit = match[3] === "'" ? 'ft' : match[3].toLowerCase();
  return `${match[1]} x ${match[2]} ${unit}`;
}

interface RelatedCandidate {
  id: string;
  handle: string;
  availableForSale: boolean;
  productType?: string;
  tags: string[];
  createdAt: string;
  collection: { handle: string };
  /** Every collection the product belongs to, when known. */
  collections?: { handle: string }[];
  metafields?: ProductMetafields;
}

/** Lower-cased, de-duplicated values of a list or text metafield. */
function metafieldSet(raw: string | undefined): Set<string> {
  return new Set(parseMetafieldValues(raw).map((value) => value.toLowerCase()));
}

function overlapCount(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const value of a) if (b.has(value)) count += 1;
  return count;
}

function collectionHandles(product: RelatedCandidate): Set<string> {
  const handles = new Set<string>();
  if (product.collection.handle) handles.add(product.collection.handle);
  for (const entry of product.collections ?? []) if (entry.handle) handles.add(entry.handle);
  return handles;
}

/**
 * Score for how related `candidate` is to `current`, using only real catalog
 * data. A metafield only scores when BOTH products have a value for it.
 *
 *  - shared collection +4 (once), same product type +2, shared tags up to +3
 *  - sukla.style overlap +2 each (max 4), sukla.room +1 each (max 2),
 *    sukla.palette +1 each (max 2)
 *  - same sukla.shape +2, same sukla.rug_format +2
 *  - sukla.construction (else technique) overlap +2, sukla.material +1 each (max 2)
 */
function relatedScore(current: RelatedCandidate, candidate: RelatedCandidate): number {
  let score = 0;

  const currentHandles = collectionHandles(current);
  if ([...collectionHandles(candidate)].some((handle) => currentHandles.has(handle))) score += 4;

  if (current.productType && candidate.productType === current.productType) score += 2;

  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));
  score += Math.min(3, candidate.tags.filter((t) => currentTags.has(t.toLowerCase())).length);

  const a = current.metafields;
  const b = candidate.metafields;
  if (a && b) {
    score += Math.min(4, 2 * overlapCount(metafieldSet(a.style), metafieldSet(b.style)));
    score += Math.min(2, overlapCount(metafieldSet(a.room), metafieldSet(b.room)));
    score += Math.min(2, overlapCount(metafieldSet(a.palette), metafieldSet(b.palette)));
    score += Math.min(2, overlapCount(metafieldSet(a.material), metafieldSet(b.material)));
    if (overlapCount(metafieldSet(a.shape), metafieldSet(b.shape)) > 0) score += 2;
    if (overlapCount(metafieldSet(a.rug_format), metafieldSet(b.rug_format)) > 0) score += 2;
    const constructionA = metafieldSet(a.construction || a.technique);
    const constructionB = metafieldSet(b.construction || b.technique);
    if (overlapCount(constructionA, constructionB) > 0) score += 2;
  }

  return score;
}

/**
 * Ranks other purchasable products by how related they genuinely are, using
 * only real catalog data: shared collections, product type, tags and the
 * `sukla` metafields (style, room, palette, shape, format, construction,
 * material). Ties go to the newest product, then to the handle, so the order
 * is deterministic. Remaining products follow, so a small catalog still gets
 * suggestions. Nothing is invented or padded; the result only contains
 * products that were passed in.
 */
export function rankRelatedProducts<T extends RelatedCandidate>(current: T, candidates: T[], limit = 4): T[] {
  return candidates
    .filter((p) => p.handle !== current.handle && p.availableForSale)
    .map((p) => ({ product: p, score: relatedScore(current, p) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime() ||
        a.product.handle.localeCompare(b.product.handle)
    )
    .slice(0, limit)
    .map((entry) => entry.product);
}

/** One value shown in a specification or detail row; linked only when a real target exists. */
export interface FactValue {
  label: string;
  href?: string;
}

/** "Living Room" -> "living-room". Matches the slugs used by the Shop menu. */
export function facetSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueValues(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Values of a classification metafield (a list, or text such as "Wool, Silk"),
 * each linked to the matching /shop filter only when that value is a Shop menu item.
 */
export function getFacetValues(
  key: 'style' | 'room' | 'construction' | 'material',
  raw: string | undefined
): FactValue[] {
  const labels = uniqueValues(
    parseMetafieldValues(raw).flatMap((entry) =>
      entry
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
    )
  );
  return labels.map((label) => {
    const href = findMenuItem(key, facetSlug(label))?.href;
    return href ? { label, href } : { label };
  });
}

/** Values of a metafield that is shown as plain text (no filter exists for it). */
export function getPlainValues(raw: string | undefined): FactValue[] {
  return uniqueValues(parseMetafieldValues(raw)).map((label) => ({ label }));
}

/**
 * Every collection the product belongs to. Each links to its collection page
 * (which renders real Shopify data for real handles), except Shopify's
 * "frontpage" (Home page) collection, which is not a merchandising link.
 */
export function getCollectionFacts(product: {
  collection: { title: string; handle: string };
  collections?: { title: string; handle: string }[];
}): FactValue[] {
  const source = product.collections?.length
    ? product.collections
    : product.collection.handle
      ? [product.collection]
      : [];
  const seen = new Set<string>();
  const facts: FactValue[] = [];
  for (const entry of source) {
    if (!entry.title || !entry.handle || seen.has(entry.handle)) continue;
    seen.add(entry.handle);
    facts.push(
      entry.handle === 'frontpage'
        ? { label: entry.title }
        : { label: entry.title, href: `/collections/${encodeURIComponent(entry.handle)}` }
    );
  }
  return facts;
}

const WEIGHT_UNITS: Record<WeightUnit, { suffix: string; decimals: number }> = {
  KILOGRAMS: { suffix: 'kg', decimals: 2 },
  GRAMS: { suffix: 'g', decimals: 0 },
  POUNDS: { suffix: 'lb', decimals: 2 },
  OUNCES: { suffix: 'oz', decimals: 1 }
};

/**
 * Shipping weight text such as "1 kg" or "12.35 lb". Undefined when the
 * weight is missing, not positive, or has no known unit (Shopify stores 0 when
 * no weight was entered). Locale independent so server and client agree.
 */
export function formatShippingWeight(weight: number | undefined, unit: WeightUnit | undefined): string | undefined {
  if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0 || !unit) return undefined;
  const config = WEIGHT_UNITS[unit];
  if (!config) return undefined;
  const rounded = Number(weight.toFixed(config.decimals));
  if (rounded <= 0) return undefined;
  return `${rounded.toString()} ${config.suffix}`;
}

/**
 * True when a product only has Shopify's placeholder variant, which carries
 * no real size or option information to show a shopper.
 */
export function isPlaceholderVariantTitle(title: string | undefined): boolean {
  return !title || title.trim().toLowerCase() === 'default title';
}
