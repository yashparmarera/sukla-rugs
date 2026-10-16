'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/navigation/SearchModal';
import { CountrySelector } from '@/components/navigation/CountrySelector';
import { getLocalCart } from '@/lib/shopify/local-cart';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
      <div className="bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)] py-2 px-4 text-center text-[11px] font-sans uppercase tracking-[0.1em] border-b border-white/10 relative z-40">
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
            ? 'bg-[var(--sukla-ivory)]/95 backdrop-blur-md border-b border-[var(--sukla-muted-border)] py-4 shadow-subtle'
            : 'bg-[var(--sukla-ivory)] border-b border-[var(--sukla-muted-border)]/60 py-6'
        }`}
      >
        <div className="editorial-container grid grid-cols-[1fr_auto_1fr] items-center">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[var(--sukla-charcoal)] p-1 hover:text-[var(--sukla-terracotta)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-sans tracking-[0.01em] text-[var(--sukla-charcoal)]">
            
            {/* SHOP Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('shop')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/shop" className="hover-underline-animation flex items-center gap-1 font-medium">
                Shop <ChevronDown className="w-3 h-3 text-[var(--sukla-taupe)] group-hover:rotate-180 transition-transform" />
              </Link>
              {activeDropdown === 'shop' && (
                <div className="absolute top-full left-0 w-72 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] shadow-xl p-6 space-y-3 z-50">
                  <div className="border-b border-[var(--sukla-muted-border)] pb-2 mb-3">
                    <span className="eyebrow text-[10px] text-[var(--sukla-taupe)] block">Collections</span>
                  </div>
                  <Link href="/shop" className="block text-xs hover:text-[var(--sukla-terracotta)] font-semibold">
                    All Rugs
                  </Link>
                  <Link href="/collections/hand-knotted-oushak" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Hand-Knotted Oushak
                  </Link>
                  <Link href="/collections/persian-hand-tufted" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Persian Hand-Tufted
                  </Link>
                  <Link href="/collections/modern-hand-tufted" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Modern Hand-Tufted
                  </Link>
                  <Link href="/collections/hand-woven-rugs" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Hand-Woven Rugs
                  </Link>
                  <Link href="/collections/the-artisan-loop-collection" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    The Artisan Loop
                  </Link>
                  <Link href="/collections/hand-woven-jute" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Hand-Woven Jute
                  </Link>
                </div>
              )}
            </div>

            {/* DISCOVER Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('discover')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/story" className="hover-underline-animation flex items-center gap-1 font-medium">
                Discover <ChevronDown className="w-3 h-3 text-[var(--sukla-taupe)] group-hover:rotate-180 transition-transform" />
              </Link>
              {activeDropdown === 'discover' && (
                <div className="absolute top-full left-0 w-64 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] shadow-xl p-6 space-y-3 z-50">
                  <Link href="/story" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Our Story
                  </Link>
                  <Link href="/process" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Our Craft (7 Stages)
                  </Link>
                  <Link href="/artisans" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Bhadohi Artisans
                  </Link>
                  <Link href="/sustainability" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Sustainability & Ethics
                  </Link>
                </div>
              )}
            </div>

            {/* GUIDES Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('guides')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/guides/rug-size" className="hover-underline-animation flex items-center gap-1 font-medium">
                Guides <ChevronDown className="w-3 h-3 text-[var(--sukla-taupe)] group-hover:rotate-180 transition-transform" />
              </Link>
              {activeDropdown === 'guides' && (
                <div className="absolute top-full left-0 w-64 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] shadow-xl p-6 space-y-3 z-50">
                  <Link href="/guides/rug-size" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Rug Size Guide
                  </Link>
                  <Link href="/guides/rug-care" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    Rug Care & Maintenance
                  </Link>
                  <Link href="/journal" className="block text-xs hover:text-[var(--sukla-terracotta)]">
                    The Journal
                  </Link>
                </div>
              )}
            </div>

            {/* SERVICES */}
            <Link href="/find-your-rug" className="hover-underline-animation font-medium text-[var(--sukla-terracotta)]">
              Find Your Rug
            </Link>
          </nav>

          {/* Brand Logo - Centered Brand Lock */}
          <Link href="/" className="flex min-w-0 flex-col items-center justify-self-center group">
            <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
              <KnotGlyph size="sm" className="text-[var(--sukla-terracotta)] group-hover:rotate-45 transition-transform duration-500" />
              <span className="whitespace-nowrap font-display text-base md:text-xl tracking-[0.16em] md:tracking-[0.22em] font-medium text-[var(--sukla-charcoal)] uppercase">
                SUKLA RUGS
              </span>
              <KnotGlyph size="sm" className="text-[var(--sukla-terracotta)] group-hover:-rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--sukla-taupe)] font-sans -mt-1 hidden sm:block">
              Bhadohi • India
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center justify-self-end space-x-2.5 sm:space-x-5 text-[var(--sukla-charcoal)]">
            <Link
              href="/trade"
              className="hidden xl:inline-block text-sm font-sans tracking-[0.01em] hover:text-[var(--sukla-terracotta)] transition-colors border-b border-transparent hover:border-[var(--sukla-terracotta)] pb-0.5"
            >
              Trade & Designers
            </Link>

            {/* Country and currency. In the mobile menu on small screens. */}
            <div className="hidden sm:block">
              <CountrySelector />
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 hover:text-[var(--sukla-terracotta)] transition-colors"
              aria-label="Open search modal"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

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
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[var(--sukla-ivory)] p-6 overflow-y-auto">
          <div className="flex justify-between items-center pb-6 border-b border-[var(--sukla-muted-border)]">
            <span className="font-display tracking-[0.22em] text-sm uppercase font-medium">SUKLA RUGS</span>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X className="w-6 h-6 text-[var(--sukla-charcoal)]" />
            </button>
          </div>

          <nav className="py-8 space-y-6 text-sm font-sans tracking-[0.01em] text-[var(--sukla-charcoal)]">
            <div className="space-y-3">
              <span className="eyebrow block text-[10px] text-[var(--sukla-taupe)]">Collections</span>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block font-semibold">
                All Rugs
              </Link>
              <Link href="/collections/hand-knotted-oushak" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                Hand-Knotted Oushak
              </Link>
              <Link href="/collections/persian-hand-tufted" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                Persian Hand-Tufted
              </Link>
              <Link href="/collections/modern-hand-tufted" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                Modern Hand-Tufted
              </Link>
              <Link href="/collections/hand-woven-rugs" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                Hand-Woven Rugs
              </Link>
              <Link href="/collections/the-artisan-loop-collection" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                The Artisan Loop
              </Link>
              <Link href="/collections/hand-woven-jute" onClick={() => setMobileMenuOpen(false)} className="block pl-3 text-xs">
                Hand-Woven Jute
              </Link>
            </div>

            <div className="border-t border-[var(--sukla-muted-border)] pt-6 space-y-3">
              <span className="eyebrow block text-[10px] text-[var(--sukla-taupe)]">Discover &amp; Craft</span>
              <Link href="/story" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Our Story
              </Link>
              <Link href="/process" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Our Craft Process
              </Link>
              <Link href="/artisans" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Artisans of Bhadohi
              </Link>
              <Link href="/sustainability" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Sustainability
              </Link>
            </div>

            <div className="border-t border-[var(--sukla-muted-border)] pt-6 space-y-3">
              <span className="eyebrow block text-[10px] text-[var(--sukla-taupe)]">Client Services</span>
              <Link href="/find-your-rug" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-[var(--sukla-terracotta)] font-bold">
                Find Your Rug Quiz
              </Link>
              <Link href="/design-consultation" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Design Consultation
              </Link>
              <Link href="/guides/rug-size" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Rug Size Guide
              </Link>
              <Link href="/guides/rug-care" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Rug Care Guide
              </Link>
              <Link href="/trade" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                Trade & Designers Program
              </Link>
              <Link href="/journal" onClick={() => setMobileMenuOpen(false)} className="block text-xs">
                The Journal
              </Link>
            </div>

            <div className="border-t border-[var(--sukla-muted-border)] pt-6 space-y-3">
              <span className="eyebrow block text-[10px] text-[var(--sukla-taupe)]">Country &amp; currency</span>
              <CountrySelector variant="menu" />
            </div>
          </nav>
        </div>
      )}

      {/* Global Drawers & Modals */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
