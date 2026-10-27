'use client';

import React, { useId, useRef, useState } from 'react';
import { ChevronDown, MessageCircle, SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { parseMetafieldValues } from '@/lib/shop-filters';
import { whatsappUrl } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics';
import {
  CUSTOM_RUG_PRICING,
  SHAPE_LABELS,
  SHAPE_ORDER,
  UNIT_LABELS,
  buildQuoteMessage,
  calculateCustomPrice,
  convertFields,
  emptyDimension,
  formatArea,
  formatFeet,
  formatUsd,
  getFieldLabels,
  getPreviewDimensions,
  getPricingCategory,
  type CalculatorInput,
  type CalculatorShape,
  type CalculatorUnit,
  type CustomPriceResult,
  type DimensionFields,
  type FieldErrors,
  type PricingCategory
} from '@/lib/custom-rug-pricing';

// Same classes as <Button variant="terracotta" size="md" fullWidth>, for the external WhatsApp link
// (Button's href renders next/link, which is meant for internal routes).
const TERRACOTTA_LINK_CLASSES =
  'inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)] px-7 py-3.5 bg-[var(--sukla-terracotta)] text-white hover:bg-[var(--sukla-terracotta-dark)] w-full';

const FIELD_CLASSES =
  'w-full min-h-[2.75rem] border border-[var(--sukla-muted-border)] bg-[var(--sukla-ivory)] px-3 py-2 text-sm font-sans nums text-[var(--sukla-charcoal)] focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)] aria-[invalid=true]:border-rose-700';

const INCHES_ERROR_PREFIX = 'Inches';

type Side = 'width' | 'length';

interface CalculatedState {
  result: CustomPriceResult;
  pageUrl: string;
}

/**
 * "Customise" button and inline panel under the PDP size options. Renders
 * nothing unless the product's construction maps to a priced category.
 */
export const CustomSizeCalculator: React.FC<{ product: Product }> = ({ product }) => {
  const category = getPricingCategory(product.metafields);
  if (!category) return null;
  return <CalculatorPanel product={product} category={category} />;
};

const CalculatorPanel: React.FC<{ product: Product; category: PricingCategory }> = ({ product, category }) => {
  const pricing = CUSTOM_RUG_PRICING[category];
  const isRunner = parseMetafieldValues(product.metafields.rug_format).some((value) => /runner/i.test(value));

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<CalculatorInput>({
    unit: 'ft',
    shape: isRunner ? 'runner' : 'rectangle',
    width: emptyDimension(),
    length: emptyDimension()
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [calculated, setCalculated] = useState<CalculatedState | null>(null);

  const { format } = useCurrency();
  const baseId = useId();
  const toggleId = `${baseId}-toggle`;
  const panelId = `${baseId}-panel`;
  const quoteHelpId = `${baseId}-quote-help`;

  const mainRefs = {
    width: useRef<HTMLInputElement>(null),
    length: useRef<HTMLInputElement>(null)
  };
  const inchRefs = {
    width: useRef<HTMLInputElement>(null),
    length: useRef<HTMLInputElement>(null)
  };

  const labels = getFieldLabels(input.shape);
  const sides: Side[] = labels.length ? ['width', 'length'] : ['width'];
  const preview = getPreviewDimensions(input);

  // Any change clears the result, so a stale price can never be sent.
  const resetResult = () => {
    setCalculated(null);
    setErrors({});
  };

  const handleUnitChange = (unit: CalculatorUnit) => {
    setInput((prev) => ({
      ...prev,
      unit,
      width: convertFields(prev.width, prev.unit, unit),
      length: convertFields(prev.length, prev.unit, unit)
    }));
    resetResult();
  };

  const handleShapeChange = (shape: CalculatorShape) => {
    setInput((prev) => ({ ...prev, shape }));
    resetResult();
  };

  const handleFieldChange = (side: Side, key: keyof DimensionFields, value: string) => {
    setInput((prev) => ({ ...prev, [side]: { ...prev[side], [key]: value } }));
    resetResult();
  };

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const outcome = calculateCustomPrice(category, input);
    if (!outcome.ok) {
      setErrors(outcome.errors);
      setCalculated(null);
      const side: Side = outcome.errors.width ? 'width' : 'length';
      const useInches = input.unit === 'ft' && outcome.errors[side]?.startsWith(INCHES_ERROR_PREFIX);
      (useInches ? inchRefs[side] : mainRefs[side]).current?.focus();
      return;
    }
    setErrors({});
    setCalculated({ result: outcome.result, pageUrl: window.location.origin + window.location.pathname });
  };

  const result = calculated?.result;
  const local = result ? format(result.priceUsd, 'USD') : null;
  const localEstimate = local?.approximate ? local.text : undefined;
  const quoteHref =
    calculated && result
      ? whatsappUrl(
          buildQuoteMessage({ productTitle: product.title, pageUrl: calculated.pageUrl, result, localEstimate })
        )
      : null;

  const renderSide = (side: Side) => {
    const label = side === 'width' ? labels.width : (labels.length ?? '');
    const error = errors[side];
    const errorId = `${baseId}-${side}-error`;
    const fieldId = `${baseId}-${side}`;
    const invalidProps = error ? { 'aria-invalid': true as const, 'aria-describedby': errorId } : {};
    const fields = input[side];

    return (
      <fieldset key={side} className="space-y-1.5 min-w-0">
        <legend className="eyebrow text-xs text-[var(--sukla-charcoal)] mb-1.5">{label}</legend>
        {input.unit === 'ft' ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                ref={mainRefs[side]}
                id={`${fieldId}-ft`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={fields.feet}
                onChange={(event) => handleFieldChange(side, 'feet', event.target.value)}
                className={`${FIELD_CLASSES} pr-9`}
                {...invalidProps}
              />
              <label
                htmlFor={`${fieldId}-ft`}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-[var(--sukla-charcoal)]/70"
              >
                <span className="sr-only">{label} </span>ft
              </label>
            </div>
            <div className="relative">
              <input
                ref={inchRefs[side]}
                id={`${fieldId}-in`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={fields.inches}
                onChange={(event) => handleFieldChange(side, 'inches', event.target.value)}
                className={`${FIELD_CLASSES} pr-9`}
                {...invalidProps}
              />
              <label
                htmlFor={`${fieldId}-in`}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-[var(--sukla-charcoal)]/70"
              >
                <span className="sr-only">{label} </span>in
              </label>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              ref={mainRefs[side]}
              id={`${fieldId}-cm`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={fields.cm}
              onChange={(event) => handleFieldChange(side, 'cm', event.target.value)}
              className={`${FIELD_CLASSES} pr-10`}
              {...invalidProps}
            />
            <label
              htmlFor={`${fieldId}-cm`}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-[var(--sukla-charcoal)]/70"
            >
              <span className="sr-only">{label} </span>cm
            </label>
          </div>
        )}
        {error && (
          <p id={errorId} className="text-xs font-sans text-rose-800">
            {error}
          </p>
        )}
      </fieldset>
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Button
          id={toggleId}
          type="button"
          variant="outline"
          fullWidth
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          Customise
          <ChevronDown
            className={`w-4 h-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </Button>
        <p className="text-xs font-sans text-[var(--sukla-charcoal)]/70">
          Need another size? Get an instant estimate.
        </p>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={toggleId}
        hidden={!open}
        className="border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="eyebrow text-xs text-[var(--sukla-charcoal)]">Custom size · {pricing.label}</span>
          <span className="nums text-xs font-sans text-[var(--sukla-charcoal)]/70">
            {formatUsd(pricing.ratePerSqFt)} per sq ft
          </span>
        </div>

        <form noValidate onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor={`${baseId}-unit`} className="eyebrow text-xs text-[var(--sukla-charcoal)] block">
                Unit
              </label>
              <select
                id={`${baseId}-unit`}
                value={input.unit}
                onChange={(event) => handleUnitChange(event.target.value as CalculatorUnit)}
                className={FIELD_CLASSES}
              >
                {(Object.keys(UNIT_LABELS) as CalculatorUnit[]).map((unit) => (
                  <option key={unit} value={unit}>
                    {UNIT_LABELS[unit]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${baseId}-shape`} className="eyebrow text-xs text-[var(--sukla-charcoal)] block">
                Shape
              </label>
              <select
                id={`${baseId}-shape`}
                value={input.shape}
                onChange={(event) => handleShapeChange(event.target.value as CalculatorShape)}
                className={FIELD_CLASSES}
              >
                {SHAPE_ORDER.map((shape) => (
                  <option key={shape} value={shape}>
                    {SHAPE_LABELS[shape]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-[1fr_9rem] sm:gap-4 sm:items-center">
            <div className="space-y-3 min-w-0">{sides.map(renderSide)}</div>
            <SizePreview shape={input.shape} widthFt={preview.widthFt} lengthFt={preview.lengthFt} />
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Calculate
          </Button>
        </form>

        <div role="status" aria-live="polite" className="empty:hidden">
          {result && (
            <div className="border-t border-[var(--sukla-muted-border)] pt-4 space-y-1.5">
              <span className="eyebrow text-xs text-[var(--sukla-charcoal)] block">Estimated price</span>
              <p className="nums text-2xl font-medium text-[var(--sukla-charcoal)]">{formatUsd(result.priceUsd)}</p>
              {localEstimate && (
                <p className="nums text-sm font-sans text-[var(--sukla-charcoal)]/70">{localEstimate}</p>
              )}
              <p className="nums text-sm font-sans text-[var(--sukla-charcoal)]/80">
                {result.shape === 'round'
                  ? `${formatFeet(result.widthFt)} ft diameter · priced on ${formatArea(result.areaSqFt)} sq ft`
                  : `${formatFeet(result.widthFt)} × ${formatFeet(result.lengthFt)} ft · ${formatArea(result.areaSqFt)} sq ft`}
                {result.isStandardSize && (
                  <span className="ml-2 inline-block border border-[var(--sukla-muted-border)] bg-[var(--sukla-ivory)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] align-middle">
                    Standard size
                  </span>
                )}
              </p>
              <p className="text-sm font-sans text-[var(--sukla-charcoal)]/80">Lead time: {result.leadTime}</p>
              <p className="text-xs font-sans text-[var(--sukla-charcoal)]/70">
                Estimate only. Our team confirms the final price and lead time on WhatsApp.
              </p>
            </div>
          )}
        </div>

        {quoteHref && result ? (
          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className={TERRACOTTA_LINK_CLASSES}
            onClick={() =>
              trackEvent('custom_quote_request', {
                productId: product.id,
                category,
                shape: result.shape,
                widthFt: result.widthFt,
                lengthFt: result.lengthFt,
                areaSqFt: result.areaSqFt,
                priceUsd: result.priceUsd,
                isStandardSize: result.isStandardSize
              })
            }
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Get a Quote
            <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
          </a>
        ) : (
          <div className="space-y-1.5">
            <Button type="button" variant="terracotta" fullWidth disabled aria-describedby={quoteHelpId} className="gap-2">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Get a Quote
            </Button>
            <p id={quoteHelpId} className="text-xs font-sans text-[var(--sukla-charcoal)]/70">
              Calculate a price to request a quote.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PREVIEW_CENTER_X = 90;
const PREVIEW_CENTER_Y = 76;
const PREVIEW_MAX_W = 110;
const PREVIEW_MAX_H = 100;
const MIN_SIDE_RATIO = 0.15;

/** Outline whose proportions follow the entered shape and size. */
const SizePreview: React.FC<{ shape: CalculatorShape; widthFt: number; lengthFt: number }> = ({
  shape,
  widthFt,
  lengthFt
}) => {
  const isSingle = shape === 'square' || shape === 'round';
  const label = isSingle
    ? `Preview: ${SHAPE_LABELS[shape].toLowerCase()}, ${formatFeet(widthFt)} ft ${shape === 'round' ? 'diameter' : 'sides'}`
    : `Preview: ${SHAPE_LABELS[shape].toLowerCase()}, ${formatFeet(widthFt)} by ${formatFeet(lengthFt)} ft`;
  const textProps = {
    fill: 'var(--sukla-charcoal)',
    fontSize: 10,
    fontFamily: 'inherit',
    textAnchor: 'middle' as const
  };

  if (shape === 'round') {
    const r = PREVIEW_MAX_H / 2;
    return (
      <svg viewBox="0 0 160 140" role="img" aria-label={label} className="w-full max-w-[9rem] mx-auto h-auto">
        <text x={PREVIEW_CENTER_X} y={PREVIEW_CENTER_Y - r - 6} {...textProps}>
          Diameter
        </text>
        <circle
          cx={PREVIEW_CENTER_X}
          cy={PREVIEW_CENTER_Y}
          r={r}
          fill="var(--sukla-sand)"
          stroke="var(--sukla-charcoal)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={PREVIEW_CENTER_X - r}
          y1={PREVIEW_CENTER_Y}
          x2={PREVIEW_CENTER_X + r}
          y2={PREVIEW_CENTER_Y}
          stroke="var(--sukla-charcoal)"
          strokeWidth={1}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  const scale = Math.min(PREVIEW_MAX_W / widthFt, PREVIEW_MAX_H / lengthFt);
  let boxW = widthFt * scale;
  let boxH = lengthFt * scale;
  if (boxW < boxH * MIN_SIDE_RATIO) boxW = boxH * MIN_SIDE_RATIO;
  if (boxH < boxW * MIN_SIDE_RATIO) boxH = boxW * MIN_SIDE_RATIO;
  const x = PREVIEW_CENTER_X - boxW / 2;
  const y = PREVIEW_CENTER_Y - boxH / 2;

  return (
    <svg viewBox="0 0 160 140" role="img" aria-label={label} className="w-full max-w-[9rem] mx-auto h-auto">
      <text x={PREVIEW_CENTER_X} y={y - 6} {...textProps}>
        {isSingle ? 'Size' : 'Width'}
      </text>
      {!isSingle && (
        <text
          x={x - 8}
          y={PREVIEW_CENTER_Y}
          transform={`rotate(-90 ${x - 8} ${PREVIEW_CENTER_Y})`}
          {...textProps}
        >
          Length
        </text>
      )}
      <rect
        x={x}
        y={y}
        width={boxW}
        height={boxH}
        fill="var(--sukla-sand)"
        stroke="var(--sukla-charcoal)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
