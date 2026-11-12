'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CountrySelector } from '@/components/navigation/CountrySelector';
import { AboutMegaMenu } from '@/components/navigation/AboutMegaMenu';
import { ShopMegaMenu } from '@/components/navigation/ShopMegaMenu';
import { GuidesMegaMenu } from '@/components/navigation/GuidesMegaMenu';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { getLocalCart } from '@/lib/shopify/local-cart';
import { useWishlist } from '@/components/providers/WishlistProvider';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // Empty on the server and during hydration, so the badge only appears after mount.
  const { ids: wishlistIds } = useWishlist();
  const wishlistCount = wishlistIds.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cart = getLocalCart();
    setCartCount(cart.totalQuantity);

    const handleCartUpdate = (e: CustomEvent) => {
      setCartCount(e.detail.totalQuantity || 0);
      if (e.detail.totalQuantity > 0) {
        setCartOpen(true);
      }
    };

    window.addEventListener('sukla:cart-updated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('sukla:cart-updated', handleCartUpdate as EventListener);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="hidden md:block bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)] py-2 px-4 text-center text-[11px] font-sans uppercase tracking-[0.1em] border-b border-white/10 relative z-40">
        <div className="editorial-container flex justify-between items-center">
          <span className="hidden md:inline text-[var(--sukla-taupe)]"><span className="nums">10%</span> cashback on first purchase</span>
          <span>Complimentary Global White-Glove Delivery on orders over <span className="nums">$2,500</span></span>
          <span className="hidden md:inline text-[var(--sukla-taupe)]">AUTHENTIC HANDCRAFTED LUXURY</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--sukla-ivory)]/95 backdrop-blur-md border-b border-[var(--sukla-muted-border)] py-2 shadow-subtle'
            : 'bg-[var(--sukla-ivory)] border-b border-[var(--sukla-muted-border)]/60 py-2'
        }`}
      >
        <div className="editorial-container flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 lg:gap-6 xl:gap-10">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[var(--sukla-charcoal)] p-1 hover:text-[var(--sukla-terracotta)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo - Left */}
          <Link href="/" aria-label="Sukla Rugs home" className="flex shrink-0 items-center gap-2 md:gap-3">
            <Image
              src="/images/visual-mark/visualmark.png"
              alt=""
              width={2000}
              height={2000}
              priority
              className="h-11 w-11 md:h-12 md:w-12 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap font-display text-sm min-[400px]:text-base md:text-xl tracking-[0.16em] md:tracking-[0.22em] font-medium text-[var(--sukla-charcoal)] uppercase">
                SUKLA RUGS
              </span>
              <span className="mt-1 hidden sm:block text-[9px] uppercase tracking-[0.3em] text-[var(--sukla-taupe)] font-sans">
                Bhadohi • India
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center whitespace-nowrap space-x-4 xl:space-x-8 text-[13px] xl:text-sm font-sans tracking-[0.01em] text-[var(--sukla-charcoal)]">
            
            {/* SHOP mega menu */}
            <ShopMegaMenu />

            {/* ABOUT US mega menu */}
            <AboutMegaMenu />

            {/* GUIDES mega menu (same behaviour as Shop) */}
            <GuidesMegaMenu />

            {/* SERVICES */}
            <Link href="/customisation" className="hover-underline-animation font-medium text-[var(--sukla-terracotta)]">
              Customisation
            </Link>

            <Link href="/contact" className="hover-underline-animation font-medium">
              Contact Us
            </Link>
          </nav>
          </div>

          <div className="flex shrink-0 items-center space-x-1.5 sm:space-x-5 text-[var(--sukla-charcoal)]">
            {/* Country and currency. In the mobile menu on small screens. */}
            <div className="hidden sm:block">
              <CountrySelector />
            </div>

            <Link
              href="/wishlist"
              className="p-1.5 hover:text-[var(--sukla-terracotta)] transition-colors relative"
              aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}` : 'Wishlist'}
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                // Hidden from assistive tech: the count is already in the link's label.
                <span
                  aria-hidden="true"
                  className="nums absolute -top-1 -right-1 bg-[var(--sukla-terracotta)] text-white text-[9px] font-bold min-w-4 h-4 px-[3px] rounded-full flex items-center justify-center"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="p-1.5 hover:text-[var(--sukla-terracotta)] transition-colors hidden sm:block"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="p-1.5 hover:text-[var(--sukla-terracotta)] transition-colors relative"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="nums absolute -top-1 -right-1 bg-[var(--sukla-terracotta)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <MobileMenu onClose={() => setMobileMenuOpen(false)} onOpenCart={() => setCartOpen(true)} cartCount={cartCount} />
      )}

      {/* Global Drawers & Modals */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
