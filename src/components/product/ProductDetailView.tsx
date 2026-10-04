'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { addToLocalCart } from '@/lib/shopify/local-cart';
import { Button } from '@/components/ui/Button';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { ProductCard } from '@/components/product/ProductCard';
import { trackEvent } from '@/lib/analytics';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, relatedProducts }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default-var',
      title: "8' x 10'",
      price: product.priceRange.minVariantPrice,
      availableForSale: true,
      selectedOptions: []
    }
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'care' | 'shipping'>('story');
  const [addedNotice, setAddedNotice] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const currentImage = product.images[activeImageIndex] || product.featuredImage;

  useEffect(() => {
    trackEvent('product_view', {
      productId: product.id,
      productTitle: product.title,
      collection: product.collection.title
    });

    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  const handleAddToCart = () => {
    addToLocalCart(product, selectedVariant.id, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
    trackEvent('add_to_cart', {
      productId: product.id,
      variantId: selectedVariant.id,
      price: selectedVariant.price.amount
    });
  };

  const formattedPrice = parseFloat(selectedVariant.price.amount).toLocaleString('en-US', {
    minimumFractionDigits: 2
  });

  return (
    <>
      <div className="editorial-container py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[var(--shukla-taupe)] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--shukla-charcoal)]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[var(--shukla-charcoal)]">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/collections/${product.collection.handle}`} className="hover:text-[var(--shukla-charcoal)]">
            {product.collection.title}
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--shukla-charcoal)]" />
          <span className="text-[var(--shukla-charcoal)] font-semibold truncate">{product.title}</span>
        </nav>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary View with Fullscreen Zoom Trigger */}
            <div className="relative aspect-[4/5] w-full bg-[var(--shukla-sand)] border border-[var(--shukla-muted-border)] overflow-hidden group">
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setIsFullscreenZoom(true)}
              />

              <button
                onClick={() => setIsFullscreenZoom(true)}
                className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-xs text-[var(--shukla-charcoal)] hover:bg-[var(--shukla-charcoal)] hover:text-white transition-all shadow-subtle"
                title="Fullscreen View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <span
                className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] font-sans px-3 py-1 text-white font-semibold"
                style={{ backgroundColor: product.collection.accentColor }}
              >
                {product.collection.title}
              </span>
            </div>

            {/* Thumbnail Carousel Strip */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/3] bg-[var(--shukla-cream)] border transition-all overflow-hidden ${
                      activeImageIndex === idx
                        ? 'border-[var(--shukla-charcoal)] ring-1 ring-[var(--shukla-charcoal)]'
                        : 'border-[var(--shukla-muted-border)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={img.altText || ''} fill className="object-cover" sizes="150px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            
            <div className="space-y-3 pb-6 border-b border-[var(--shukla-muted-border)]">
              <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
                {product.metafields.technique || 'Handcrafted'} • {product.metafields.origin_region || 'Bhadohi, India'}
              </span>

              <h1 className="display-lg text-3xl sm:text-4xl text-[var(--shukla-charcoal)]">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="font-serif italic text-base text-[var(--shukla-charcoal)]/80">
                  {product.subtitle}
                </p>
              )}

              <div className="pt-2 flex items-baseline justify-between">
                <span className="nums text-2xl md:text-3xl font-medium text-[var(--shukla-charcoal)]">
                  ${formattedPrice} <span className="text-xs font-sans font-normal text-[var(--shukla-taupe)]">USD</span>
                </span>
                <span className="text-xs font-sans text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-medium">
                  In Stock & Ready for Dispatch
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="uppercase tracking-widest text-[var(--shukla-charcoal)] font-semibold">
                  Select Dimension / Size:
                </span>
                <button
                  onClick={() => setSizeModalOpen(true)}
                  className="text-[var(--shukla-terracotta)] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" /> Interactive Size Guide
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 text-xs font-sans text-left border transition-all flex justify-between items-center ${
                      selectedVariant.id === v.id
                        ? 'border-[var(--shukla-charcoal)] bg-[var(--shukla-cream)] ring-1 ring-[var(--shukla-charcoal)] font-semibold'
                        : 'border-[var(--shukla-muted-border)] hover:border-[var(--shukla-taupe)] bg-[var(--shukla-ivory)]'
                    }`}
                  >
                    <span>{v.title}</span>
                    <span className="nums text-[11px] text-[var(--shukla-taupe)]">
                      ${parseFloat(v.price.amount).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Add to Cart & Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-4">
                <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart} className="py-4 text-xs font-bold">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {addedNotice ? 'Added to Selection!' : 'Add to Cart — $' + formattedPrice}
                </Button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist product"
                  className={`p-4 border border-[var(--shukla-muted-border)] transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'hover:border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-700 text-rose-700' : ''}`} />
                </button>
              </div>

              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Item added to your selection drawer.</span>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--shukla-muted-border)] text-xs font-sans text-[var(--shukla-charcoal)]/80">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[var(--shukla-terracotta)] shrink-0" />
                <span>Complimentary Global White-Glove Shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--shukla-terracotta)] shrink-0" />
                <span>Authentic Bhadohi Certificate Included</span>
              </div>
            </div>

            {/* Accordion Tabs for Story, Specifications & Care */}
            <div className="space-y-4 pt-4">
              <div className="flex border-b border-[var(--shukla-muted-border)] text-xs font-sans uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-3 px-4 font-semibold border-b-2 transition-all ${
                    activeTab === 'story'
                      ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                      : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
                  }`}
                >
                  Product Story
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 px-4 font-semibold border-b-2 transition-all ${
                    activeTab === 'specs'
                      ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                      : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
                  }`}
                >
                  Craft Specs
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 px-4 font-semibold border-b-2 transition-all ${
                    activeTab === 'care'
                      ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                      : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
                  }`}
                >
                  Care & Maintenance
                </button>
              </div>

              <div className="py-4 text-xs font-sans leading-relaxed text-[var(--shukla-charcoal)]/85">
                {activeTab === 'story' && (
                  <div className="space-y-3">
                    <p className="font-serif italic text-sm text-[var(--shukla-charcoal)]">
                      {product.description}
                    </p>
                    <p>{product.metafields.product_story}</p>
                    <Link href="/process" className="text-[var(--shukla-terracotta)] font-semibold uppercase tracking-wider text-[10px] hover:underline block pt-2">
                      Learn how this rug was crafted in Bhadohi &rarr;
                    </Link>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border border-[var(--shukla-muted-border)] p-4 bg-[var(--shukla-cream)]">
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Technique</span>
                      <span className="font-medium">{product.metafields.technique || 'Hand-Knotted'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Material</span>
                      <span className="font-medium">{product.metafields.material || '100% Wool'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Knot Density</span>
                      <span className="font-medium">{product.metafields.knots_per_sq_inch || '80-100 Knots/SQI'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Pile Height</span>
                      <span className="font-medium">{product.metafields.pile_height || '0.4 in'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Craft Duration</span>
                      <span className="font-medium">{product.metafields.craft_duration || '12-14 Weeks'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[var(--shukla-taupe)] uppercase tracking-widest">Origin</span>
                      <span className="font-medium">{product.metafields.origin_region || 'Bhadohi, India'}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-3">
                    <p>{product.metafields.care_instructions}</p>
                    <p className="text-[11px] text-[var(--shukla-taupe)]">
                      For liquid spills, blot immediately with a clean dry cotton cloth. Do not rub.
                    </p>
                    <Link href="/guides/rug-care" className="text-[var(--shukla-terracotta)] font-semibold uppercase tracking-wider text-[10px] hover:underline block pt-1">
                      Read Complete Rug Care & Stain Removal Guide &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[var(--shukla-muted-border)]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="display-lg text-2xl text-[var(--shukla-charcoal)]">
                You May Also Appreciate
              </h2>
              <Link href="/shop" className="text-xs uppercase tracking-widest text-[var(--shukla-terracotta)] font-semibold hover:underline">
                View Full Catalogue
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.slice(0, 3).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--shukla-ivory)] border-t border-[var(--shukla-muted-border)] p-4 shadow-2xl lg:hidden flex items-center justify-between">
          <div>
            <span className="heading text-sm font-medium block truncate max-w-[160px]">
              {product.title}
            </span>
            <span className="nums text-xs font-medium text-[var(--shukla-charcoal)]">
              ${formattedPrice}
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {isFullscreenZoom && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 right-6 text-white p-2 hover:text-[var(--shukla-terracotta)]"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={currentImage.url}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[var(--shukla-ivory)] max-w-xl w-full p-8 border border-[var(--shukla-muted-border)] shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--shukla-muted-border)] pb-4">
              <h3 className="heading text-lg">Rug Placement &amp; Size Guide</h3>
              <button onClick={() => setSizeModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-sans text-[var(--shukla-charcoal)]/85">
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
