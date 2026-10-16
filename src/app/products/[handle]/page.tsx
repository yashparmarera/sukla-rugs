import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { getProductByHandle, getProducts, getStorePolicies } from '@/lib/shopify/client';
import { rankRelatedProducts } from '@/lib/product-display';
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

  return {
    title: `${product.title} | SUKLA RUGS`,
    description: product.description || undefined,
    openGraph: {
      title: `${product.title} | SUKLA RUGS`,
      description: product.description || undefined,
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
  // (same collection, product type, shared tags), then newest first.
  const allProducts = await getProducts({ country });
  const relatedProducts = rankRelatedProducts(product, allProducts);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.variants[0]?.id || product.id,
    brand: {
      '@type': 'Brand',
      name: 'SUKLA RUGS'
    },
    offers: {
      '@type': 'Offer',
      url: `https://shuklarugsv1.vercel.app/products/${product.handle}`,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
