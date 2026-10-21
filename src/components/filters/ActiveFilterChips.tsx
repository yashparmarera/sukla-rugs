import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { describeFilter, type ShopFilters } from '@/lib/shop-filters';

interface ActiveFilterChipsProps {
  filters: ShopFilters;
  /** Validated color slug, if any (color is not a menu filter but is shown for clarity). */
  color?: string;
  /** Raw /shop search params, so removing one chip keeps the others. */
  searchParams: Partial<Record<string, string | string[] | undefined>>;
}

const CHIP_ORDER = ['style', 'room', 'construction', 'material', 'collection'] as const;

function hrefWithout(searchParams: ActiveFilterChipsProps['searchParams'], key: string): string {
  const next = new URLSearchParams();
  for (const [name, raw] of Object.entries(searchParams)) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (name === key || !value) continue;
    next.set(name, value);
  }
  const query = next.toString();
  return query ? `/shop?${query}` : '/shop';
}

/** Server-rendered chips. Each one is a plain link that removes a single filter. */
export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({ filters, color, searchParams }) => {
  const chips = [
    ...CHIP_ORDER.flatMap((key) => {
      const value = filters[key];
      return value ? [{ key, ...describeFilter(key, value) }] : [];
    }),
    ...(color ? [{ key: 'color', ...describeFilter('color', color) }] : [])
  ];

  if (chips.length === 0) return null;

  return (
    <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2 my-6 font-sans text-xs">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={hrefWithout(searchParams, chip.key)}
            aria-label={`Remove filter ${chip.keyLabel}: ${chip.label}`}
            className="inline-flex items-center gap-2 border border-[var(--sukla-charcoal)]/30 bg-[var(--sukla-cream)] px-3 py-1.5 text-[var(--sukla-charcoal)] hover:border-[var(--sukla-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
          >
            <span>
              {chip.keyLabel}: {chip.label}
            </span>
            <X aria-hidden="true" className="w-3 h-3" />
          </Link>
        </li>
      ))}
    </ul>
  );
};
