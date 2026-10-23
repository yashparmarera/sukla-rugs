'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  MessageCircle,
  Scissors,
  Maximize2,
  Minus,
  Plus,
  X,
  Check
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import type { StorePolicyLink } from '@/lib/shopify/client';
import { addToLocalCart } from '@/lib/shopify/local-cart';
import { formatMoney } from '@/lib/format-money';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import {
  buildShortDescription,
  extractDescriptionFeatures,
  formatShippingWeight,
  getCollectionFacts,
  getDescriptionIntroForDisplay,
  getDisplayTitle,
  getFacetValues,
  getPlainValues,
  isPlaceholderVariantTitle,
  parseListedSize,
  type FactValue
} from '@/lib/product-display';
import { parseMetafieldValues } from '@/lib/shop-filters';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { TalkToExpert } from '@/components/product/TalkToExpert';
import { trackEvent } from '@/lib/analytics';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  /** Real store policies (shipping, refund). Omitted entries are simply not shown. */
  policies?: StorePolicyLink[];
  /** Set when Shopify can sell this product elsewhere but not in the shopper's country. */
  unavailableRegion?: string;
}

const MAX_QUANTITY = 10;
const SWIPE_THRESHOLD_PX = 50;

/**
 * Moves focus into a modal when it opens, keeps Tab inside it, and returns
 * focus to the element that opened it when it closes.
 */
function useDialogFocus(isOpen: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, containerRef]);
}

// Full class strings so Tailwind can detect them. The grid adapts to the
// actual number of related products instead of leaving empty columns.
const RELATED_GRID_CLASSES: Record<number, string> = {
  1: 'grid-cols-1 max-w-xs mx-auto',
  2: 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
};

interface DetailSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, defaultOpen = false, children }) => (
  <details open={defaultOpen} className="group border-b border-[var(--sukla-muted-border)]">
    <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
      <span className="heading text-base text-[var(--sukla-charcoal)]">{title}</span>
      <ChevronDown className="w-4 h-4 text-[var(--sukla-taupe)] transition-transform group-open:rotate-180" />
    </summary>
    <div className="pb-5 text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80">{children}</div>
  </details>
);

/** Plain text as a single fact value; empty text gives no value. */
function text(value: string | undefined): FactValue[] {
  const label = value?.trim();
  return label ? [{ label }] : [];
}

