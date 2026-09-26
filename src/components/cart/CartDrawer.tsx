'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Cart } from '@/types';
import { getLocalCart, updateLocalCartLine, removeFromLocalCartLine } from '@/lib/shopify/local-cart';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 2500;

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    setCart(getLocalCart());

    const handleCartUpdate = (e: CustomEvent<Cart>) => {
      setCart(e.detail);
    };

    window.addEventListener('shukla:cart-updated', handleCartUpdate as EventListener);
    return () => {
      window.removeEventListener('shukla:cart-updated', handleCartUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleUpdateQty = (lineId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    const updated = updateLocalCartLine(lineId, newQty);
    setCart(updated);
  };

  const handleRemoveLine = (lineId: string) => {
    const updated = removeFromLocalCartLine(lineId);
    setCart(updated);
    trackEvent('remove_from_cart', { lineId });
  };

  const handleCheckout = () => {
    trackEvent('begin_checkout', { subtotal, quantity: cart?.totalQuantity });
    if (cart?.checkoutUrl && cart.checkoutUrl !== 'https://checkout.shopify.com') {
      window.location.href = cart.checkoutUrl;
    } else {
      alert('Redirecting to Shopify Secure Checkout... (Live Storefront endpoint active upon setting credentials)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--shukla-ivory)] text-[var(--shukla-charcoal)] shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[var(--shukla-muted-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[var(--shukla-taupe)]" />
              <h2 className="font-display text-lg tracking-wider uppercase">Your Selection</h2>
              <span className="text-xs font-sans bg-[var(--shukla-sand)] px-2 py-0.5 rounded-full font-medium">
                {cart?.totalQuantity || 0}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Incentive */}
          <div className="bg-[var(--shukla-cream)] px-6 py-3 border-b border-[var(--shukla-muted-border)]">
            <div className="flex items-center justify-between text-xs font-sans mb-1.5">
              <span className="flex items-center gap-1.5 text-[var(--shukla-charcoal)] font-medium">
                <Truck className="w-4 h-4 text-[var(--shukla-terracotta)]" />
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toLocaleString('en-US', { minimumFractionDigits: 2 })} for complimentary global shipping`
                  : 'Complimentary White-Glove Global Shipping Unlocked'}
              </span>
            </div>
            <div className="w-full h-1 bg-[var(--shukla-sand)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--shukla-terracotta)] transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!cart || cart.lines.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 stroke-1 text-[var(--shukla-taupe)] mx-auto" />
                <p className="font-serif text-lg italic text-[var(--shukla-charcoal)]/80">
                  Your cart is currently empty.
                </p>
                <p className="text-xs text-[var(--shukla-taupe)] font-sans max-w-xs mx-auto">
                  Explore our handcrafted collections from Bhadohi, UP.
                </p>
                <Button variant="outline" size="sm" onClick={onClose} href="/shop">
                  Discover Rugs
                </Button>
              </div>
            ) : (
              cart.lines.map((line) => (
                <div key={line.id} className="flex gap-4 pb-6 border-b border-[var(--shukla-muted-border)]">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[var(--shukla-cream)] shrink-0 overflow-hidden border border-[var(--shukla-muted-border)]">
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--shukla-sand)]" />
                    )}
                  </div>

                  {/* Info & Quantity Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[var(--shukla-taupe)]">
                            {line.merchandise.product.collection?.title}
                          </span>
                          <Link
                            href={`/products/${line.merchandise.product.handle}`}
                            onClick={onClose}
                            className="font-display text-sm tracking-wide hover:text-[var(--shukla-terracotta)] transition-colors"
                          >
                            {line.merchandise.product.title}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemoveLine(line.id)}
                          className="text-[var(--shukla-taupe)] hover:text-red-700 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-[var(--shukla-charcoal)]/70 font-sans mt-0.5 block">
                        {line.merchandise.title}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Qty Selector */}
                      <div className="flex items-center border border-[var(--shukla-muted-border)] bg-[var(--shukla-cream)]">
                        <button
                          onClick={() => handleUpdateQty(line.id, line.quantity, -1)}
                          className="px-2.5 py-1 text-[var(--shukla-charcoal)] hover:bg-[var(--shukla-sand)] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-sans font-medium">{line.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(line.id, line.quantity, 1)}
                          className="px-2.5 py-1 text-[var(--shukla-charcoal)] hover:bg-[var(--shukla-sand)] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display text-sm font-medium">
                        ${(parseFloat(line.merchandise.price.amount) * line.quantity).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart && cart.lines.length > 0 && (
            <div className="p-6 border-t border-[var(--shukla-muted-border)] bg-[var(--shukla-cream)]/80 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-[var(--shukla-taupe)]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[var(--shukla-charcoal)] font-medium">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-sans text-[var(--shukla-taupe)]">
                  <span>Taxes & Duties</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-display uppercase tracking-wider text-[var(--shukla-charcoal)] font-semibold pt-2 border-t border-[var(--shukla-muted-border)]">
                  <span>Total</span>
                  <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                </div>
              </div>

              <Button variant="primary" fullWidth onClick={handleCheckout} className="group">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--shukla-taupe)] font-sans">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Shopify Encrypted & Guaranteed Authenticity</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
