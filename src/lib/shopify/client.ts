import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { Collection, Product, Cart, CartItem, ProductImage, ProductVariant } from '@/types';
import { getProductQuery, getProductsQuery, getCollectionProductsQuery } from './queries/product';
import { getCollectionQuery, getCollectionsQuery } from './queries/collection';
import { createCartMutation, addToCartMutation, updateCartMutation, removeFromCartMutation, getCartQuery } from './mutations/cart';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from './mock-data';

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || 'vt0dch-hg.myshopify.com';
const privateAccessToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const publicAccessToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2026-07';

export const shopifyClient = typeof window === 'undefined'
  ? createStorefrontApiClient({
      storeDomain,
      apiVersion,
      ...(privateAccessToken ? { privateAccessToken } : { publicAccessToken: publicAccessToken || '' })
    })
  : (null as any);

/* ==========================================
   GRAPHQL FETCH WRAPPER WITH ERROR HANDLING
   ========================================== */

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T | null> {
  if (typeof window !== 'undefined' || !shopifyClient) {
    return null;
  }

  try {
    const response = await shopifyClient.request(query, {
      variables
    });

    if (response.errors) {
      console.error('[Shopify Storefront API Errors]', response.errors);
      return null;
    }

    return response.data as T;
  } catch (error) {
    console.error('[Shopify Storefront Fetch Exception]', error);
    return null;
  }
}

/* ==========================================
   DATA TRANSFORMERS (SHOPIFY GRAPHQL TO DOMAIN)
   ========================================== */

function reshapeImage(imageNode: any): ProductImage {
  if (!imageNode) {
    return {
      id: 'placeholder-img',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      altText: 'SUKLA RUGS Handcrafted Textile'
    };
  }
  return {
    id: imageNode.id || 'img-' + Math.random().toString(36).substring(2),
    url: imageNode.url,
    altText: imageNode.altText || 'SUKLA RUGS Handcrafted Textile',
    width: imageNode.width,
    height: imageNode.height
  };
}

function reshapeProduct(productNode: any): Product {
  const images: ProductImage[] = productNode.images?.edges?.map((e: any) => reshapeImage(e.node)) || [];
  const featuredImage = reshapeImage(productNode.featuredImage || images[0]);
  
  const variants: ProductVariant[] = productNode.variants?.edges?.map((e: any) => {
    const node = e.node;
    return {
      id: node.id,
      title: node.title,
      price: node.price || { amount: '0.00', currencyCode: 'USD' },
      compareAtPrice: node.compareAtPrice,
      availableForSale: node.availableForSale ?? true,
      selectedOptions: node.selectedOptions || [],
      image: reshapeImage(node.image || featuredImage),
      sku: node.sku
    };
  }) || [];

  const collectionNode = productNode.collections?.edges?.[0]?.node;

  return {
    id: productNode.id,
    handle: productNode.handle,
    title: productNode.title,
    subtitle: productNode.title + ' — Handcrafted in Bhadohi',
    description: productNode.description || 'Ultra-premium handcrafted rug woven in Bhadohi, India using natural raw wool, silk, and organic jute.',
    descriptionHtml: productNode.descriptionHtml,
    collection: {
      title: collectionNode?.title || 'Handcrafted Collection',
      handle: collectionNode?.handle || 'hand-knotted-oushak',
      accentColor: getCollectionAccentColor(collectionNode?.handle || '')
    },
    priceRange: productNode.priceRange || {
      minVariantPrice: variants[0]?.price || { amount: '1200.00', currencyCode: 'USD' },
      maxVariantPrice: variants[variants.length - 1]?.price || { amount: '3800.00', currencyCode: 'USD' }
    },
    featuredImage,
    images: images.length > 0 ? images : [featuredImage],
    variants,
    options: productNode.options || [],
    metafields: {
      technique: productNode.technique?.value || 'Hand-Knotted',
      material: productNode.material?.value || '100% Hand-Spun Wool',
      color_family: productNode.color_family?.value || 'Terracotta & Ivory',
      origin_region: productNode.origin_region?.value || 'Bhadohi, Uttar Pradesh, India',
      care_instructions: productNode.care_instructions?.value || 'Rotate every 6 months. Professional cleaning only.',
      pile_height: productNode.pile_height?.value || '0.4 in (10mm)',
      weight: productNode.weight?.value || '0.8 lbs / sq ft',
      knots_per_sq_inch: productNode.knots_per_sq_inch?.value || '80-100 Knots/SQI',
      craft_duration: productNode.craft_duration?.value || '14 Weeks of Hand Knotting',
      product_story: productNode.product_story?.value || 'Crafted individually on vertical pit looms in Bhadohi using natural hand-carded yarn.'
    },
    tags: productNode.tags || [],
    availableForSale: productNode.availableForSale ?? true,
    rating: 4.9,
    reviewCount: 14,
    createdAt: productNode.createdAt || '2026-01-01'
  };
}

