/**
 * Custom-size rug pricing for the product page "Customise" calculator.
 *
 * Prices are USD estimates owned in website code (owner decision, 2026-10-29),
 * not Shopify products: custom sizes are quoted on WhatsApp and never sold
 * through the Shopify cart. The team confirms the final price and lead time.
 *
 * Rule: a size that matches a standard size in the construction's Area or
 * Runner table uses the exact table price, whichever of Rectangle, Runner or
 * Square is selected. Any other size is area in sq ft × that construction's
 * rate, rounded to the nearest dollar.
 *
 * Pure module (no React, no `window`), erasable TypeScript only, so it can be
 * unit-tested under Node type stripping.
 */

import { parseMetafieldValues } from '@/lib/shop-filters';
import type { ProductMetafields } from '@/types';

export type PricingCategory = 'hand-knotted' | 'hand-tufted' | 'jute-flatweave' | 'hand-loom';
export type CalculatorShape = 'rectangle' | 'runner' | 'square' | 'round';
export type CalculatorUnit = 'ft' | 'cm';

/** A standard size, width × length in feet, with its table price in USD. */
export interface StandardSize {
  widthFt: number;
  lengthFt: number;
  priceUsd: number;
}

export interface CategoryPricing {
  label: string;
  ratePerSqFt: number;
  leadTime: string;
  area: readonly StandardSize[];
  runner: readonly StandardSize[];
}

const size = (widthFt: number, lengthFt: number, priceUsd: number): StandardSize => ({
  widthFt,
  lengthFt,
  priceUsd
});

/**
 * The owner's size-wise price chart, copied exactly (48 entries). The owner
 * asked for the chart to be followed exactly (2026-10-29).
 *
 * Three chart prices differ from area × rate (the chart price wins for a
 * standard size):
 * - Hand Loom, Area 5 × 8 ft: $439 (40 sq ft × $10 = $400)
 * - Hand Loom, Area 8 × 10 ft: $879 (80 sq ft × $10 = $800)
 * - Hand Knotted, Runner 2.5 × 8 ft: $230 (20 sq ft × $12 = $240)
 *
 * Lead times are the agreed defaults shown with every estimate; change them here.
 */
export const CUSTOM_RUG_PRICING: Record<PricingCategory, CategoryPricing> = {
  'hand-knotted': {
    label: 'Hand Knotted',
    ratePerSqFt: 12,
    leadTime: '6\u201312 weeks',
    area: [size(4, 6, 289), size(5, 8, 479), size(6, 9, 649), size(8, 10, 959), size(9, 12, 1299), size(10, 14, 1689)],
    runner: [
      size(2, 6, 149),
      size(2.5, 7, 209),
      size(2.5, 8, 230), // Chart price; area × rate would be $240.
      size(2.5, 10, 299),
      size(2.5, 12, 359),
      size(3, 10, 359)
    ]
  },
  'hand-tufted': {
    label: 'Hand Tufted',
    ratePerSqFt: 8,
    leadTime: '6\u201312 weeks',
    area: [size(4, 6, 199), size(5, 8, 329), size(6, 9, 439), size(8, 10, 649), size(9, 12, 869), size(10, 14, 1129)],
    runner: [size(2, 6, 99), size(2.5, 7, 139), size(2.5, 8, 160), size(2.5, 10, 200), size(2.5, 12, 240), size(3, 10, 240)]
  },
  'jute-flatweave': {
    label: 'Jute / Flat Weave',
    ratePerSqFt: 6,
    leadTime: '6\u201312 weeks',
    area: [size(4, 6, 144), size(5, 8, 240), size(6, 9, 324), size(8, 10, 480), size(9, 12, 648), size(10, 14, 840)],
    runner: [size(2, 6, 72), size(2.5, 7, 105), size(2.5, 8, 120), size(2.5, 10, 150), size(2.5, 12, 180), size(3, 10, 180)]
  },
  'hand-loom': {
    label: 'Hand Loom',
    ratePerSqFt: 10,
    leadTime: '6\u201312 weeks',
    area: [
      size(4, 6, 239),
      size(5, 8, 439), // Chart price; area × rate would be $400.
      size(6, 9, 539),
      size(8, 10, 879), // Chart price; area × rate would be $800.
      size(9, 12, 1089),
      size(10, 14, 1399)
    ],
    runner: [size(2, 6, 120), size(2.5, 7, 175), size(2.5, 8, 199), size(2.5, 10, 249), size(2.5, 12, 299), size(3, 10, 299)]
  }
};

