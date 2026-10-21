'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { SHOP_MENU } from '@/lib/shop-menu';

interface ShopMobileMenuProps {
  onNavigate: () => void;
}

/** Mobile drawer Shop section: the same SHOP_MENU groups as a one-open-at-a-time accordion. */
export const ShopMobileMenu: React.FC<ShopMobileMenuProps> = ({ onNavigate }) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <span className="eyebrow block text-[10px] text-[var(--sukla-taupe)]">Shop</span>
      <Link href="/shop" onClick={onNavigate} className="block font-semibold">
        All Rugs
      </Link>
      <div className="border-t border-[var(--sukla-muted-border)]">
        {SHOP_MENU.map((column) => {
          const expanded = openGroup === column.id;
          const listId = `shop-mobile-${column.id}`;
          return (
            <div key={column.id} className="border-b border-[var(--sukla-muted-border)]">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={listId}
                onClick={() => setOpenGroup(expanded ? null : column.id)}
                className="flex w-full min-h-11 items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.14em]"
              >
                {column.heading}
                <ChevronDown
                  aria-hidden="true"
                  className={`w-4 h-4 text-[var(--sukla-charcoal)]/70 transition-transform motion-reduce:transition-none ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expanded && (
                <ul id={listId} className="pb-2">
                  {column.items.map((entry) => (
                    <li key={entry.label}>
                      <Link
                        href={entry.href}
                        onClick={onNavigate}
                        className={`block py-2.5 pl-3 text-xs ${entry.param ? '' : 'font-semibold'}`}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
