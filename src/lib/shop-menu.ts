/**
 * SUKLA RUGS shop menu: single source of truth for the desktop mega menu
 * (ShopMegaMenu) and the mobile accordion (ShopMobileMenu).
 *
 * Every href targets /shop and reuses the query params that /shop already
 * understands (collection, material, construction, room) plus `style`.
 * The menu only describes navigation. It does not claim that any product
 * matches; /shop decides that from real Shopify data (see shop-filters.ts).
 */

export type ShopFilterKey = 'style' | 'room' | 'construction' | 'material' | 'collection';

export interface ShopMenuItem {
  label: string;
  href: string;
  /** Query param this item sets. Absent for "View All Rugs". */
  param?: ShopFilterKey;
  /** Query value this item sets. Absent for "View All Rugs". */
  value?: string;
}

export interface ShopMenuColumn {
  id: string;
  heading: string;
  items: ShopMenuItem[];
}

export const SHOP_ROOT_HREF = '/shop';

/** Build a /shop href for one filter. Values are slugs, encoded defensively. */
export function shopHref(param: ShopFilterKey, value: string): string {
  return `${SHOP_ROOT_HREF}?${param}=${encodeURIComponent(value)}`;
}

function item(label: string, param: ShopFilterKey, value: string): ShopMenuItem {
  return { label, href: shopHref(param, value), param, value };
}

export const SHOP_MENU: readonly ShopMenuColumn[] = [
  {
    id: 'style',
    heading: 'Style',
    items: [
      item('Traditional', 'style', 'traditional'),
      item('Modern', 'style', 'modern'),
      item('Contemporary', 'style', 'contemporary'),
      item('Abstract', 'style', 'abstract'),
      item('Minimalist', 'style', 'minimalist'),
      item('Neutral', 'style', 'neutral')
    ]
  },
  {
    id: 'room',
    heading: 'Room',
    items: [
      item('Living Room', 'room', 'living-room'),
      item('Bedroom', 'room', 'bedroom'),
      item('Dining Room', 'room', 'dining-room')
    ]
  },
  {
    id: 'construction',
    heading: 'Construction',
    items: [
      item('Hand Knotted', 'construction', 'hand-knotted'),
      item('Hand Tufted', 'construction', 'hand-tufted'),
      item('Hand Woven', 'construction', 'hand-woven'),
      item('Handloom', 'construction', 'handloom')
    ]
  },
  {
    id: 'material',
    heading: 'Material',
    items: [
      item('Wool', 'material', 'wool'),
      item('Silk', 'material', 'silk'),
      item('Jute', 'material', 'jute')
    ]
  },
  {
    id: 'area-rugs',
    heading: 'Area Rugs',
    items: [
      item('Bestseller', 'collection', 'bestseller'),
      item('Runners', 'collection', 'runners'),
      item('Premium Rugs', 'collection', 'premium-rugs'),
      item('Round Rugs', 'collection', 'round-rugs'),
      item('Shaped Rugs', 'collection', 'shaped-rugs'),
      { label: 'View All Rugs', href: SHOP_ROOT_HREF }
    ]
  }
];

/**
 * Collection handles used by the Area Rugs column. These are assumptions the
 * store owner must confirm or create in Shopify Admin.
 */
export const MENU_COLLECTION_HANDLES: readonly string[] = SHOP_MENU.flatMap((column) =>
  column.items.filter((entry) => entry.param === 'collection' && entry.value).map((entry) => entry.value as string)
);

export function isMenuCollection(handle: string): boolean {
  return MENU_COLLECTION_HANDLES.includes(handle);
}

export interface ShopFilterOption {
  label: string;
  value: string;
}

/** One filter group (a menu column that sets a query param) for the /shop filter bar. */
export interface ShopFilterGroup {
  id: string;
  heading: string;
  param: ShopFilterKey;
  /** Label of the first option, which clears the param. */
  allLabel: string;
  options: ShopFilterOption[];
}

/** Wording of the "clear" option per menu column. Not catalogue data. */
const ALL_OPTION_LABELS: Readonly<Record<string, string>> = {
  style: 'All Styles',
  room: 'All Rooms',
  construction: 'All Constructions',
  material: 'All Materials',
  'area-rugs': 'All Rugs'
};

/**
 * Filter groups for the /shop filter bar, derived from SHOP_MENU so the bar
 * and the mega menu can never drift. Items without a param ("View All Rugs")
 * are not options; they are represented by the group's "all" option.
 */
export const SHOP_FILTER_GROUPS: readonly ShopFilterGroup[] = SHOP_MENU.flatMap((column) => {
  const options = column.items.flatMap((entry) =>
    entry.param && entry.value ? [{ label: entry.label, value: entry.value }] : []
  );
  const param = column.items.find((entry) => entry.param)?.param;
  if (!param || options.length === 0) return [];
  return [{ id: column.id, heading: column.heading, param, allLabel: ALL_OPTION_LABELS[column.id] ?? `All ${column.heading}`, options }];
});

/** Menu label for a filter value, or undefined when it is not a menu item. */
export function findMenuItem(param: ShopFilterKey, value: string): ShopMenuItem | undefined {
  for (const column of SHOP_MENU) {
    const match = column.items.find((entry) => entry.param === param && entry.value === value);
    if (match) return match;
  }
  return undefined;
}
