/**
 * SUKLA RUGS product "at a glance" infographics: pure parsers.
 *
 * DATA INTEGRITY RULE: every tile and care icon is derived from a real Shopify
 * field (sukla.* metafields, variant options, or the listed size in the
 * product title). Nothing is invented: a missing or unparseable value gives no
 * tile, and a product without usable data gives an empty list so the PDP hides
 * the whole block. The only fixed copy is the general description of each
 * construction technique, which never makes a claim about a specific rug.
 *
 * No React here; components map the string icon ids to inline SVG.
 */

import { parseMetafieldValues } from '@/lib/shop-filters';
import { isPlaceholderVariantTitle, parseListedSize } from '@/lib/product-display';
import type { Product, ProductMetafields, ProductVariant } from '@/types';

export type IconName =
  | 'construction-hand-knotted' | 'construction-hand-tufted' | 'construction-flatweave'
  | 'construction-handwoven' | 'construction-braided' | 'construction-generic'
  | 'material-wool' | 'material-jute' | 'material-cotton' | 'material-silk' | 'material-viscose' | 'material-generic'
  | 'room-living' | 'room-bedroom' | 'room-dining' | 'room-entry' | 'room-kids' | 'room-office' | 'room-kitchen'
  | 'room-outdoor' | 'room-generic'
  | 'care-vacuum' | 'care-no-beater-bar' | 'care-spot-clean' | 'care-blot' | 'care-no-rub' | 'care-professional'
  | 'care-rotate' | 'care-avoid-sun' | 'care-rug-pad' | 'care-no-machine-wash' | 'care-shake' | 'care-dry-naturally'
  | 'care-avoid-water'
  | 'pile' | 'knots' | 'size' | 'origin' | 'craft-time';

export type ConstructionCategory = 'hand-knotted' | 'hand-tufted' | 'flatweave' | 'handwoven' | 'braided' | 'other';
export type PileBand = 'flat' | 'low' | 'medium' | 'high';
export type ShapeKey = 'rectangle' | 'square' | 'round' | 'oval' | 'runner' | 'scalloped' | 'irregular' | 'other';
export type CareKey =
  | 'vacuum' | 'no-beater-bar' | 'spot-clean' | 'blot' | 'no-rub' | 'professional' | 'rotate'
  | 'avoid-sun' | 'rug-pad' | 'no-machine-wash' | 'shake' | 'dry-naturally' | 'avoid-water';

export interface PileHeight {
  minMm: number;
  maxMm: number;
  band: PileBand;
  bandFromStore: boolean;
  /** 0..1 on the piecewise 4-band scale */
  position: number;
  rangeStart: number;
  rangeEnd: number;
  valueText: string;
}

export interface KnotDensity {
  min: number;
  max: number;
  position: number;
  valueText: string;
}

export interface RugSize {
  a: number;
  b: number;
  unit?: 'ft' | 'cm' | 'm' | 'in';
  label: string;
  /** short/long side, 0..1 */
  ratio: number;
}

export interface CareLine {
  label?: string;
  text: string;
  keys: CareKey[];
}

export interface CareGuide {
  icons: { key: CareKey; caption: string; icon: IconName }[];
  lines: CareLine[];
}

export type GlanceTile =
  | {
      kind: 'construction';
      title: 'Construction';
      label: string;
      category: ConstructionCategory;
      icon: IconName;
      summary?: string;
    }
  | { kind: 'material'; title: 'Material' | 'Materials'; items: { label: string; icon: IconName }[] }
  | { kind: 'pile'; title: 'Pile height'; pile: PileHeight }
  | { kind: 'knots'; title: 'Knot density'; knots: KnotDensity }
  | {
      kind: 'shape-size';
      title: 'Shape & size' | 'Shape' | 'Size';
      shape?: { key: ShapeKey; label: string };
      size?: RugSize;
    }
  | { kind: 'rooms'; title: 'Suitable rooms'; items: { label: string; icon: IconName }[] }
  | {
      kind: 'origin-craft';
      title: 'Origin & craft' | 'Origin' | 'Craft time';
      origin?: string;
      craftTime?: string;
    };

const MAX_TILES = 6;

