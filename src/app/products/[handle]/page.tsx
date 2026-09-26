import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { getProductByHandle, getProducts } from '@/lib/shopify/client';

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
    description: product.description,
    openGraph: {
      title: `${product.title} | SUKLA RUGS`,
      description: product.description,
      images: [{ url: product.featuredImage.url }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.handle !== product.handle && p.collection.handle === product.collection.handle
  );

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
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