export const SHAPE_LABELS: Record<CalculatorShape, string> = {
  rectangle: 'Rectangle',
  runner: 'Runner',
  square: 'Square',
  round: 'Round'
};

export const SHAPE_ORDER: readonly CalculatorShape[] = ['rectangle', 'runner', 'square', 'round'];

export const UNIT_LABELS: Record<CalculatorUnit, string> = {
  ft: 'Feet (ft)',
  cm: 'Centimetres (cm)'
};

export const MIN_SIDE_FT = 2;
export const MAX_SIDE_FT = 20;
export const RUNNER_MAX_WIDTH_FT = 4;
export const CM_PER_FT = 30.48;

/** About 0.5 cm, so whole-cm entries (152 cm for 5 ft) still match; 1 inch (0.083 ft) never collides. */
const MATCH_TOLERANCE_FT = 0.017;
/** Lets the cm bounds (61–610 cm, runner width up to 122 cm) line up with the ft bounds. */
const BOUND_TOLERANCE_FT = 0.02;

// ---------------------------------------------------------------------------
// Category mapping
// ---------------------------------------------------------------------------

const MACHINE_PATTERN = /machine|power[\s_-]?loom/i;

// Order matters: flat weave is checked before hand loom so "Hand Woven Kilim"
// prices as flat weave (same order as the infographics construction parser).
const CATEGORY_RULES: readonly [PricingCategory, RegExp][] = [
  ['hand-knotted', /hand[\s_-]?knot/i],
  ['hand-tufted', /hand[\s_-]?tuft/i],
  ['jute-flatweave', /\bjute\b|flat[\s_-]?(?:weave|woven)|kilim|dhurr?ie|durrie|soumak/i],
  ['hand-loom', /hand[\s_-]?(?:woven|loom)/i]
];

/**
 * Maps a product to a priced category from `sukla.construction` (fallback
 * `sukla.technique`). Returns null, so the calculator is hidden, for machine
 * or power-loom values, bare ambiguous values ("Woven", "Tufted", "Braided")
 * and products with no value.
 *
 * Material fallback: only when construction and technique are both empty, a
 * jute material maps to Jute / Flat Weave (jute rugs are flat or braided weaves
 * and WhatsApp confirms the final price). An explicit construction that does
 * not map is a deliberate store value and is never overridden by material.
 */