/** Unicode en/em dashes become "-" so numeric ranges parse the same way. */
function normalizeDashes(value: string): string {
  return value.replace(/[\u2013\u2014]/g, '-');
}

/** At most one decimal, no trailing ".0". */
function formatNumber(value: number): string {
  return String(Math.round(value * 10) / 10);
}

function formatRange(min: number, max: number, format: (n: number) => string = formatNumber): string {
  const a = format(min);
  const b = format(max);
  return a === b ? a : `${a}\u2013${b}`;
}

function dedupe(values: string[], max: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
    if (result.length >= max) break;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Construction

/** Machine-made values never get a technique summary (it could imply hand work). */
const MACHINE_MADE = /machine|power[\s_-]?loom/i;

/**
 * "Hand" categories need the word "hand" in the store value; a bare "Woven"
 * or "Tufted" stays 'other' so no hand-made claim is made.
 */
const CONSTRUCTION_RULES: { category: Exclude<ConstructionCategory, 'other'>; pattern: RegExp }[] = [
  { category: 'hand-knotted', pattern: /hand[\s_-]?knot/i },
  { category: 'hand-tufted', pattern: /hand[\s_-]?tuft/i },
  { category: 'flatweave', pattern: /flat[\s_-]?(?:weave|woven)|kilim|dhurrie|durrie|soumak/i },
  { category: 'handwoven', pattern: /hand[\s_-]?(?:woven|loom)/i },
  { category: 'braided', pattern: /braid/i }
];

/** General description of each technique. Never a claim about a specific rug. */
const CONSTRUCTION_SUMMARIES: Record<Exclude<ConstructionCategory, 'other'>, string> = {
  'hand-knotted': 'Each knot is tied by hand around the warp threads on a loom.',
  'hand-tufted': 'Yarn is punched through a backing cloth with a hand-held tufting tool.',
  flatweave: 'Woven on a loom without a pile, giving a thin, flat surface.',
  handwoven: 'Woven by hand on a loom by interlacing warp and weft yarns.',
  braided: 'Strands are braided, then coiled and stitched together.'
};

const CONSTRUCTION_ICONS: Record<ConstructionCategory, IconName> = {
  'hand-knotted': 'construction-hand-knotted',
  'hand-tufted': 'construction-hand-tufted',
  flatweave: 'construction-flatweave',
  handwoven: 'construction-handwoven',
  braided: 'construction-braided',
  other: 'construction-generic'
};

function constructionValues(m: ProductMetafields): string[] {
  const values = parseMetafieldValues(m.construction);
  return values.length > 0 ? values : parseMetafieldValues(m.technique);
}

function constructionCategory(values: string[]): ConstructionCategory {
  if (values.some((value) => MACHINE_MADE.test(value))) return 'other';
  for (const value of values) {
    const rule = CONSTRUCTION_RULES.find((r) => r.pattern.test(value));
    if (rule) return rule.category;
  }
  return 'other';
}

export function getConstruction(m: ProductMetafields): GlanceTile | null {
  const values = constructionValues(m);
  if (values.length === 0) return null;

  const category = constructionCategory(values);
  return {
    kind: 'construction',
    title: 'Construction',
    label: values.join(', '),
    category,
    icon: CONSTRUCTION_ICONS[category],
    ...(category === 'other' ? {} : { summary: CONSTRUCTION_SUMMARIES[category] })
  };
}

// ---------------------------------------------------------------------------
// Material

function materialIcon(label: string): IconName {
  if (/viscose|art[\s-]?silk|bamboo[\s-]?silk|rayon|tencel|lyocell/i.test(label)) return 'material-viscose';
  if (/silk/i.test(label)) return 'material-silk';
  if (/wool/i.test(label)) return 'material-wool';
  if (/jute|hemp|sisal|seagrass/i.test(label)) return 'material-jute';
  if (/cotton/i.test(label)) return 'material-cotton';
  return 'material-generic';
}

export function getMaterials(m: ProductMetafields): GlanceTile | null {
  const parts = parseMetafieldValues(m.material).flatMap((value) =>
    value.split(/\s*(?:,|\/|\+|&|\band\b)\s*/i).map((part) => part.trim())
  );
  const labels = dedupe(parts, 4);
  if (labels.length === 0) return null;

  return {
    kind: 'material',
    title: labels.length > 1 ? 'Materials' : 'Material',
    items: labels.map((label) => ({ label, icon: materialIcon(label) }))
  };
}

// ---------------------------------------------------------------------------
// Pile height

const NUM = String.raw`(\d+(?:\.\d+)?)`;
const RANGE = String.raw`${NUM}(?:\s*-\s*${NUM})?`;
const INCH_UNIT = String.raw`(?:inches|inch|in\b|"|\u2033)`;
/** Mixed number ("1 1/2"), decimal ("0.75") or fraction ("3/4"). */
const INCH_NUM = String.raw`(\d+(?:\.\d+)?(?:\s+\d+\s*\/\s*\d+)?|\d+\s*\/\s*\d+)`;
const INCH_RANGE = String.raw`${INCH_NUM}(?:\s*-\s*${INCH_NUM})?`;

/** "1 1/2" gives 1.5, "3/4" gives 0.75, "0.5" gives 0.5; a zero denominator gives null. */
function parseInchValue(text: string): number | null {
  const mixed = text.trim().match(/^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/);
  if (!mixed) return parseFloat(text);
  const denominator = parseInt(mixed[3], 10);
  if (!(denominator > 0)) return null;
  return (mixed[1] ? parseInt(mixed[1], 10) : 0) + parseInt(mixed[2], 10) / denominator;
}

/** Up to two decimals, so store values such as 0.75 in or 2.67 ft are shown unchanged. */
function formatTwoDecimals(value: number): string {
  return String(Math.round(value * 100) / 100);
}

const PILE_BANDS: PileBand[] = ['flat', 'low', 'medium', 'high'];
/** Upper bound (mm) of each band on the gauge scale. High is drawn up to 30 mm. */
const PILE_SCALE: [number, number][] = [
  [0, 3],
  [3, 6.35],
  [6.35, 19],
  [19, 30]
];

function computedBand(mm: number): PileBand {
  if (mm <= 3) return 'flat';
  if (mm < 6.35) return 'low';
  if (mm < 19) return 'medium';
  return 'high';
}

function pilePosition(mm: number): number {
  const value = Math.min(Math.max(mm, 0), 30);
  for (let i = 0; i < PILE_SCALE.length; i++) {
    const [start, end] = PILE_SCALE[i];
    if (value <= end || i === PILE_SCALE.length - 1) {
      return i * 0.25 + ((value - start) / (end - start)) * 0.25;
    }
  }
  return 1;
}

const BAND_WORD = String.raw`(?:flat|low|medium|med|high|shag)`;
/** A band word joined to another ("high-low", "low high") names no single band. */
const JOINED_BEFORE = new RegExp(String.raw`\b${BAND_WORD}[\s-]+$`, 'i');
const JOINED_AFTER = new RegExp(String.raw`^[\s-]+${BAND_WORD}\b`, 'i');

function storeBand(raw: string): PileBand | null {
  const candidates = [
    ...raw.matchAll(/\b(flat|low|medium|med|high|shag)\b[\s-]*pile/gi),
    ...raw.matchAll(/pile[:\s-]+(flat|low|medium|high)\b/gi)
  ];
  const match = candidates.find((m) => {
    const wordStart = (m.index ?? 0) + m[0].toLowerCase().indexOf(m[1].toLowerCase());
    const wordEnd = wordStart + m[1].length;
    return !JOINED_BEFORE.test(raw.slice(0, wordStart)) && !JOINED_AFTER.test(raw.slice(wordEnd));
  });
  if (!match) return null;
  const word = match[1].toLowerCase();
  if (word === 'med') return 'medium';
  if (word === 'shag') return 'high';
  return word as PileBand;
}

function readRange(match: RegExpMatchArray | null): [number, number] | null {
  if (!match) return null;
  const min = parseFloat(match[1]);
  const max = match[2] !== undefined ? parseFloat(match[2]) : min;
  return [Math.min(min, max), Math.max(min, max)];
}

export function parsePileHeight(raw?: string): PileHeight | null {
  const text = raw?.trim();
  if (!text) return null;
  const value = normalizeDashes(text);

  // Inch values may be decimals, fractions or mixed numbers, alone or as a
  // range: "0.5", "1/2", "1 1/2", "1/2-3/4 inch".
  const inchMatch = value.match(new RegExp(String.raw`${INCH_RANGE}\s*${INCH_UNIT}`, 'i'));
  let inches: [number, number] | null = null;
  if (inchMatch) {
    const min = parseInchValue(inchMatch[1]);
    const max = inchMatch[2] !== undefined ? parseInchValue(inchMatch[2]) : min;
    if (min === null || max === null) return null;
    inches = [Math.min(min, max), Math.max(min, max)];
  }
  const mm = readRange(value.match(new RegExp(String.raw`${RANGE}\s*mm\b`, 'i')));
  const cm = readRange(value.match(new RegExp(String.raw`${RANGE}\s*cm\b`, 'i')));

  let range: [number, number];
  let converted = false;
  if (mm) {
    range = mm;
  } else if (cm) {
    range = [cm[0] * 10, cm[1] * 10];
  } else if (inches) {
    range = [inches[0] * 25.4, inches[1] * 25.4];
    converted = true;
  } else {
    return null;
  }

  const [minMm, maxMm] = range;
  if (!(minMm > 0) || minMm > maxMm || maxMm > 100) return null;

  const fromStore = storeBand(value);
  const band = fromStore ?? computedBand((minMm + maxMm) / 2);

  let rangeStart = pilePosition(minMm);
  let rangeEnd = pilePosition(maxMm);
  let position = pilePosition((minMm + maxMm) / 2);
  if (fromStore) {
    const low = PILE_BANDS.indexOf(fromStore) * 0.25;
    const clamp = (n: number) => Math.min(Math.max(n, low), low + 0.25);
    rangeStart = clamp(rangeStart);
    rangeEnd = clamp(rangeEnd);
    position = clamp(position);
  }

  const parts: string[] = [];
  if (inches) parts.push(`${formatRange(inches[0], inches[1], formatTwoDecimals)} in`);
  if (mm) {
    parts.push(`${formatRange(mm[0], mm[1])} mm`);
  } else if (cm) {
    // Shown as the store wrote it, never as a rounded mm figure.
    parts.push(`${formatRange(cm[0], cm[1], formatTwoDecimals)} cm`);
  } else {
    parts.push(`${formatRange(minMm, maxMm, (n) => String(Math.round(n)))} mm`);
  }
  const approximate = converted || /~|\u2248|approx/i.test(value);

  return {
    minMm,
    maxMm,
    band,
    bandFromStore: Boolean(fromStore),
    position,
    rangeStart,
    rangeEnd,
    valueText: `${approximate ? '\u2248 ' : ''}${parts.join(' \u00B7 ')}`
  };
}

// ---------------------------------------------------------------------------
// Knot density (knots per square inch only)

const KNOT_SCALE_MAX = 400;

export function parseKnotDensity(raw?: string): KnotDensity | null {
  const text = raw?.trim();
  if (!text) return null;
  const value = normalizeDashes(text);
  if (/sq\.?\s*m\b|m²|m2\b|sqm|per\s+(?:square\s+)?met(?:re|er)|cm/i.test(value)) return null;
  // Quality notation ("9/9", "10x10 per inch") is knots per inch in each
  // direction, not knots per sq in; show no tile rather than a false figure.
  if (/\d\s*[\/x\u00D7]\s*\d/i.test(value)) return null;

  // Only a plain number or range, optionally followed by a per-sq-in unit.
  const match = value.match(
    /^(\d[\d,]*)(?:\s*-\s*(\d[\d,]*))?\s*(?:kpsi|knots?)?\s*(?:(?:\/|per)\s*(?:sq\.?\s*in(?:ch)?\.?|square\s+inch(?:es)?))?$/i
  );
  if (!match) return null;
  const min = parseInt(match[1].replace(/,/g, ''), 10);
  const max = match[2] !== undefined ? parseInt(match[2].replace(/,/g, ''), 10) : min;
  if (!(min >= 1) || !(max >= min) || max > 2000) return null;

  return {
    min,
    max,
    position: Math.min(Math.max((min + max) / 2 / KNOT_SCALE_MAX, 0), 1),
    valueText: `${formatRange(min, max, String)} knots / sq in`
  };
}

// ---------------------------------------------------------------------------
// Size and shape

const SIZE_PATTERN =
  /(\d+(?:\.\d+)?)\s*(ft|feet|foot|'|′)?\s*[x×X]\s*(\d+(?:\.\d+)?)\s*((?:ft|feet|foot|cm|m|in)(?![a-z])|'|′)?/i;

function sizeUnit(left?: string, right?: string): RugSize['unit'] {
  const units = [left, right].filter(Boolean).map((u) => (u as string).toLowerCase());
  if (units.some((u) => ['ft', 'feet', 'foot', "'", '′'].includes(u))) return 'ft';
  const unit = units[0];
  return unit === 'cm' || unit === 'm' || unit === 'in' ? unit : undefined;
}

export function parseRugSize(text?: string): RugSize | null {
  const match = text?.match(SIZE_PATTERN);
  if (!match) return null;
  const a = parseFloat(match[1]);
  const b = parseFloat(match[3]);
  if (!(a > 0) || !(b > 0)) return null;

  const unit = sizeUnit(match[2], match[4]);
  return {
    a,
    b,
    ...(unit ? { unit } : {}),
    label: `${formatTwoDecimals(a)} \u00D7 ${formatTwoDecimals(b)}${unit ? ` ${unit}` : ''}`,
    ratio: Math.min(a, b) / Math.max(a, b)
  };
}

/**
 * The size of the selected variant, so the tile follows the shopper's choice.
 * Option NAMES are never read (some products hold a size there).
 */
export function getSelectedSize(product: Product, variant: ProductVariant): RugSize | null {
  if (product.variants.length > 1) {
    for (const option of variant.selectedOptions) {
      const size = parseRugSize(option.value);
      if (size) return size;
    }
    return parseRugSize(variant.title);
  }

  if (!isPlaceholderVariantTitle(variant.title)) {
    const size = parseRugSize(variant.title);
    if (size) return size;
  }
  return parseRugSize(parseListedSize(product.title) ?? undefined);
}

function shapeKey(shape: string): ShapeKey {
  if (/rect/i.test(shape)) return 'rectangle';
  if (/square/i.test(shape)) return 'square';
  if (/round|circle/i.test(shape)) return 'round';
  if (/oval|ellip/i.test(shape)) return 'oval';
  if (/runner/i.test(shape)) return 'runner';
  if (/scallop/i.test(shape)) return 'scalloped';
  if (/irregular|organic|free[\s-]?form|abstract/i.test(shape)) return 'irregular';
  return 'other';
}

export function getShape(m: ProductMetafields): { key: ShapeKey; label: string } | null {
  const shape = parseMetafieldValues(m.shape)[0];
  const format = parseMetafieldValues(m.rug_format)[0];

  if (format && /runner/i.test(format) && (!shape || shapeKey(shape) === 'rectangle')) {
    return { key: 'runner', label: 'Runner' };
  }
  if (!shape) return null;
  return { key: shapeKey(shape), label: shape };
}

// ---------------------------------------------------------------------------
// Rooms

function roomIcon(label: string): IconName {
  if (/living|lounge|family/i.test(label)) return 'room-living';
  if (/bed/i.test(label)) return 'room-bedroom';
  if (/dining/i.test(label)) return 'room-dining';
  if (/hall|entry|foyer|corridor/i.test(label)) return 'room-entry';
  if (/kid|child|nursery|play/i.test(label)) return 'room-kids';
  if (/office|study|work/i.test(label)) return 'room-office';
  if (/kitchen/i.test(label)) return 'room-kitchen';
  if (/outdoor|patio|porch|balcony|garden/i.test(label)) return 'room-outdoor';
  return 'room-generic';
}

export function getRooms(m: ProductMetafields): GlanceTile | null {
  const parts = parseMetafieldValues(m.room).flatMap((value) => value.split(',').map((part) => part.trim()));
  const labels = dedupe(parts, 6);
  if (labels.length === 0) return null;
  return {
    kind: 'rooms',
    title: 'Suitable rooms',
    items: labels.map((label) => ({ label, icon: roomIcon(label) }))
  };
}

// ---------------------------------------------------------------------------
// Origin and craft time

export function getOriginCraft(m: ProductMetafields): GlanceTile | null {
  const origin = m.origin_region?.trim() || undefined;
  const craftTime = m.craft_duration?.trim() || undefined;
  if (!origin && !craftTime) return null;
  return {
    kind: 'origin-craft',
    title: origin && craftTime ? 'Origin & craft' : origin ? 'Origin' : 'Craft time',
    ...(origin ? { origin } : {}),
    ...(craftTime ? { craftTime } : {})
  };
}

// ---------------------------------------------------------------------------
// Assembly

export function buildAtAGlance(product: Product, variant: ProductVariant): GlanceTile[] {
  const m = product.metafields;
  const construction = getConstruction(m);
  const pile = parsePileHeight(m.pile_height);
  const knots =
    construction?.kind === 'construction' && construction.category === 'hand-knotted'
      ? parseKnotDensity(m.knots_per_sq_inch)
      : null;

  const shape = getShape(m);
  const size = getSelectedSize(product, variant);
  const shapeSize: GlanceTile | null =
    shape || size
      ? {
          kind: 'shape-size',
          title: shape && size ? 'Shape & size' : shape ? 'Shape' : 'Size',
          ...(shape ? { shape } : {}),
          ...(size ? { size } : {})
        }
      : null;

  const tiles: (GlanceTile | null)[] = [
    construction,
    getMaterials(m),
    pile ? { kind: 'pile', title: 'Pile height', pile } : null,
    knots ? { kind: 'knots', title: 'Knot density', knots } : null,
    shapeSize,
    getRooms(m),
    getOriginCraft(m)
  ];

  return tiles.filter((tile): tile is GlanceTile => tile !== null).slice(0, MAX_TILES);
}

// ---------------------------------------------------------------------------
// Care instructions

/**
 * `affirmative` rules turn a keyword into an instruction ("Vacuum", "Shake out
 * dirt"), so they only count when the keyword is not negated earlier in the
 * same clause ("Never dry clean", "Do not shake"). The other rules already
 * contain the negation or avoidance they express in their pattern.
 */
const CARE_RULES: { key: CareKey; pattern: RegExp; icon: IconName; caption: string; affirmative?: true }[] = [
  { key: 'vacuum', pattern: /\bvacuum/gi, icon: 'care-vacuum', caption: 'Vacuum', affirmative: true },
  {
    key: 'no-beater-bar',
    pattern: /(?:\bno|\bnot|never|don['\u2019]?t|without|avoid|turn(?:ed)? off|switch(?:ed)? off)[^.;,]{0,20}beater[\s-]?bar/gi,
    icon: 'care-no-beater-bar',
    caption: 'No beater bar'
  },
  { key: 'spot-clean', pattern: /spot[\s-]?clean/gi, icon: 'care-spot-clean', caption: 'Spot clean', affirmative: true },
  { key: 'blot', pattern: /\bblot/gi, icon: 'care-blot', caption: 'Blot spills', affirmative: true },
  {
    key: 'no-rub',
    pattern: /(?:never|don['\u2019]?t|do not|without|avoid)\s+rub/gi,
    icon: 'care-no-rub',
    caption: 'Never rub'
  },
  {
    key: 'professional',
    pattern: /professional|specialist|dry[\s-]?clean/gi,
    icon: 'care-professional',
    caption: 'Professional cleaning',
    affirmative: true
  },
  { key: 'rotate', pattern: /\brotat|turn\s*180/gi, icon: 'care-rotate', caption: 'Rotate the rug', affirmative: true },
  {
    key: 'avoid-sun',
    pattern: /(?:avoid|away from|out of|protect(?:ed)? from|keep from)[^.;]{0,25}sun/gi,
    icon: 'care-avoid-sun',
    caption: 'Avoid direct sun'
  },
  {
    key: 'rug-pad',
    pattern: /rug[\s-]?pad|\b(?:cushion(?:ed)?|non[\s-]?slip|anti[\s-]?slip)\s+pad\b/gi,
    icon: 'care-rug-pad',
    caption: 'Use a rug pad',
    affirmative: true
  },
  {
    key: 'no-machine-wash',
    pattern: /(?:no|not|never|don['\u2019]?t)[^.;]{0,15}machine[\s-]?wash/gi,
    icon: 'care-no-machine-wash',
    caption: 'No machine wash'
  },
  { key: 'shake', pattern: /\bshake/gi, icon: 'care-shake', caption: 'Shake out dirt', affirmative: true },
  {
    key: 'dry-naturally',
    pattern: /air[\s-]?dr(?:y|ied)|dry naturally|dry flat|dry thoroughly/gi,
    icon: 'care-dry-naturally',
    caption: 'Dry naturally',
    affirmative: true
  },
  {
    // "soak up spills" is advice to absorb a spill, not to soak the rug.
    key: 'avoid-water',
    pattern: /moisture|saturat|\bsoak(?![\s-]*up)|(?:\bno|\bnot|never|don['\u2019]?t|avoid)[^.;,]{0,15}wet[\s-]?clean/gi,
    icon: 'care-avoid-water',
    caption: 'Avoid excess water'
  }
];

const NEGATION = /\b(?:never|not|no|avoid(?:ing)?|don['\u2019]?t|doesn['\u2019]?t)\b/i;

/** A negation placed after the keyword: "Dry cleaning is not recommended." */
const NEGATED_AFTER =
  /\bnot\s+(?:recommended|advised|necessary|needed|required|suitable)|should\s+be\s+avoided|must\s+be\s+avoided/i;

/**
 * True when the keyword match at `index` is negated in its sentence: earlier
 * in the clause (commas do not end it, so "Do not, under any circumstances,
 * shake" counts), or later in the same sentence ("... is not recommended").
 * Over-suppression fails safe because every instruction line is printed.
 */
function isNegated(text: string, index: number, length: number): boolean {
  const before = text.slice(Math.max(0, index - 60), index);
  const clause = before.split(/[.;:!?]/).pop() ?? '';
  if (NEGATION.test(clause)) return true;
  const after = text.slice(index + length).split(/[.;!?]/)[0];
  return NEGATED_AFTER.test(after);
}

function matchesRule(rule: (typeof CARE_RULES)[number], text: string): boolean {
  for (const match of text.matchAll(rule.pattern)) {
    if (!rule.affirmative || !isNegated(text, match.index ?? 0, match[0].length)) return true;
  }
  return false;
}

/**
 * Splits sukla.care_instructions into lines and maps each to care icons.
 * Every line is kept (unmatched lines have no keys), so no text is lost; only
 * a "Care Instructions:" header and list numbering are dropped.
 */
export function parseCareInstructions(raw?: string): CareGuide {
  const lines: CareLine[] = [];
  for (const rawLine of raw?.split(/\r?\n/) ?? []) {
    const trimmed = rawLine.trim();
    if (!trimmed || /^care(?:\s+instructions?)?\s*:?$/i.test(trimmed)) continue;
    const line = trimmed.replace(/^(?:\d+\s*[.)]|[-•*\u2013])\s*/, '');
    if (!line) continue;

    const labelled = line.match(/^([^:]{2,40}):\s+(.+)$/);
    const isLabel = labelled && labelled[1].trim().split(/\s+/).length <= 5;
    const label = isLabel ? labelled[1].trim() : undefined;
    const text = isLabel ? labelled[2].trim() : line;

    // The label is its own clause, so a negation in the text never reaches it.
    const haystack = label ? `${label}. ${text}` : text;
    const keys = CARE_RULES.filter((rule) => matchesRule(rule, haystack)).map((rule) => rule.key);
    lines.push({ ...(label ? { label } : {}), text, keys });
  }

  const icons: CareGuide['icons'] = [];
  const seen = new Set<CareKey>();
  for (const line of lines) {
    for (const key of line.keys) {
      if (seen.has(key)) continue;
      seen.add(key);
      const rule = CARE_RULES.find((r) => r.key === key);
      if (rule) icons.push({ key, caption: rule.caption, icon: rule.icon });
    }
  }

  return { icons, lines };
}
