import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { getProductByHandle, getProducts, getStorePolicies } from '@/lib/shopify/client';
import { buildProductMetadata, rankRelatedProducts } from '@/lib/product-display';
import { buildProductJsonLd, serializeJsonLd } from '@/lib/product-jsonld';
import { getSelectedCountry } from '@/lib/localization.server';
import { DEFAULT_COUNTRY } from '@/lib/localization';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) return { title: 'Product Not Found | SUKLA RUGS' };

  const { title, description } = buildProductMetadata(product);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.featuredImage.url }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const country = await getSelectedCountry();
  const product = await getProductByHandle(handle, { country });

  if (!product) {
    notFound();
  }

  const policies = await getStorePolicies();

  // If Shopify says this product cannot be bought in the shopper's country but
  // can in the default one, it is a delivery-region issue, not "sold out".
  let unavailableRegion: string | undefined;
  if (!product.availableForSale && country !== DEFAULT_COUNTRY) {
    const baseline = await getProductByHandle(handle, { country: DEFAULT_COUNTRY });
    if (baseline?.availableForSale) {
      unavailableRegion = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ?? country;
    }
  }

  // Suggestions are real, purchasable products ranked by genuine relevance
  // (shared collections, product type, tags and sukla metafields), then newest first.
  const allProducts = await getProducts({ country });
  const relatedProducts = rankRelatedProducts(product, allProducts);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildProductJsonLd(product)) }}
      />
      <Header />
      <main className="flex-1">
        <ProductDetailView
          product={product}
          relatedProducts={relatedProducts}
          policies={policies}
          unavailableRegion={unavailableRegion}
        />
      </main>
      <Footer />
    </div>
  );
}