export function getPricingCategory(m: ProductMetafields): PricingCategory | null {
  const construction = parseMetafieldValues(m.construction);
  const values = construction.length > 0 ? construction : parseMetafieldValues(m.technique);

  if (values.length === 0) {
    return parseMetafieldValues(m.material).some((value) => /\bjute\b/i.test(value))
      ? 'jute-flatweave'
      : null;
  }

  if (values.some((value) => MACHINE_PATTERN.test(value))) return null;

  for (const value of values) {
    for (const [category, pattern] of CATEGORY_RULES) {
      if (pattern.test(value)) return category;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Input parsing and validation
// ---------------------------------------------------------------------------

/** Raw text of one dimension. ft mode uses feet + inches, cm mode uses cm. */
export interface DimensionFields {
  feet: string;
  inches: string;
  cm: string;
}

export interface CalculatorInput {
  unit: CalculatorUnit;
  shape: CalculatorShape;
  /** Width, or the single Size / Diameter for square and round. */
  width: DimensionFields;
  /** Ignored for square and round. */
  length: DimensionFields;
}

export interface FieldErrors {
  width?: string;
  length?: string;
}

export interface CustomPriceResult {
  category: PricingCategory;
  categoryLabel: string;
  shape: CalculatorShape;
  shapeLabel: string;
  /** Square and round: both equal the side / diameter. */
  widthFt: number;
  lengthFt: number;
  /** widthFt × lengthFt (round: diameter²), unrounded. */
  areaSqFt: number;
  ratePerSqFt: number;
  /** Whole dollars. */
  priceUsd: number;
  isStandardSize: boolean;
  /** The size as typed, e.g. "5 ft 6 in × 8 ft". */
  sizeLabel: string;
  leadTime: string;
}

export type CalculationOutcome = { ok: true; result: CustomPriceResult } | { ok: false; errors: FieldErrors };

export type ParsedDimension = { ok: true; feet: number } | { ok: false; reason: 'empty' | 'number' | 'inches' };

const FEET_PATTERN = /^\d+(\.\d{1,2})?$/;
const INCHES_PATTERN = /^\d{1,2}$/;
const CM_PATTERN = /^\d+(\.\d{1,2})?$/;

export function getFieldLabels(shape: CalculatorShape): { width: string; length: string | null } {
  if (shape === 'square') return { width: 'Size', length: null };
  if (shape === 'round') return { width: 'Diameter', length: null };
  return { width: 'Width', length: 'Length' };
}

export function emptyDimension(): DimensionFields {
  return { feet: '', inches: '', cm: '' };
}

/** Parses one dimension into feet. */
export function parseDimension(fields: DimensionFields, unit: CalculatorUnit): ParsedDimension {
  if (unit === 'cm') {
    const cm = fields.cm.trim();
    if (!cm) return { ok: false, reason: 'empty' };
    if (!CM_PATTERN.test(cm)) return { ok: false, reason: 'number' };
    return { ok: true, feet: parseFloat(cm) / CM_PER_FT };
  }

  const feet = fields.feet.trim();
  const inches = fields.inches.trim();
  if (!feet && !inches) return { ok: false, reason: 'empty' };
  if (feet && !FEET_PATTERN.test(feet)) return { ok: false, reason: 'number' };

  let inchValue = 0;
  if (inches) {
    if (!INCHES_PATTERN.test(inches)) return { ok: false, reason: 'inches' };
    inchValue = parseInt(inches, 10);
    if (inchValue > 11) return { ok: false, reason: 'inches' };
  }
  return { ok: true, feet: (feet ? parseFloat(feet) : 0) + inchValue / 12 };
}

function isClose(a: number, b: number): boolean {
  return Math.abs(a - b) <= MATCH_TOLERANCE_FT;
}

/**
 * Finds the standard size for the entered feet. Identical dimensions always
 * quote the same price, so rectangle, runner and square check both the Area
 * and the Runner table of the construction, in either orientation (a 2 × 6 ft
 * Rectangle gets the 2 × 6 runner price). The two tables share no size, so
 * the result is unambiguous. Round never matches.
 */
export function findStandardSize(
  category: PricingCategory,
  shape: CalculatorShape,
  widthFt: number,
  lengthFt: number
): StandardSize | null {
  if (shape === 'round') return null;
  const pricing = CUSTOM_RUG_PRICING[category];
  return (
    [...pricing.area, ...pricing.runner].find(
      (entry) =>
        (isClose(entry.widthFt, widthFt) && isClose(entry.lengthFt, lengthFt)) ||
        (isClose(entry.widthFt, lengthFt) && isClose(entry.lengthFt, widthFt))
    ) ?? null
  );
}

function parseError(reason: 'empty' | 'number' | 'inches', label: string): string {
  if (reason === 'inches') return 'Inches must be a whole number from 0 to 11.';
  if (reason === 'number') return `Enter the ${label.toLowerCase()} as a number.`;
  return `Enter the ${label.toLowerCase()}.`;
}

function rangeError(label: string, unit: CalculatorUnit): string {
  return unit === 'cm'
    ? `${label} must be between 61 and 610 cm.`
    : `${label} must be between ${MIN_SIDE_FT} and ${MAX_SIDE_FT} ft.`;
}

function inRange(feet: number): boolean {
  return feet >= MIN_SIDE_FT - BOUND_TOLERANCE_FT && feet <= MAX_SIDE_FT + BOUND_TOLERANCE_FT;
}

/** Validates the input and prices it, or returns an error per field. */
export function calculateCustomPrice(category: PricingCategory, input: CalculatorInput): CalculationOutcome {
  const labels = getFieldLabels(input.shape);
  const singleSide = labels.length === null;
  const errors: FieldErrors = {};

  const width = parseDimension(input.width, input.unit);
  const length = singleSide ? width : parseDimension(input.length, input.unit);

  let widthFt = 0;
  let lengthFt = 0;

  if (!width.ok) errors.width = parseError(width.reason, labels.width);
  else if (!inRange(width.feet)) errors.width = rangeError(labels.width, input.unit);
  else widthFt = width.feet;

  if (!singleSide && labels.length) {
    if (!length.ok) errors.length = parseError(length.reason, labels.length);
    else if (!inRange(length.feet)) errors.length = rangeError(labels.length, input.unit);
    else lengthFt = length.feet;
  } else {
    lengthFt = widthFt;
  }

  if (input.shape === 'runner') {
    if (!errors.width && widthFt > RUNNER_MAX_WIDTH_FT + BOUND_TOLERANCE_FT) {
      errors.width =
        input.unit === 'cm'
          ? "A runner's width must be between 61 and 122 cm."
          : `A runner's width must be between ${MIN_SIDE_FT} and ${RUNNER_MAX_WIDTH_FT} ft.`;
    }
    if (!errors.width && !errors.length && lengthFt < 2 * widthFt - BOUND_TOLERANCE_FT) {
      errors.length = "A runner's length must be at least twice its width.";
    }
  }

  if (errors.width || errors.length) return { ok: false, errors };

  const pricing = CUSTOM_RUG_PRICING[category];
  const areaSqFt = widthFt * lengthFt;
  const standard = findStandardSize(category, input.shape, widthFt, lengthFt);
  const widthText = formatTypedDimension(input.width, input.unit);
  const sizeLabel =
    input.shape === 'round'
      ? `${widthText} diameter`
      : `${widthText} \u00d7 ${singleSide ? widthText : formatTypedDimension(input.length, input.unit)}`;

  return {
    ok: true,
    result: {
      category,
      categoryLabel: pricing.label,
      shape: input.shape,
      shapeLabel: SHAPE_LABELS[input.shape],
      widthFt,
      lengthFt,
      areaSqFt,
      ratePerSqFt: pricing.ratePerSqFt,
      priceUsd: standard ? standard.priceUsd : Math.round(areaSqFt * pricing.ratePerSqFt),
      isStandardSize: Boolean(standard),
      sizeLabel,
      leadTime: pricing.leadTime
    }
  };
}

// ---------------------------------------------------------------------------
// Unit conversion and preview
// ---------------------------------------------------------------------------

function trimNumber(value: number, decimals: number): string {
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}

/**
 * Converts the typed value to the other unit so switching units keeps the
 * size: ft + in → cm (0.1 cm), cm → whole inches split into ft + in.
 * An unparseable source leaves the target fields empty.
 */
export function convertFields(fields: DimensionFields, from: CalculatorUnit, to: CalculatorUnit): DimensionFields {
  if (from === to) return fields;
  const parsed = parseDimension(fields, from);

  if (to === 'cm') {
    return { ...fields, cm: parsed.ok ? trimNumber(parsed.feet * CM_PER_FT, 1) : '' };
  }

  if (!parsed.ok) return { ...fields, feet: '', inches: '' };
  const totalInches = Math.round(parsed.feet * 12);
  const inches = totalInches % 12;
  return { ...fields, feet: String(Math.floor(totalInches / 12)), inches: inches > 0 ? String(inches) : '' };
}

const PREVIEW_DEFAULTS: Record<CalculatorShape, { widthFt: number; lengthFt: number }> = {
  rectangle: { widthFt: 5, lengthFt: 8 },
  runner: { widthFt: 2.5, lengthFt: 8 },
  square: { widthFt: 6, lengthFt: 6 },
  round: { widthFt: 6, lengthFt: 6 }
};

/** Proportions for the preview: the typed size when it parses, else a shape default. */
export function getPreviewDimensions(input: CalculatorInput): { widthFt: number; lengthFt: number } {
  const width = parseDimension(input.width, input.unit);
  if (input.shape === 'square' || input.shape === 'round') {
    return width.ok && width.feet > 0 ? { widthFt: width.feet, lengthFt: width.feet } : PREVIEW_DEFAULTS[input.shape];
  }
  const length = parseDimension(input.length, input.unit);
  return width.ok && length.ok && width.feet > 0 && length.feet > 0
    ? { widthFt: width.feet, lengthFt: length.feet }
    : PREVIEW_DEFAULTS[input.shape];
}

// ---------------------------------------------------------------------------
// Formatting and the WhatsApp message
// ---------------------------------------------------------------------------

/** Feet to at most 2 decimals, trailing zeros dropped: 5.5, 2.5, 6. */
export function formatFeet(value: number): string {
  return trimNumber(value, 2);
}

/** Square feet to at most 2 decimals, trailing zeros dropped. */
export function formatArea(value: number): string {
  return trimNumber(value, 2);
}

const USD_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
});

/** Whole-dollar USD: $1,299. */
export function formatUsd(value: number): string {
  return USD_FORMAT.format(value);
}

/** The dimension as the shopper typed it: "5 ft 6 in", "8 ft", "76.2 cm". */
export function formatTypedDimension(fields: DimensionFields, unit: CalculatorUnit): string {
  if (unit === 'cm') return `${String(parseFloat(fields.cm.trim() || '0'))} cm`;
  const feet = String(parseFloat(fields.feet.trim() || '0'));
  const inches = parseInt(fields.inches.trim() || '0', 10);
  return inches > 0 ? `${feet} ft ${inches} in` : `${feet} ft`;
}

export interface QuoteMessageInput {
  /** Omitted on the home page, where the quote is not for a specific product. */
  productTitle?: string;
  pageUrl: string;
  result: CustomPriceResult;
  /** Local-currency approximation; only when not USD. */
  localEstimate?: string;
}

/** Prewritten WhatsApp text, one item per line. Encode it with `whatsappUrl()`. */
export function buildQuoteMessage({ productTitle, pageUrl, result, localEstimate }: QuoteMessageInput): string {
  const width = formatFeet(result.widthFt);
  const area = formatArea(result.areaSqFt);
  const sizeDetail =
    result.shape === 'round'
      ? `${width} ft, priced on ${width} \u00d7 ${width} ft = ${area} sq ft`
      : `${width} \u00d7 ${formatFeet(result.lengthFt)} ft, ${area} sq ft`;

  return [
    "Hi Sukla Rugs, I'd like a quote for a custom-size rug.",
    ...(productTitle ? [`Product: ${productTitle}`] : []),
    `Link: ${pageUrl}`,
    `Construction: ${result.categoryLabel}`,
    `Shape: ${result.shapeLabel}`,
    `Size: ${result.sizeLabel} (${sizeDetail})`,
    `Estimated price: ${formatUsd(result.priceUsd)}${localEstimate ? ` (${localEstimate})` : ''}`,
    `Lead time: ${result.leadTime}`,
    'Please confirm availability and final price.'
  ].join('\n');
}