function reshapeCollection(collectionNode: any): Collection {
  return {
    id: collectionNode.id,
    handle: collectionNode.handle,
    title: collectionNode.title,
    description: collectionNode.description || 'Authentic handcrafted rugs from Bhadohi, Uttar Pradesh, India.',
    image: reshapeImage(collectionNode.image),
    accentColor: getCollectionAccentColor(collectionNode.handle),
    productCount: 4,
    heroTagline: 'Handcrafted luxury derived from centuries of weaving mastery.'
  };
}

function getCollectionAccentColor(handle: string): string {
  const map: Record<string, string> = {
    'hand-knotted-oushak': '#9E3324',
    'persian-hand-tufted': '#3C4149',
    'modern-hand-tufted': '#45461D',
    'hand-woven-rugs': '#A48C94',
    'the-artisan-loop-collection': '#49201B',
    'hand-woven-jute': '#3F9196'
  };
  return map[handle] || '#BC8A5A';
}

function reshapeCart(cartNode: any): Cart {
  if (!cartNode) {
    return {
      id: 'cart-empty',
      checkoutUrl: 'https://checkout.shopify.com',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalAmount: { amount: '0.00', currencyCode: 'USD' }
      }
    };
  }

  const lines: CartItem[] = cartNode.lines?.edges?.map((e: any) => {
    const node = e.node;
    const merch = node.merchandise;
    return {
      id: node.id,
      quantity: node.quantity,
      cost: node.cost,
      merchandise: {
        id: merch.id,
        title: merch.title,
        price: merch.price,
        selectedOptions: merch.selectedOptions || [],
        product: {
          id: merch.product?.id || '',
          handle: merch.product?.handle || '',
          title: merch.product?.title || '',
          featuredImage: reshapeImage(merch.product?.featuredImage),
          collection: {
            title: merch.product?.collections?.edges?.[0]?.node?.title || 'Handcrafted'
          }
        }
      }
    };
  }) || [];

  return {
    id: cartNode.id,
    checkoutUrl: cartNode.checkoutUrl || 'https://checkout.shopify.com',
    totalQuantity: cartNode.totalQuantity || 0,
    lines,
    cost: cartNode.cost || {
      subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalAmount: { amount: '0.00', currencyCode: 'USD' }
    }
  };
}

/* ==========================================
   PUBLIC API SERVICE METHODS
   ========================================== */

export async function getProducts(options?: {
  collection?: string;
  material?: string;
  color?: string;
  construction?: string;
  room?: string;
  query?: string;
  sortBy?: string;
  limit?: number;
  country?: string;
  language?: string;
}): Promise<Product[]> {
  // If query is for a specific collection handle
  if (options?.collection && options.collection !== 'all') {
    const res = await shopifyFetch<any>({
      query: getCollectionProductsQuery,
      variables: {
        handle: options.collection,
        first: options.limit || 25,
        country: options.country || 'US',
        language: options.language || 'EN'
      }
    });

    if (res?.collection?.products?.edges?.length) {
      const products = res.collection.products.edges.map((e: any) => reshapeProduct(e.node));
      return filterAndSortProducts(products, options);
    }
  }

  // General products query
  let shopifyQueryString: string | undefined = options?.query;

  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    variables: {
      first: options?.limit || 25,
      query: shopifyQueryString,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.products?.edges?.length) {
    const products = res.products.edges.map((e: any) => reshapeProduct(e.node));
    return filterAndSortProducts(products, options);
  }

  // Fallback gracefully if live store has 0 products in draft state
  let fallback = filterAndSortProducts(MOCK_PRODUCTS, options);
  if (options?.limit) fallback = fallback.slice(0, options.limit);
  return fallback;
}

