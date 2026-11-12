'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Disclosure } from '@/components/navigation/Disclosure';
import { SHOP_COLLECTION_LINKS, SHOP_MENU, SHOP_ROOT_HREF } from '@/lib/shop-menu';

interface ShopMobileMenuProps {
  onNavigate: () => void;
}

const LINK_CLASS = 'block py-2.5 pl-12 pr-5 text-base font-light';

/**
 * Body of the mobile drawer's Shop dropdown: All Rugs once, then each
 * SHOP_MENU group and the collection links as nested dropdowns.
 */
export const ShopMobileMenu: React.FC<ShopMobileMenuProps> = ({ onNavigate }) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groups = [
    ...SHOP_MENU.map((column) => ({
      id: column.id,
      heading: column.heading,
      // "All Rugs" is shown once at the top, so drop the menu's own root link.
      items: column.items.filter((entry) => entry.href !== SHOP_ROOT_HREF)
    })),
    { id: 'collections', heading: 'Collections', items: SHOP_COLLECTION_LINKS }
  ];

  return (
    <div className="pb-2">
      <Link href={SHOP_ROOT_HREF} onClick={onNavigate} className="block py-2.5 pl-8 pr-5 text-base font-medium">
        All Rugs
      </Link>
      {groups.map((group) => (
        <Disclosure
          key={group.id}
          id={`mobile-shop-${group.id}`}
          label={group.heading}
          size="nested"
          open={openGroup === group.id}
          onToggle={() => setOpenGroup(openGroup === group.id ? null : group.id)}
        >
          <ul>
            {group.items.map((entry) => (
              <li key={entry.href}>
                <Link href={entry.href} onClick={onNavigate} className={LINK_CLASS}>
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </Disclosure>
      ))}
    </div>
  );
};
