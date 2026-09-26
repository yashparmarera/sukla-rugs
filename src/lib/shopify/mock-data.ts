import { Collection, Product, JournalArticle, Review } from '@/types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'gid://shopify/Collection/1',
    handle: 'hand-knotted-oushak',
    title: 'Hand-Knotted Oushak',
    description: 'Inspired by classic Anatolian motifs and masterfully woven in Bhadohi using premium hand-spun New Zealand wool.',
    accentColor: '#9E3324',
    productCount: 4,
    heroTagline: 'Time-honored knotting techniques meeting modern muted aesthetics.',
    image: {
      id: 'img-col-oushak',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      altText: 'Hand-Knotted Oushak Rug in sunlit room'
    }
  },
  {
    id: 'gid://shopify/Collection/2',
    handle: 'persian-hand-tufted',
    title: 'Persian Hand-Tufted',
    description: 'High-density pile featuring heritage medallions and plush wool loops tailored for tactile comfort.',
    accentColor: '#3C4149',
    productCount: 3,
    heroTagline: 'Deep plush pile and intricate heritage geometry.',
    image: {
      id: 'img-col-persian',
      url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=85',
      altText: 'Persian Hand-Tufted rug detail'
    }
  },
  {
    id: 'gid://shopify/Collection/3',
    handle: 'modern-hand-tufted',
    title: 'Modern Hand-Tufted',
    description: 'Architectural lines, abstract shapes, and subtle low-profile textures designed for modern interior spaces.',
    accentColor: '#45461D',
    productCount: 3,
    heroTagline: 'Minimalist forms crafted with uncompromising artisanal precision.',
    image: {
      id: 'img-col-modern',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      altText: 'Modern Hand-Tufted rug in minimal interior'
    }
  },
  {
    id: 'gid://shopify/Collection/4',
    handle: 'hand-woven-rugs',
    title: 'Hand-Woven Rugs',
    description: 'Reversible flatweaves and dhurries embodying light, tactile elegance and flexible room layering.',
    accentColor: '#A48C94',
    productCount: 3,
    heroTagline: 'Versatile, reversible flatweaves crafted on traditional pit looms.',
    image: {
      id: 'img-col-woven',
      url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      altText: 'Hand-Woven flatweave rug'
    }
  },
  {
    id: 'gid://shopify/Collection/5',
    handle: 'the-artisan-loop-collection',
    title: 'The Artisan Loop Collection',
    description: 'Uncut high-low loops providing rich textural depth underfoot with organic un-dyed wool blends.',
    accentColor: '#49201B',
    productCount: 3,
    heroTagline: 'Tactile loop structures derived from un-dyed natural raw wool.',
    image: {
      id: 'img-col-loop',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      altText: 'Textured artisan loop rug texture'
    }
  },
  {
    id: 'gid://shopify/Collection/6',
    handle: 'hand-woven-jute',
    title: 'Hand-Woven Jute',
    description: 'Sustainably harvested natural jute fibers, hand-spun and woven for resilient, textured living spaces.',
    accentColor: '#3F9196',
    productCount: 3,
    heroTagline: 'Earthy warmth and natural fiber resilience.',
    image: {
      id: 'img-col-jute',
      url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85',
      altText: 'Natural jute hand-braided rug'
    }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/101',
    handle: 'desert-loom-oushak',
    title: 'Desert Loom (Knotted)',
    subtitle: 'Hand-Knotted Oushak Rug in Sun-Washed Terracotta & Ivory',
    description: 'The Desert Loom is a masterpiece of Anatolian-inspired restraint. Hand-knotted by master artisans in Bhadohi using hand-spun New Zealand wool, it features subtle abrashes and muted terracotta tones that bring organic warmth to living spaces.',
    collection: {
      title: 'Hand-Knotted Oushak',
      handle: 'hand-knotted-oushak',
      accentColor: '#9E3324'
    },
    priceRange: {
      minVariantPrice: { amount: '1850.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '4200.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-dl-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      altText: 'Desert Loom Hand-Knotted Oushak Rug'
    },
    images: [
      {
        id: 'img-dl-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
        altText: 'Desert Loom Hand-Knotted Oushak Rug Primary View',
        type: 'primary'
      },
      {
        id: 'img-dl-2',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
        altText: 'Desert Loom Rug in Living Room Interior',
        type: 'lifestyle'
      },
      {
        id: 'img-dl-3',
        url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1400&q=85',
        altText: 'Close up knot texture detail',
        type: 'detail'
      },
      {
        id: 'img-dl-4',
        url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85',
        altText: 'Fringe and finished selvage edge',
        type: 'fringe'
      }
    ],
    options: [
      { name: 'Size', values: ["6' x 9'", "8' x 10'", "9' x 12'", "10' x 14'"] },
      { name: 'Color', values: ['Terracotta / Ivory', 'Desert Sand'] }
    ],
    variants: [
      {
        id: 'var-dl-6x9',
        title: "6' x 9' / Terracotta / Ivory",
        price: { amount: '1850.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "6' x 9'" }, { name: 'Color', value: 'Terracotta / Ivory' }],
        dimensions: "6' x 9' (183cm x 274cm)"
      },
      {
        id: 'var-dl-8x10',
        title: "8' x 10' / Terracotta / Ivory",
        price: { amount: '2800.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }, { name: 'Color', value: 'Terracotta / Ivory' }],
        dimensions: "8' x 10' (244cm x 305cm)"
      },
      {
        id: 'var-dl-9x12',
        title: "9' x 12' / Terracotta / Ivory",
        price: { amount: '3600.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "9' x 12'" }, { name: 'Color', value: 'Terracotta / Ivory' }],
        dimensions: "9' x 12' (274cm x 366cm)"
      }
    ],
    metafields: {
      technique: 'Hand-Knotted',
      material: '100% Hand-Spun New Zealand Wool',
      color_family: 'Terracotta / Ivory / Taupe',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      care_instructions: 'Rotate every 6 months. Vacuum without beater bar. Professional dry cleaning only.',
      pile_height: '0.4 inches (10mm)',
      weight: '0.8 lbs / sq. ft.',
      knots_per_sq_inch: '80 Knots / SQI',
      construction: 'Hand-Knotted on Vertical Loom',
      craft_duration: '14 weeks of hand knotting by 3 artisans',
      product_story: 'Rooted in classic Oushak geometry, each knot is tied individually by hand on traditional wooden looms in Bhadohi. Natural abrash variations in yarn colors give every rug its distinctive vintage character.'
    },
    tags: ['Oushak', 'Hand-Knotted', 'Terracotta', 'Wool', 'Living Room', 'Best Seller'],
    availableForSale: true,
    rating: 4.9,
    reviewCount: 18,
    createdAt: '2026-01-15'
  },
  {
    id: 'gid://shopify/Product/102',
    handle: 'anatolian-heritage',
    title: 'Anatolian Heritage',
    subtitle: 'Classic Hand-Knotted Medallion Rug in Indigo & Soft Taupe',
    description: 'Anatolian Heritage captures centuries of weaving tradition with softly washed indigo hues and botanical scrollwork. Hand-knotted over 16 weeks in Bhadohi.',
    collection: {
      title: 'Hand-Knotted Oushak',
      handle: 'hand-knotted-oushak',
      accentColor: '#9E3324'
    },
    priceRange: {
      minVariantPrice: { amount: '2100.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '4800.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-ah-1',
      url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1400&q=85',
      altText: 'Anatolian Heritage Hand-Knotted Rug'
    },
    images: [
      {
        id: 'img-ah-1',
        url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1400&q=85',
        altText: 'Anatolian Heritage Primary View',
        type: 'primary'
      },
      {
        id: 'img-ah-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
        altText: 'In room setting',
        type: 'lifestyle'
      }
    ],
    options: [
      { name: 'Size', values: ["8' x 10'", "9' x 12'", "10' x 14'"] }
    ],
    variants: [
      {
        id: 'var-ah-8x10',
        title: "8' x 10' / Indigo / Taupe",
        price: { amount: '3100.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10' (244cm x 305cm)"
      }
    ],
    metafields: {
      technique: 'Hand-Knotted',
      material: 'Hand-Spun Wool with Bikaner Silk Accents',
      color_family: 'Indigo / Muted Taupe',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      pile_height: '0.35 inches',
      knots_per_sq_inch: '100 Knots / SQI',
      craft_duration: '16 weeks',
      construction: 'Hand-Knotted'
    },
    tags: ['Oushak', 'Hand-Knotted', 'Indigo', 'Silk Blend', 'Dining Room'],
    availableForSale: true,
    rating: 5.0,
    reviewCount: 12,
    createdAt: '2026-02-01'
  },
  {
    id: 'gid://shopify/Product/103',
    handle: 'isfahan-grace',
    title: 'Isfahan Grace',
    subtitle: 'Persian Hand-Tufted Wool Rug in Muted Sand & Charcoal',
    description: 'Isfahan Grace reconciles classical Persian medallion symmetry with modern ivory and charcoal tones. Dense wool pile hand-tufted with latex backing for longevity.',
    collection: {
      title: 'Persian Hand-Tufted',
      handle: 'persian-hand-tufted',
      accentColor: '#3C4149'
    },
    priceRange: {
      minVariantPrice: { amount: '1250.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '2900.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-ig-1',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
      altText: 'Isfahan Grace Persian Hand-Tufted Rug'
    },
    images: [
      {
        id: 'img-ig-1',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
        altText: 'Isfahan Grace Primary View',
        type: 'primary'
      }
    ],
    options: [{ name: 'Size', values: ["6' x 9'", "8' x 10'", "9' x 12'"] }],
    variants: [
      {
        id: 'var-ig-8x10',
        title: "8' x 10' / Ivory & Charcoal",
        price: { amount: '1950.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10'"
      }
    ],
    metafields: {
      technique: 'Hand-Tufted',
      material: '100% Indian Wool Pile with Natural Latex Backing',
      color_family: 'Ivory / Charcoal / Sand',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      pile_height: '0.6 inches (15mm)',
      weight: '1.1 lbs / sq. ft.',
      construction: 'Hand-Tufted'
    },
    tags: ['Persian', 'Hand-Tufted', 'Ivory', 'Charcoal', 'Plush'],
    availableForSale: true,
    rating: 4.8,
    reviewCount: 9,
    createdAt: '2026-01-20'
  },
  {
    id: 'gid://shopify/Product/104',
    handle: 'linear-shadow',
    title: 'Linear Shadow',
    subtitle: 'Modern Hand-Tufted Architectural Loop in Olive & Slate',
    description: 'Designed for contemporary living spaces, Linear Shadow features sharp cut-and-loop wool structures in earthy olive and quiet slate gray.',
    collection: {
      title: 'Modern Hand-Tufted',
      handle: 'modern-hand-tufted',
      accentColor: '#45461D'
    },
    priceRange: {
      minVariantPrice: { amount: '1100.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '2600.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-ls-1',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
      altText: 'Linear Shadow Modern Hand-Tufted Rug'
    },
    images: [
      {
        id: 'img-ls-1',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
        altText: 'Linear Shadow View',
        type: 'primary'
      }
    ],
    options: [{ name: 'Size', values: ["6' x 9'", "8' x 10'", "9' x 12'"] }],
    variants: [
      {
        id: 'var-ls-8x10',
        title: "8' x 10' / Olive & Slate",
        price: { amount: '1750.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10'"
      }
    ],
    metafields: {
      technique: 'Hand-Tufted Cut & Loop',
      material: '100% Wool',
      color_family: 'Olive / Slate Gray',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      pile_height: '0.5 inches',
      construction: 'Hand-Tufted'
    },
    tags: ['Modern', 'Hand-Tufted', 'Olive', 'Geometric', 'Architectural'],
    availableForSale: true,
    rating: 4.9,
    reviewCount: 15,
    createdAt: '2026-02-10'
  },
  {
    id: 'gid://shopify/Product/105',
    handle: 'desert-loom-woven',
    title: 'Desert Loom (Woven)',
    subtitle: 'Reversible Hand-Woven Wool Flatweave in Dusty Rose & Clay',
    description: 'The woven expression of Desert Loom. A lightweight, reversible flatweave dhurrie crafted on wooden pit looms, perfect for dining rooms and sunlit hallways.',
    collection: {
      title: 'Hand-Woven Rugs',
      handle: 'hand-woven-rugs',
      accentColor: '#A48C94'
    },
    priceRange: {
      minVariantPrice: { amount: '750.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '1800.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-dlw-1',
      url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85',
      altText: 'Desert Loom Woven Flatweave Rug'
    },
    images: [
      {
        id: 'img-dlw-1',
        url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85',
        altText: 'Desert Loom Woven Flatweave Primary View',
        type: 'primary'
      }
    ],
    options: [{ name: 'Size', values: ["5' x 8'", "8' x 10'", "9' x 12'"] }],
    variants: [
      {
        id: 'var-dlw-8x10',
        title: "8' x 10' / Dusty Rose",
        price: { amount: '1200.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10'"
      }
    ],
    metafields: {
      technique: 'Hand-Woven Flatweave',
      material: '100% Hand-Spun Wool & Cotton Warp',
      color_family: 'Dusty Rose / Clay / Cream',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      pile_height: '0.2 inches (Flatweave)',
      construction: 'Hand-Woven Pit Loom'
    },
    tags: ['Hand-Woven', 'Flatweave', 'Reversible', 'Rose', 'Bedroom'],
    availableForSale: true,
    rating: 4.7,
    reviewCount: 7,
    createdAt: '2026-02-15'
  },
  {
    id: 'gid://shopify/Product/106',
    handle: 'kashi-organic-jute',
    title: 'Kashi Organic Jute',
    subtitle: 'Hand-Braided Natural Jute Runner in Earthy Sand',
    description: 'Sustainably harvested golden jute fibers braided by hand in Uttar Pradesh. Brings organic grounding texture, heavy durability, and natural golden hues.',
    collection: {
      title: 'Hand-Woven Jute',
      handle: 'hand-woven-jute',
      accentColor: '#3F9196'
    },
    priceRange: {
      minVariantPrice: { amount: '450.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '1200.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-kj-1',
      url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=85',
      altText: 'Kashi Organic Jute Rug'
    },
    images: [
      {
        id: 'img-kj-1',
        url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=85',
        altText: 'Kashi Jute View',
        type: 'primary'
      }
    ],
    options: [{ name: 'Size', values: ["3' x 10' Runner", "6' x 9'", "8' x 10'"] }],
    variants: [
      {
        id: 'var-kj-8x10',
        title: "8' x 10' / Natural Jute",
        price: { amount: '850.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10'"
      }
    ],
    metafields: {
      technique: 'Hand-Braided & Woven',
      material: '100% Natural Organic Jute',
      color_family: 'Natural Sand / Golden Hemp',
      origin_region: 'Uttar Pradesh, India',
      pile_height: '0.45 inches',
      construction: 'Hand-Braided'
    },
    tags: ['Jute', 'Natural Fiber', 'Organic', 'Entryway', 'Living Room'],
    availableForSale: true,
    rating: 4.9,
    reviewCount: 22,
    createdAt: '2026-01-10'
  },
  {
    id: 'gid://shopify/Product/107',
    handle: 'ganges-pebble-loop',
    title: 'Ganges Pebble Loop',
    subtitle: 'High-Low Artisan Loop Rug in Un-Dyed Natural Wool',
    description: 'Inspired by the rounded pebbles along the Ganges River, this rug utilizes variable high-low un-cut wool loops for an extraordinary tactile sensory experience.',
    collection: {
      title: 'The Artisan Loop Collection',
      handle: 'the-artisan-loop-collection',
      accentColor: '#49201B'
    },
    priceRange: {
      minVariantPrice: { amount: '1600.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '3800.00', currencyCode: 'USD' }
    },
    featuredImage: {
      id: 'img-gp-1',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
      altText: 'Ganges Pebble Loop Rug Texture'
    },
    images: [
      {
        id: 'img-gp-1',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
        altText: 'Ganges Pebble Loop Primary',
        type: 'primary'
      }
    ],
    options: [{ name: 'Size', values: ["6' x 9'", "8' x 10'", "9' x 12'"] }],
    variants: [
      {
        id: 'var-gp-8x10',
        title: "8' x 10' / Natural Cream",
        price: { amount: '2400.00', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: "8' x 10'" }],
        dimensions: "8' x 10'"
      }
    ],
    metafields: {
      technique: 'High-Low Un-Cut Loop',
      material: '100% Un-Dyed Organic Indian Wool',
      color_family: 'Natural Off-White / Pebble Gray',
      origin_region: 'Bhadohi, Uttar Pradesh, India',
      pile_height: '0.65 inches',
      construction: 'Hand-Tufted Loop'
    },
    tags: ['Loop', 'Textured', 'Un-Dyed', 'Wool', 'Luxury'],
    availableForSale: true,
    rating: 5.0,
    reviewCount: 11,
    createdAt: '2026-02-05'
  }
];

export const MOCK_JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'j-1',
    slug: 'the-living-craft-of-bhadohi',
    title: 'The Living Craft of Bhadohi: Uttar Pradesh’s Rug Capital',
    excerpt: 'Deep inside the carpet belt of northern India, generations of master weavers preserve a heritage of knotting that has adorned global spaces for centuries.',
    content: `Bhadohi, a historic district nestled in Uttar Pradesh near the sacred banks of the Ganges, has long earned its legacy as India's "Carpet City." Here, rug weaving is not merely an industry; it is a shared cultural rhythm passed down through family lineages...`,
    category: 'Heritage',
    author: 'Editorial Team',
    publishedAt: '2026-02-20',
    readTime: '6 min read',
    image: {
      id: 'j-img-1',
      url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1200&q=85',
      altText: 'Bhadohi hand knotting loom'
    },
    tags: ['Bhadohi', 'Craftsmanship', 'Heritage', 'Hand-Knotted']
  },
  {
    id: 'j-2',
    slug: 'wool-vs-jute-vs-silk-guide',
    title: 'Understanding Materiality: Wool, Jute & Silk in Luxury Interiors',
    excerpt: 'Selecting the right fiber is the single most important decision when specifying a rug. We analyze pile resilience, light response, and tactile warmth.',
    content: `When selecting a handcrafted rug, understanding materiality dictates both longevity and ambiance. Wool provides unmatched elasticity and stain resistance; Jute delivers raw organic grounding; Silk introduces luminous highlights...`,
    category: 'Materials',
    author: 'Design Studio',
    publishedAt: '2026-02-12',
    readTime: '8 min read',
    image: {
      id: 'j-img-2',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      altText: 'Natural textile fibers'
    },
    tags: ['Materials', 'Wool', 'Jute', 'Interior Design']
  },
  {
    id: 'j-3',
    slug: 'the-7-stages-of-hand-knotting',
    title: 'From Raw Yarn to Heirloom: The 7 Stages of Master Hand-Knotting',
    excerpt: 'Trace the 14-week journey of an Oushak rug from yarn sorting and vegetable dyeing to the final shear and sun washing.',
    content: `A single hand-knotted rug contains upwards of one million individual knots. Step inside the 7 meticulously executed stages of production...`,
    category: 'Craft',
    author: 'Master Weaver Collective',
    publishedAt: '2026-01-28',
    readTime: '7 min read',
    image: {
      id: 'j-img-3',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      altText: 'Yarn dyeing and preparation'
    },
    tags: ['Craft', 'Process', 'Dyeing', 'Knotting']
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Evelyn St. Clair',
    location: 'London, UK',
    rating: 5,
    date: 'February 14, 2026',
    title: 'An absolute centerpiece in our living room',
    content: 'The Desert Loom in Terracotta is even more mesmerizing in person. The abrash variations give it such depth. You can feel the weight of genuine Bhadohi craftsmanship underfoot.',
    productHandle: 'desert-loom-oushak',
    productTitle: 'Desert Loom (Knotted)',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    location: 'New York, NY',
    rating: 5,
    date: 'January 28, 2026',
    title: 'Unmatched texture and understated luxury',
    content: 'Ordered the Ganges Pebble Loop for our penthouse library. The high-low loop structure feels incredible barefoot. Delivered seamlessly to Manhattan in protective custom casing.',
    productHandle: 'ganges-pebble-loop',
    productTitle: 'Ganges Pebble Loop',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    author: 'Clara Dupuis',
    location: 'Paris, France',
    rating: 5,
    date: 'January 10, 2026',
    title: 'Exquisite color density and wool quality',
    content: 'The Anatolian Heritage rug has transformed our dining room. The indigo dye changes softly from daylight to evening illumination.',
    productHandle: 'anatolian-heritage',
    productTitle: 'Anatolian Heritage',
    verifiedPurchase: true
  }
];