function filterAndSortProducts(products: Product[], options?: any): Product[] {
  let result = [...products];

  if (options?.material && options.material !== 'all') {
    const mat = options.material.toLowerCase();
    result = result.filter(
      (p) => p.metafields.material?.toLowerCase().includes(mat) || p.tags.some((t) => t.toLowerCase().includes(mat))
    );
  }

  if (options?.color && options.color !== 'all') {
    const col = options.color.toLowerCase();
    result = result.filter(
      (p) => p.metafields.color_family?.toLowerCase().includes(col) || p.tags.some((t) => t.toLowerCase().includes(col))
    );
  }

  if (options?.construction && options.construction !== 'all') {
    const con = options.construction.toLowerCase();
    result = result.filter(
      (p) => p.metafields.technique?.toLowerCase().includes(con) || p.tags.some((t) => t.toLowerCase().includes(con))
    );
  }

  if (options?.room && options.room !== 'all') {
    const rm = options.room.toLowerCase();
    result = result.filter((p) => p.tags.some((t) => t.toLowerCase().includes(rm)));
  }

  if (options?.sortBy) {
    if (options.sortBy === 'price-asc') {
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (options.sortBy === 'price-desc') {
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    } else if (options.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  return result;
}

export async function getProductByHandle(
  handle: string,
  options?: { country?: string; language?: string }
): Promise<Product | null> {
  const res = await shopifyFetch<any>({
    query: getProductQuery,
    variables: {
      handle,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.product) {
    return reshapeProduct(res.product);
  }

  // Check fallback mock catalog if handle matches
  const mockMatch = MOCK_PRODUCTS.find((p) => p.handle === handle);
  return mockMatch || null;
}

export async function getCollections(options?: { country?: string; language?: string }): Promise<Collection[]> {
  const res = await shopifyFetch<any>({
    query: getCollectionsQuery,
    variables: {
      first: 20,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.collections?.edges?.length) {
    return res.collections.edges.map((e: any) => reshapeCollection(e.node));
  }

  return MOCK_COLLECTIONS;
}

export async function getCollectionByHandle(
  handle: string,
  options?: { country?: string; language?: string }
): Promise<Collection | null> {
  const res = await shopifyFetch<any>({
    query: getCollectionQuery,
    variables: {
      handle,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.collection) {
    return reshapeCollection(res.collection);
  }

  const mock = MOCK_COLLECTIONS.find((c) => c.handle === handle);
  return mock || null;
}

export async function searchProducts(
  query: string,
  options?: { country?: string; language?: string }
): Promise<Product[]> {
  return getProducts({ query, ...options });
}

/* ==========================================
   SHOPIFY CART API OPERATIONS
   ========================================== */

const CART_STORAGE_KEY = 'shukla_shopify_cart_id';

export async function createCart(
  lineItems: Array<{ merchandiseId: string; quantity: number }> = [],
  options?: { country?: string; language?: string }
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: createCartMutation,
    variables: {
      lineItems: lineItems.map((item) => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity
      })),
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.cartCreate?.userErrors?.length) {
    console.warn('[Shopify Cart UserErrors]', res.cartCreate.userErrors);
  }

  if (res?.cartCreate?.cart) {
    const cart = reshapeCart(res.cartCreate.cart);
    saveCartId(cart.id);
    return cart;
  }

  return getLocalCart();
}

export async function getCart(
  cartId?: string,
  options?: { country?: string; language?: string }
): Promise<Cart> {
  const targetId = cartId || getSavedCartId();
  if (!targetId) {
    return createCart([], options);
  }

  const res = await shopifyFetch<any>({
    query: getCartQuery,
    variables: {
      cartId: targetId,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.cart) {
    return reshapeCart(res.cart);
  }

  return createCart([], options);
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
  options?: { country?: string; language?: string }
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines: lines.map((l) => ({
        merchandiseId: l.merchandiseId,
        quantity: l.quantity
      })),
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.cartLinesAdd?.cart) {
    const cart = reshapeCart(res.cartLinesAdd.cart);
    saveCartId(cart.id);
    notifyCartUpdate(cart);
    return cart;
  }

  return getLocalCart();
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>,
  options?: { country?: string; language?: string }
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: updateCartMutation,
    variables: {
      cartId,
      lines: lines.map((l) => ({
        id: l.id,
        merchandiseId: l.merchandiseId,
        quantity: l.quantity
      })),
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.cartLinesUpdate?.cart) {
    const cart = reshapeCart(res.cartLinesUpdate.cart);
    notifyCartUpdate(cart);
    return cart;
  }

  return getLocalCart();
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
  options?: { country?: string; language?: string }
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
      country: options?.country || 'US',
      language: options?.language || 'EN'
    }
  });

  if (res?.cartLinesRemove?.cart) {
    const cart = reshapeCart(res.cartLinesRemove.cart);
    notifyCartUpdate(cart);
    return cart;
  }

  return getLocalCart();
}

/* Local Cart Helper Utilities for Reactive UI */

function getSavedCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}

function saveCartId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, id);
}

function notifyCartUpdate(cart: Cart): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('shukla:cart-updated', { detail: cart }));
}

