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
}

/**
 * Ranks other purchasable products by how related they genuinely are, using
 * only real catalog data: same collection, same product type, shared tags.
 * Remaining products follow newest first, so a small catalog still gets
 * suggestions. Nothing is invented; the result is always real products.
 */
export function rankRelatedProducts<T extends RelatedCandidate>(current: T, candidates: T[], limit = 4): T[] {
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  return candidates
    .filter((p) => p.handle !== current.handle && p.availableForSale)
    .map((p) => {
      let score = 0;
      if (current.collection.handle && p.collection.handle === current.collection.handle) score += 4;
      if (current.productType && p.productType === current.productType) score += 2;
      score += Math.min(3, p.tags.filter((t) => currentTags.has(t.toLowerCase())).length);
      return { product: p, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
    )
    .slice(0, limit)
    .map((entry) => entry.product);
}

/**
 * True when a product only has Shopify's placeholder variant, which carries
 * no real size or option information to show a shopper.
 */
export function isPlaceholderVariantTitle(title: string | undefined): boolean {
  return !title || title.trim().toLowerCase() === 'default title';
}
