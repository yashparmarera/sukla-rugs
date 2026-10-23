export interface ProductMetafields {
  technique?: string;
  material?: string;
  color_family?: string;
  origin_region?: string;
  care_instructions?: string;
  pile_height?: string;
  weight?: string;
  dimensions?: string;
  style?: string;
  room?: string;
  shape?: string;
  size_family?: string;
  construction?: string;
  /** sukla.palette: list of text, raw JSON array string, e.g. '["Neutral","Ivory"]'. */
  palette?: string;
  /** sukla.premium: boolean metafield, value string "true" or "false". */
  premium?: string;
  /** sukla.rug_format: single text, "Area Rug" or "Runner". */
  rug_format?: string;
  designer?: string;
  one_of_a_kind?: boolean;
  craft_duration?: string;
  product_story?: string;
  collection_story?: string;
  artisan_story?: string;
  knots_per_sq_inch?: string;
  short_description?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  width?: number;
  height?: number;
  type?: 'primary' | 'lifestyle' | 'detail' | 'fringe' | 'back' | 'room';
}

/** Shopify Storefront API `WeightUnit` values. */
export type WeightUnit = 'GRAMS' | 'KILOGRAMS' | 'OUNCES' | 'POUNDS';

export interface ProductVariant {
  id: string;
  title: string; // e.g. "8' x 10' / Ivory"
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ProductImage;
  sku?: string;
  dimensions?: string;
  /** Shipping weight from Shopify (variant weight). Zero means "not set". */
  weight?: number;
  weightUnit?: WeightUnit;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description: string;
  descriptionHtml?: string;
  /** Shopify "Search engine listing" values. Each is undefined when not customised in Admin. */
  seo?: {
    title?: string;
    description?: string;
  };
  productType?: string;
  /** The first collection only; used as the card label, breadcrumb and gallery tag. */
  collection: {
    title: string;
    handle: string;
    accentColor: string;
  };
  /** Every collection the product belongs to (up to 10). Absent for mock products. */
  collections?: {
    title: string;
    handle: string;
  }[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: ProductImage;
  images: ProductImage[];
  variants: ProductVariant[];
  options: {
    name: string;
    values: string[];
  }[];
  metafields: ProductMetafields;
  tags: string[];
  availableForSale: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
  accentColor: string;
  productCount: number;
  heroTagline?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ProductImage;
      collection: {
        title: string;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface FilterState {
  collection: string[];
  construction: string[];
  material: string[];
  color: string[];
  size: string[];
  room: string[];
  shape: string[];
  inStockOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  productHandle?: string;
  productTitle?: string;
  verifiedPurchase: boolean;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Craft' | 'Materials' | 'Heritage' | 'Interiors' | 'Guides';
  author: string;
  publishedAt: string;
  readTime: string;
  image: ProductImage;
  tags: string[];
}
