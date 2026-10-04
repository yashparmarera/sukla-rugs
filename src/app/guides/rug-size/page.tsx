'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';
import { Layout, Check, Info } from 'lucide-react';

const ROOM_GUIDES = {
  living: {
    title: 'Living Room Placement',
    description: 'The rug acts as the grounding anchor for your seating arrangement.',
    options: [
      {
        size: "8' x 10'",
        rule: 'Front Legs On',
        detail: 'All front legs of your sofa and accent chairs rest comfortably on the outer 6-8 inches of the rug. Ideal for medium to large living rooms (12’ x 15’).'
      },
      {
        size: "9' x 12'",
        rule: 'All Legs On',
        detail: 'The sofa, coffee table, and all accent seating fit entirely within the rug boundary with 8-12 inches of rug extending beyond furniture backs. Ideal for spacious open-plan rooms.'
      },
      {
        size: "6' x 9'",
        rule: 'Coffee Table Only',
        detail: 'Only the coffee table sits on the rug while seating floats outside. Best suited for compact apartments or defined seating nooks.'
      }
    ]
  },
  bedroom: {
    title: 'Bedroom Placement',
    description: 'Create warm, luxurious landing zones barefoot each morning.',
    options: [
      {
        size: "8' x 10'",
        rule: 'Queen Bed Frame',
        detail: 'Position perpendicular under the bottom two-thirds of a Queen bed, leaving 24-36 inches of plush wool rug flanking both sides.'
      },
      {
        size: "9' x 12'",
        rule: 'King Bed Frame',
        detail: 'Extends under King bed frame and nightstands, providing a grand 3-foot perimeter around the entire bed base.'
      },
      {
        size: "3' x 10' (Pair)",
        rule: 'Flanking Runners',
        detail: 'Place twin runners along both sides of the bed if you prefer leaving exposed hardwood floors under the bed frame.'
      }
    ]
  },
  dining: {
    title: 'Dining Room Placement',
    description: 'Ensure chairs remain on the rug even when pulled out for dining.',
    options: [
      {
        size: "8' x 10'",
        rule: '6-Seater Table',
        detail: 'Allows at least 24 inches of rug space extending beyond all table edges so chair legs stay flat when guests sit down.'
      },
      {
        size: "9' x 12'",
        rule: '8-10 Seater Table',
        detail: 'Generous perimeter accommodating large dining tables with end armchairs without catching chair legs on edges.'
      }
    ]
  }
};

export default function RugSizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'living' | 'bedroom' | 'dining'>('living');
  const activeGuide = ROOM_GUIDES[activeTab];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Architectural Dimensioning
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              Interactive Rug Size Guide
            </h1>
            <p className="font-serif italic text-base md:text-lg text-[var(--shukla-charcoal)]/80 max-w-2xl mx-auto">
              Selecting the ideal proportions is essential for spatial harmony. Follow our room placement standards below.
            </p>
          </div>

          {/* Room Selector Tabs */}
          <div className="flex justify-center border-b border-[var(--shukla-muted-border)] text-xs font-sans uppercase tracking-widest gap-4">
            <button
              onClick={() => setActiveTab('living')}
              className={`pb-4 px-6 font-semibold border-b-2 transition-all ${
                activeTab === 'living'
                  ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                  : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
              }`}
            >
              Living Room
            </button>
            <button
              onClick={() => setActiveTab('bedroom')}
              className={`pb-4 px-6 font-semibold border-b-2 transition-all ${
                activeTab === 'bedroom'
                  ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                  : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
              }`}
            >
              Bedroom
            </button>
            <button
              onClick={() => setActiveTab('dining')}
              className={`pb-4 px-6 font-semibold border-b-2 transition-all ${
                activeTab === 'dining'
                  ? 'border-[var(--shukla-charcoal)] text-[var(--shukla-charcoal)]'
                  : 'border-transparent text-[var(--shukla-taupe)] hover:text-[var(--shukla-charcoal)]'
              }`}
            >
              Dining Room
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="space-y-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-8 sm:p-12 shadow-subtle">
            <div className="space-y-2">
              <h2 className="display-lg text-2xl text-[var(--shukla-charcoal)]">
                {activeGuide.title}
              </h2>
              <p className="font-serif italic text-sm text-[var(--shukla-charcoal)]/80">
                {activeGuide.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {activeGuide.options.map((opt) => (
                <div key={opt.size} className="p-6 bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] space-y-3">
                  <span className="nums block text-xl font-semibold text-[var(--shukla-charcoal)]">
                    {opt.size}
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-[var(--shukla-terracotta)] font-sans font-semibold">
                    {opt.rule}
                  </span>
                  <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                    {opt.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 text-xs font-sans text-amber-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Designer Tip:</strong> When in doubt, scale up! A larger rug makes a room feel expansive, whereas an undersized rug shrinks visual perception.
              </span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button href="/shop" variant="primary" size="lg">
              Shop All Sizes in Stock
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