// Local Cart fallback when client side requires immediate responsive offline updates
export function getLocalCart(): Cart {
  if (typeof window === 'undefined') {
    return {
      id: 'cart-ssr',
      checkoutUrl: 'https://checkout.shopify.com',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalAmount: { amount: '0.00', currencyCode: 'USD' }
      }
    };
  }

  try {
    const raw = localStorage.getItem('shukla_cart_v1');
    if (!raw) {
      const emptyCart: Cart = {
        id: 'cart-' + Math.random().toString(36).substring(2, 9),
        checkoutUrl: 'https://checkout.shopify.com',
        totalQuantity: 0,
        lines: [],
        cost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };
      localStorage.setItem('shukla_cart_v1', JSON.stringify(emptyCart));
      return emptyCart;
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      id: 'cart-fallback',
      checkoutUrl: 'https://checkout.shopify.com',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalAmount: { amount: '0.00', currencyCode: 'USD' }
      }
    };
  }
}

export function addToLocalCart(product: Product, variantId?: string, quantity: number = 1): Cart {
  const currentCart = getLocalCart();
  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];

  const existingLineIndex = currentCart.lines.findIndex((l) => l.merchandise.id === variant.id);

  if (existingLineIndex > -1) {
    currentCart.lines[existingLineIndex].quantity += quantity;
    currentCart.lines[existingLineIndex].cost.totalAmount.amount = (
      currentCart.lines[existingLineIndex].quantity * parseFloat(variant.price.amount)
    ).toFixed(2);
  } else {
    const newLine: CartItem = {
      id: 'line-' + Math.random().toString(36).substring(2, 9),
      quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(variant.price.amount) * quantity).toFixed(2),
          currencyCode: variant.price.currencyCode
        }
      },
      merchandise: {
        id: variant.id,
        title: variant.title,
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          featuredImage: product.featuredImage,
          collection: {
            title: product.collection.title
          }
        },
        price: variant.price,
        selectedOptions: variant.selectedOptions
      }
    };
    currentCart.lines.push(newLine);
  }

  // Recalculate totals
  let totalQty = 0;
  let subtotal = 0;

  currentCart.lines.forEach((line) => {
    totalQty += line.quantity;
    subtotal += parseFloat(line.merchandise.price.amount) * line.quantity;
  });

  currentCart.totalQuantity = totalQty;
  currentCart.cost = {
    subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
    totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' }
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('shukla_cart_v1', JSON.stringify(currentCart));
    notifyCartUpdate(currentCart);
  }

  return currentCart;
}

export function updateLocalCartLine(lineId: string, quantity: number): Cart {
  const currentCart = getLocalCart();
  if (quantity <= 0) {
    currentCart.lines = currentCart.lines.filter((l) => l.id !== lineId);
  } else {
    const line = currentCart.lines.find((l) => l.id === lineId);
    if (line) {
      line.quantity = quantity;
      line.cost.totalAmount.amount = (quantity * parseFloat(line.merchandise.price.amount)).toFixed(2);
    }
  }

  let totalQty = 0;
  let subtotal = 0;
  currentCart.lines.forEach((line) => {
    totalQty += line.quantity;
    subtotal += parseFloat(line.merchandise.price.amount) * line.quantity;
  });

  currentCart.totalQuantity = totalQty;
  currentCart.cost = {
    subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
    totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' }
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('shukla_cart_v1', JSON.stringify(currentCart));
    notifyCartUpdate(currentCart);
  }

  return currentCart;
}

export function removeFromLocalCartLine(lineId: string): Cart {
  return updateLocalCartLine(lineId, 0);
}