/** Values joined by ", ". Values with a real target are links; the link style adds no size or weight. */
const FactValues: React.FC<{ values: FactValue[] }> = ({ values }) => (
  <>
    {values.map((value, index) => (
      <React.Fragment key={`${value.label}-${index}`}>
        {index > 0 && ', '}
        {value.href ? (
          <Link
            href={value.href}
            className="text-[var(--sukla-terracotta)] hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]"
          >
            {value.label}
          </Link>
        ) : (
          value.label
        )}
      </React.Fragment>
    ))}
  </>
);

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  policies = [],
  unavailableRegion
}) => {
  // If a product has no variants it cannot be purchased; this placeholder is
  // unavailable so the purchase controls stay disabled.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'unavailable',
      title: '',
      price: product.priceRange.minVariantPrice,
      availableForSale: false,
      selectedOptions: []
    }
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const purchaseRowRef = useRef<HTMLDivElement>(null);
  const zoomDialogRef = useRef<HTMLDivElement>(null);
  const sizeDialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useDialogFocus(isFullscreenZoom, zoomDialogRef);
  useDialogFocus(sizeModalOpen, sizeDialogRef);

  const imageCount = product.images.length;
  const currentImage = product.images[activeImageIndex] || product.featuredImage;

  const showImage = (index: number) => {
    if (imageCount === 0) return;
    setActiveImageIndex((index + imageCount) % imageCount);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || imageCount < 2) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    showImage(activeImageIndex + (deltaX < 0 ? 1 : -1));
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);

    // Only follow a variant's own photo. Variants without one fall back to the
    // featured image in the data layer, and jumping there would be misleading.
    const variantImageUrl = variant.image?.url;
    if (!variantImageUrl || variantImageUrl === product.featuredImage.url) return;

    const index = product.images.findIndex((img) => img.url === variantImageUrl);
    if (index !== -1) setActiveImageIndex(index);
  };

  useEffect(() => {
    trackEvent('product_view', {
      productId: product.id,
      productTitle: product.title,
      collection: product.collection.title
    });
  }, [product]);

  // Show the mobile sticky bar only once the main purchase row has scrolled
  // out of view, so there is never a duplicate Add to cart on screen.
  useEffect(() => {
    const target = purchaseRowRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isFullscreenZoom && !sizeModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreenZoom(false);
        setSizeModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenZoom, sizeModalOpen]);

  const isAvailable = selectedVariant.availableForSale;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToLocalCart(product, selectedVariant.id, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
    trackEvent('add_to_cart', {
      productId: product.id,
      variantId: selectedVariant.id,
      price: selectedVariant.price.amount,
      quantity
    });
  };

  const { display: displayTitle, isShortened } = getDisplayTitle(product.title);

  const { format } = useCurrency();
  const priceDisplay = format(selectedVariant.price.amount, selectedVariant.price.currencyCode);
  const formattedPrice = priceDisplay.text;
  // The exact amount Shopify will charge, shown whenever the price above is an estimate.
  const exactPrice = formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode);
  const compareAt = selectedVariant.compareAtPrice;
  const hasCompareAt = Boolean(
    compareAt && parseFloat(compareAt.amount) > parseFloat(selectedVariant.price.amount)
  );

  // Variant presentation rules
  const hasMultipleVariants = product.variants.length > 1;
  const singleVariantLabel =
    !hasMultipleVariants && !isPlaceholderVariantTitle(product.variants[0]?.title)
      ? product.variants[0].title
      : null;
  const optionLabel = product.options.find((o) => o.name.toLowerCase() !== 'title')?.name ?? 'Size';
  const variantPricesDiffer = new Set(product.variants.map((v) => v.price.amount)).size > 1;

  // Only real store values are shown. Missing rows are omitted.
  const m = product.metafields;
  const eyebrow =
    [parseMetafieldValues(m.construction || m.technique).join(', '), m.origin_region]
      .filter(Boolean)
      .join(' • ') ||
    (product.collection.handle ? product.collection.title : '') ||
    product.productType ||
    '';

  // Classification values link to the matching /shop filter only when the Shop menu has it.
  const specRows = (
    [
      ['Construction', getFacetValues('construction', m.construction || m.technique)],
      ['Material', getFacetValues('material', m.material)],
      ['Style', getFacetValues('style', m.style)],
      ['Shape', getPlainValues(m.shape)],
      ['Format', getPlainValues(m.rug_format)],
      ['Suitable rooms', getFacetValues('room', m.room)],
      ['Colours', getPlainValues(m.palette)],
      ['Color family', text(m.color_family)],
      ['Origin', text(m.origin_region)],
      ['Pile height', text(m.pile_height)],
      ['Weight', text(m.weight)],
      ['Knot density', text(m.knots_per_sq_inch)],
      ['Craft time', text(m.craft_duration)]
    ] as [string, FactValue[]][]
  ).filter(([, values]) => values.length > 0);

  // Real structure from the product's own description, presented as a list.
  const features = extractDescriptionFeatures(product.descriptionHtml, product.description);
  const shortDescription = buildShortDescription({
    override: m.short_description,
    features,
    description: product.description,
    title: product.title
  });
  // Leading paragraph(s) of the description, shown above the feature list.
  const descriptionIntro = getDescriptionIntroForDisplay({
    descriptionHtml: product.descriptionHtml,
    features,
    shortDescription
  });
  const highlightHeadings = features
    .map((f) => f.heading)
    .filter((h): h is string => Boolean(h))
    .slice(0, 3);

  // Facts that exist in the store data. Anything absent is omitted.
  const listedSize = parseListedSize(product.title);
  const sku = selectedVariant.sku || undefined;
  const detailRows = (
    [
      ['Listed size', text(listedSize ?? undefined)],
      ['Product type', text(product.productType)],
      ['SKU', text(sku)],
      ['Collections', getCollectionFacts(product)],
      ['Shipping weight', text(formatShippingWeight(selectedVariant.weight, selectedVariant.weightUnit))]
    ] as [string, FactValue[]][]
  ).filter(([, values]) => values.length > 0);

  const showSizeRow = hasMultipleVariants || Boolean(singleVariantLabel) || Boolean(listedSize);
  const sizeGuideButton = (
    <button
      type="button"
      onClick={() => setSizeModalOpen(true)}
      className="inline-flex items-center gap-1.5 text-xs font-sans text-[var(--sukla-terracotta)] hover:underline"
    >
      <Ruler className="w-3.5 h-3.5" aria-hidden="true" /> Size guide
    </button>
  );

  const hasAboutContent = Boolean(product.description || m.product_story || isShortened);
  const related = relatedProducts.slice(0, 4);
  const totalPrice = format(
    parseFloat(selectedVariant.price.amount) * quantity,
    selectedVariant.price.currencyCode
  ).text;

  return (
    <>
      <div className="editorial-container pt-8 md:pt-12 pb-24 lg:pb-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[var(--sukla-taupe)] mb-8 uppercase tracking-wider"
        >
          <Link href="/" className="hover:text-[var(--sukla-charcoal)]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[var(--sukla-charcoal)]">Shop</Link>
          {product.collection.handle && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/collections/${product.collection.handle}`}
                className="hover:text-[var(--sukla-charcoal)]"
              >
                {product.collection.title}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[var(--sukla-charcoal)]" />
          <span className="text-[var(--sukla-charcoal)] font-semibold truncate">{displayTitle}</span>
        </nav>

        {/* Main PDP Grid: gallery roughly 55%, purchase panel roughly 45% */}
        <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-10 lg:gap-14 items-start">

          {/* Gallery: pinned below the header on desktop while the details scroll past.
              Its height is viewport-based, so it always fits on screen when pinned. */}
          <div className="space-y-3 lg:sticky lg:top-28">
            {/* Height-capped frame with object-contain: the whole rug is always
                visible, so runners and unusual shapes are never cropped. */}
            <div
              className="relative w-full h-[55vh] min-h-[320px] max-h-[620px] bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Inner padding keeps the rug comfortably inset, never cropped */}
              <div className="absolute inset-0 p-5 sm:p-8">
                <div className="relative h-full w-full">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain cursor-zoom-in"
                    onClick={() => setIsFullscreenZoom(true)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreenZoom(true)}
                className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-xs text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-white transition-all shadow-subtle"
                aria-label="View image fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {imageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => showImage(activeImageIndex - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-xs text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showImage(activeImageIndex + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-xs text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span
                    className="nums absolute bottom-4 right-4 text-[11px] font-sans px-2.5 py-1 bg-white/80 text-[var(--sukla-charcoal)]"
                    aria-hidden="true"
                  >
                    {activeImageIndex + 1} / {imageCount}
                  </span>
                </>
              )}

              {product.collection.handle && (
                <span
                  className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] font-sans px-3 py-1 text-white font-semibold"
                  style={{ backgroundColor: product.collection.accentColor }}
                >
                  {product.collection.title}
                </span>
              )}
            </div>

            {/* Compact thumbnails, never cropped */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Product images">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Show image ${idx + 1} of ${product.images.length}`}
                    aria-pressed={activeImageIndex === idx}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-[var(--sukla-cream)] border transition-all overflow-hidden ${
                      activeImageIndex === idx
                        ? 'border-[var(--sukla-charcoal)] ring-1 ring-[var(--sukla-charcoal)]'
                        : 'border-[var(--sukla-muted-border)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-contain" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase panel */}
          <div className="space-y-5">

            <div className="space-y-3 pb-5 border-b border-[var(--sukla-muted-border)]">
              {eyebrow && (
                <span className="eyebrow text-xs text-[var(--sukla-taupe)] block">{eyebrow}</span>
              )}

              <h1
                className="display-lg text-2xl sm:text-3xl text-[var(--sukla-charcoal)] line-clamp-3"
                title={isShortened ? product.title : undefined}
              >
                {displayTitle}
              </h1>

              {shortDescription && (
                <p className="font-sans text-sm text-[var(--sukla-charcoal)]/70 leading-relaxed max-w-prose">
                  {shortDescription}
                </p>
              )}

              <div className="pt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="nums text-2xl font-medium text-[var(--sukla-charcoal)]">
                    {formattedPrice}
                  </span>
                  {hasCompareAt && compareAt && (
                    <span className="nums text-base text-[var(--sukla-taupe)] line-through">
                      {format(compareAt.amount, compareAt.currencyCode).text}
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-2 text-xs font-sans ${
                    isAvailable ? 'text-emerald-800' : 'text-rose-800'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-rose-600'}`}
                  />
                  {isAvailable ? 'Available' : unavailableRegion ? `Not available in ${unavailableRegion}` : 'Sold out'}
                </span>
              </div>

              {priceDisplay.approximate && (
                <p className="text-xs font-sans text-[var(--sukla-taupe)]">
                  Approximate price. You are charged <span className="nums">{exactPrice}</span>{' '}
                  {selectedVariant.price.currencyCode} at checkout.
                </p>
              )}
            </div>

            {/* Size / variant. Hidden entirely for Shopify's placeholder variant. */}
            {hasMultipleVariants && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow text-xs text-[var(--sukla-charcoal)]">{optionLabel}</span>
                  {sizeGuideButton}
                </div>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label={optionLabel}>
                  {product.variants.map((v) => {
                    const selected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVariant(v)}
                        aria-pressed={selected}
                        className={`px-3 py-2.5 text-xs font-sans text-left border transition-all flex justify-between items-center gap-2 ${
                          selected
                            ? 'border-[var(--sukla-charcoal)] bg-[var(--sukla-cream)] ring-1 ring-[var(--sukla-charcoal)] font-semibold'
                            : 'border-[var(--sukla-muted-border)] hover:border-[var(--sukla-taupe)] bg-[var(--sukla-ivory)]'
                        } ${v.availableForSale ? '' : 'text-[var(--sukla-taupe)] line-through'}`}
                      >
                        <span>{v.title}</span>
                        {variantPricesDiffer && (
                          <span className="nums text-[11px] text-[var(--sukla-taupe)]">
                            {format(v.price.amount, v.price.currencyCode).text}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasMultipleVariants && (singleVariantLabel || listedSize) && (
              <div className="flex items-center justify-between gap-4 text-sm font-sans text-[var(--sukla-charcoal)]/80">
                <p>
                  <span className="eyebrow text-xs text-[var(--sukla-taupe)] mr-2">
                    {singleVariantLabel ? optionLabel : 'Size'}
                  </span>
                  <span className="nums">{singleVariantLabel ?? listedSize}</span>
                </p>
                {sizeGuideButton}
              </div>
            )}

            {highlightHeadings.length > 0 && (
              <ul className="space-y-1.5 text-sm font-sans text-[var(--sukla-charcoal)]/80" aria-label="Highlights">
                {highlightHeadings.map((heading) => (
                  <li key={heading} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--sukla-terracotta)]" aria-hidden="true" />
                    <span>{heading}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Purchase controls, grouped in one row */}
            <div className="space-y-3">
              <div className="flex gap-3" ref={purchaseRowRef}>
                <div
                  className="flex items-center border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] min-h-[3rem]"
                  role="group"
                  aria-label="Quantity"
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 h-full text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-sand)] transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="nums w-8 text-center text-sm font-medium" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    className="px-3 h-full text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-sand)] transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="min-h-[3rem]"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {addedNotice
                    ? 'Added to cart'
                    : isAvailable
                      ? `Add to cart · ${totalPrice}`
                      : unavailableRegion
                        ? 'Unavailable in your region'
                        : 'Sold out'}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={isWishlisted}
                  className={`px-4 min-h-[3rem] border border-[var(--sukla-muted-border)] transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'hover:border-[var(--sukla-charcoal)] text-[var(--sukla-charcoal)]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-700 text-rose-700' : ''}`} />
                </button>
              </div>

              {addedNotice && (
                <div
                  role="status"
                  className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to your cart.</span>
                </div>
              )}

              {/* Standalone only when there is no size row to hold the link */}
              {!showSizeRow && sizeGuideButton}
            </div>

            {/* Direct contact with a design expert, sitting with the buy controls */}
            <TalkToExpert />

            {/* Service links. Each statement is factual: checkout is Shopify-hosted, and the
                custom-order and consultation pages exist on this site. */}
            <ul className="grid gap-3 py-4 border-y border-[var(--sukla-muted-border)] text-xs font-sans text-[var(--sukla-charcoal)]/80">
              <li className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-[var(--sukla-terracotta)]" aria-hidden="true" />
                <span>Secure checkout by Shopify</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Scissors className="w-4 h-4 shrink-0 text-[var(--sukla-terracotta)]" aria-hidden="true" />
                <span>
                  Need a different size or design?{' '}
                  <Link href="/custom-rugs" className="text-[var(--sukla-terracotta)] hover:underline">
                    Explore bespoke orders
                  </Link>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 shrink-0 text-[var(--sukla-terracotta)]" aria-hidden="true" />
                <span>
                  Questions about this rug?{' '}
                  <Link href="/design-consultation" className="text-[var(--sukla-terracotta)] hover:underline">
                    Book a design consultation
                  </Link>
                </span>
              </li>
            </ul>

            {/* Details live in this column, so the pinned gallery stays in view while they
                scroll past. Every block renders only when real store data exists. */}
            {(hasAboutContent || detailRows.length > 0 || specRows.length > 0) && (
          <section
            aria-label="Product details"
            className="pt-8 border-t border-[var(--sukla-muted-border)] space-y-8"
          >
            <div className="space-y-6">
              <h2 className="display-lg text-2xl text-[var(--sukla-charcoal)]">About this rug</h2>

              {descriptionIntro && (
                <p className="text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80">
                  {descriptionIntro}
                </p>
              )}

              {features.length > 0 ? (
                <ul className="divide-y divide-[var(--sukla-muted-border)] border-y border-[var(--sukla-muted-border)]">
                  {features.map((feature, index) => (
                    <li key={index} className="py-4 space-y-1">
                      {feature.heading ? (
                        <>
                          <span className="heading text-base text-[var(--sukla-charcoal)] block">{feature.heading}</span>
                          <span className="text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80 block">
                            {feature.text}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80 block">
                          {feature.text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                product.description && (
                  <p className="text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80 whitespace-pre-line">
                    {product.description}
                  </p>
                )
              )}

              {m.product_story && (
                <p className="text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80 whitespace-pre-line">
                  {m.product_story}
                </p>
              )}

              <Link
                href="/process"
                className="text-[var(--sukla-terracotta)] font-semibold uppercase tracking-[0.1em] text-[10px] hover:underline inline-block"
              >
                Our craft process &rarr;
              </Link>
            </div>

            <div className="border-t border-[var(--sukla-muted-border)]">
              {detailRows.length > 0 && (
                <DetailSection title="Product details" defaultOpen>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                    {detailRows.map(([label, values]) => (
                      <React.Fragment key={label}>
                        <dt className="text-[var(--sukla-taupe)]">{label}</dt>
                        <dd className="nums min-w-0 break-words text-[var(--sukla-charcoal)]">
                          <FactValues values={values} />
                        </dd>
                      </React.Fragment>
                    ))}
                  </dl>
                  {isShortened && (
                    <p className="mt-3 text-xs text-[var(--sukla-taupe)]">Full listing title: {product.title}</p>
                  )}
                </DetailSection>
              )}

              {specRows.length > 0 && (
                <DetailSection title="Specifications" defaultOpen>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                    {specRows.map(([label, values]) => (
                      <React.Fragment key={label}>
                        <dt className="text-[var(--sukla-taupe)]">{label}</dt>
                        <dd className="nums min-w-0 break-words text-[var(--sukla-charcoal)]">
                          <FactValues values={values} />
                        </dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </DetailSection>
              )}

              <DetailSection title="Care">
                <div className="space-y-3">
                  {m.care_instructions && <p className="whitespace-pre-line">{m.care_instructions}</p>}
                  <Link
                    href="/guides/rug-care"
                    className="text-[var(--sukla-terracotta)] font-semibold uppercase tracking-[0.1em] text-[10px] hover:underline block"
                  >
                    Read the rug care guide &rarr;
                  </Link>
                </div>
              </DetailSection>

              {policies.length > 0 && (
                <DetailSection title="Shipping & returns">
                  <ul className="space-y-2">
                    {policies.map((policy) => (
                      <li key={policy.url}>
                        <a
                          href={policy.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--sukla-terracotta)] font-semibold uppercase tracking-[0.1em] text-[10px] hover:underline"
                        >
                          {policy.title} &rarr;
                        </a>
                      </li>
                    ))}
                  </ul>
                </DetailSection>
              )}
            </div>
          </section>
            )}
          </div>
        </div>

        {/* Related Products: hidden when there are none, grid adapts to count */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--sukla-muted-border)]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="display-lg text-2xl text-[var(--sukla-charcoal)]">
                You May Also Appreciate
              </h2>
              <Link href="/shop" className="text-xs uppercase tracking-[0.1em] text-[var(--sukla-terracotta)] font-semibold hover:underline">
                View all rugs
              </Link>
            </div>
            <div className={`grid gap-8 ${RELATED_GRID_CLASSES[related.length]}`}>
              {related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--sukla-ivory)] border-t border-[var(--sukla-muted-border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl lg:hidden flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="heading text-sm font-medium block truncate">{displayTitle}</span>
            <span className="nums text-xs font-medium text-[var(--sukla-charcoal)]">{formattedPrice}</span>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddToCart} disabled={!isAvailable}>
            {isAvailable ? 'Add to cart' : unavailableRegion ? 'Unavailable' : 'Sold out'}
          </Button>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {isFullscreenZoom && (
        <div
          ref={zoomDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Product image"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 right-6 text-white p-2 hover:text-[var(--sukla-terracotta)]"
            aria-label="Close fullscreen image"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeModalOpen && (
        <div
          ref={sizeDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--sukla-ivory)] max-w-xl w-full p-8 border border-[var(--sukla-muted-border)] shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--sukla-muted-border)] pb-4">
              <h3 id="size-guide-title" className="heading text-lg">Rug Placement &amp; Size Guide</h3>
              <button type="button" onClick={() => setSizeModalOpen(false)} aria-label="Close size guide">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-sans text-[var(--sukla-charcoal)]/85">
              <p><strong>8&apos; x 10&apos; (244cm x 305cm):</strong> Standard anchor size for standard living rooms and queen/king beds.</p>
              <p><strong>9&apos; x 12&apos; (274cm x 366cm):</strong> Ideal for generous open-plan seating zones with all furniture legs resting on the rug.</p>
              <p><strong>6&apos; x 9&apos; (183cm x 274cm):</strong> Perfect for compact sitting rooms, offices, and nursery suites.</p>
            </div>
            <div className="pt-4 text-right">
              <Button href="/guides/rug-size" variant="outline" size="sm">
                Explore Full Interactive Size Guide
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
