'use client';

import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';
import { User, Package, MapPin, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <User className="w-8 h-8 text-[var(--sukla-terracotta)] mx-auto" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe)] font-sans block">
              Shopify Customer Account
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl text-[var(--sukla-charcoal)]">
              Client Portal
            </h1>
          </div>

          {!isLoggedIn ? (
            <div className="bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] p-8 sm:p-12 max-w-md mx-auto space-y-6 shadow-subtle">
              <h2 className="heading text-lg text-center">Sign In to Your Account</h2>
              <p className="text-xs font-sans text-[var(--sukla-charcoal)]/80 text-center">
                Enter your email address to access your order history, delivery tracking, and saved address book.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
                <Button type="submit" variant="primary" fullWidth size="md">
                  Continue with Shopify Account
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] p-8 shadow-subtle">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--sukla-muted-border)]">
                <div>
                  <h2 className="heading text-lg">Welcome back</h2>
                  <span className="text-xs font-sans text-[var(--sukla-taupe)]">{email}</span>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-rose-700 hover:underline"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

              <div className="space-y-4">
                <div className="eyebrow flex items-center gap-2 text-sm text-[var(--sukla-charcoal)]">
                  <Package className="w-4 h-4 text-[var(--sukla-terracotta)]" /> Order History
                </div>
                <div className="p-6 bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] text-center text-xs font-sans text-[var(--sukla-taupe)]">
                  No orders have been placed yet under {email}.
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
