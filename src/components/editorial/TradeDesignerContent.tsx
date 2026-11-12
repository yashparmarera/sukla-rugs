'use client';

import React, { useState } from 'react';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface TradeDesignerContentProps {
  /** Heading tag for the title. /trade uses h1; /contact uses h2 under its own h1. */
  headingAs?: 'h1' | 'h2';
  /** Show the trade membership application form. Off on /contact to avoid two competing forms. */
  showApplication?: boolean;
}

export function TradeDesignerContent({ headingAs = 'h1', showApplication = true }: TradeDesignerContentProps) {
  const [submitted, setSubmitted] = useState(false);
  const [company, setCompany] = useState('');
  const Heading = headingAs;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    trackEvent('trade_enquiry', { company });
  };

  return (
    <>
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <KnotGlyph size="md" className="text-[var(--sukla-terracotta)]" />
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe)] font-sans block">
          Architects & Interior Designers
        </span>
        <Heading className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--sukla-charcoal)]">
          SUKLA Trade Program
        </Heading>
        <p className="font-sans text-base md:text-lg text-[var(--sukla-charcoal)]/75 leading-relaxed">
          Exclusive net pricing, custom strike-off swatches, and dedicated project management for accredited interior designers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] space-y-2">
          <span className="block heading text-lg">Exclusive Trade Net Pricing</span>
          <p className="text-xs font-sans text-[var(--sukla-charcoal)]/80">Tiered net pricing across all standard collections and custom orders.</p>
        </div>
        <div className="p-6 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] space-y-2">
          <span className="block heading text-lg">Complimentary Strike-Off Swatches</span>
          <p className="text-xs font-sans text-[var(--sukla-charcoal)]/80">12x12 inch hand-woven strike-off memos delivered within 10 days for client approval.</p>
        </div>
        <div className="p-6 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] space-y-2">
          <span className="block heading text-lg">Dedicated Loom Concierge</span>
          <p className="text-xs font-sans text-[var(--sukla-charcoal)]/80">Direct communication with our Bhadohi loom manager for progress updates.</p>
        </div>
      </div>

      {showApplication && (
        <div className="bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] p-8 sm:p-12 shadow-subtle space-y-6">
          <h2 className="display-lg text-2xl text-[var(--sukla-charcoal)]">
            Apply for Trade Membership
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-sans flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Trade application submitted successfully! Our account team will verify your credentials and send your trade login code within 12 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Design Firm / Studio Name *"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Reseller ID / Tax ID *"
                  className="bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  placeholder="Professional Email *"
                  className="bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Direct Phone Number"
                  className="bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" fullWidth size="lg">
                Submit Trade Application
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
