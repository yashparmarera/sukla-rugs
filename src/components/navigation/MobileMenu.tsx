'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, X } from 'lucide-react';
import { CountrySelector } from '@/components/navigation/CountrySelector';
import { Disclosure } from '@/components/navigation/Disclosure';
import { ShopMobileMenu } from '@/components/navigation/ShopMobileMenu';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { ABOUT_MENU } from '@/lib/about-menu';
import { GUIDES_MENU } from '@/lib/guides-menu';

interface MobileMenuProps {
  onClose: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

type PanelId = 'shop' | 'about' | 'guides';

const PANEL_LABELS: Record<PanelId, string> = { shop: 'Shop', about: 'About us', guides: 'Guides' };

/** Routes that exist on the site but are not in the desktop nav. Kept so no route is lost. */
const MORE_LINKS: readonly { label: string; href: string }[] = [
  { label: 'Design Consultation', href: '/design-consultation' },
  { label: 'Trade & Designers Program', href: '/trade' }
];

const ROW_CLASS = 'flex w-full items-center justify-between px-5 py-4 text-left text-xl font-light';

/**
 * Mobile drawer. Shop, About us and Guides are inline dropdowns. Link data comes from the same
 * modules as the desktop mega menus so the two cannot drift.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, onOpenCart, cartCount }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<PanelId | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname === href);

  const plainRow = (href: string, label: string, extra = '') => (
    <Link
      href={href}
      onClick={onClose}
      aria-current={isCurrent(href) ? 'page' : undefined}
      className={`${ROW_CLASS} ${isCurrent(href) ? 'bg-[var(--sukla-sand)]' : ''} ${extra}`}
    >
      {label}
    </Link>
  );

  const dropdown = (id: PanelId, body: React.ReactNode) => (
    <Disclosure
      id={`mobile-${id}`}
      label={PANEL_LABELS[id]}
      open={open === id}
      onToggle={() => setOpen(open === id ? null : id)}
    >
      {body}
    </Disclosure>
  );
  const linkList = (links: readonly { label: string; href: string }[]) => (
    <ul>
      {links.map((entry) => (
        <li key={entry.href}>
          <Link href={entry.href} onClick={onClose} className="block py-2.5 pl-8 pr-5 text-base font-light">
            {entry.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[var(--sukla-ivory)] text-[var(--sukla-charcoal)] font-sans"
    >
      <div className="flex items-center gap-3 border-b border-[var(--sukla-muted-border)] px-4 py-3">
        <button autoFocus type="button" onClick={onClose} aria-label="Close menu" className="p-1">
          <X className="h-6 w-6" />
        </button>
        <Link href="/" onClick={onClose} aria-label="Sukla Rugs home" className="flex min-w-0 items-center gap-2">
          <Image
            src="/images/visual-mark/visualmark.png"
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
            className="h-8 w-8 object-contain"
          />
          <span className="whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.2em]">
            SUKLA RUGS
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCart();
          }}
          aria-label="Open shopping cart"
          className="relative ml-auto p-1.5"
        >
          <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="nums absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sukla-terracotta)] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav aria-label="Main">
          <div className="py-2">
            {plainRow('/', 'Home')}
            {dropdown('shop', <ShopMobileMenu onNavigate={onClose} />)}
            {dropdown('about', <div className="pb-2">{linkList(ABOUT_MENU)}</div>)}
            {dropdown('guides', <div className="pb-2">{linkList(GUIDES_MENU.flatMap((column) => column.items))}</div>)}
            {plainRow('/customisation', 'Customisation')}
            {plainRow('/contact', 'Contact Us')}
            <ul className="pt-2">
              {MORE_LINKS.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    onClick={onClose}
                    className="block px-5 py-2.5 text-sm font-light text-[var(--sukla-charcoal)]/70"
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-5 pt-3">
              <SocialLinks />
            </div>
          </div>

          <div className="mt-10 space-y-1 bg-[var(--sukla-sand)] py-4">
            <Link href="/account" onClick={onClose} className="flex items-center gap-3 px-5 py-3 text-base font-light">
              <User aria-hidden="true" className="h-5 w-5 stroke-[1.5]" />
              Log in
            </Link>
            <div className="px-5 py-1">
              <CountrySelector variant="menu" />
            </div>
          </div>
        </nav>

      </div>
    </div>
  );
};
