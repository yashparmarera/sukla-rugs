'use client';

import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data';
import { Product } from '@/types';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function FindYourRugPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    room: '',
    style: '',
    color: '',
    size: '',
    material: ''
  });
  const [results, setResults] = useState<Product[] | null>(null);

  const handleSelectOption = (key: keyof typeof answers, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Calculate deterministic rule-based matches
      calculateMatches(updated);
    }
  };

  const calculateMatches = (finalAnswers: typeof answers) => {
    let filtered = [...MOCK_PRODUCTS];

    if (finalAnswers.style) {
      const st = finalAnswers.style.toLowerCase();
      filtered = filtered.filter(
        (p) => p.collection.handle.includes(st) || p.tags.some((t) => t.toLowerCase().includes(st))
      );
    }

    if (finalAnswers.material) {
      const mat = finalAnswers.material.toLowerCase();
      filtered = filtered.filter((p) => p.metafields.material?.toLowerCase().includes(mat));
    }

    if (filtered.length === 0) {
      filtered = MOCK_PRODUCTS.slice(0, 3);
    }

    setResults(filtered.slice(0, 3));
    trackEvent('filter', { quizAnswers: finalAnswers });
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ room: '', style: '', color: '', size: '', material: '' });
    setResults(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              60-Second Recommendation Finder
            </span>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[var(--shukla-charcoal)]">
              Find Your Ideal Rug
            </h1>
            <p className="font-serif italic text-base text-[var(--shukla-charcoal)]/80">
              Answer 5 architectural questions to receive tailored recommendations from our Bhadohi inventory.
            </p>
          </div>

          {/* Quiz Container */}
          {!results ? (
            <div className="bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-8 sm:p-12 shadow-subtle space-y-8">
              
              {/* Progress Bar */}
              <div className="flex justify-between items-center text-xs font-sans text-[var(--shukla-taupe)]">
                <span>Step {step} of 5</span>
                <span className="font-mono">{step * 20}% Complete</span>
              </div>
              <div className="w-full h-1 bg-[var(--shukla-sand)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--shukla-terracotta)] transition-all duration-300"
                  style={{ width: `${step * 20}%` }}
                />
              </div>

              {/* Step 1: Room */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    1. Which room are you specifying for?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Living Room', 'Primary Bedroom', 'Dining Room', 'Entryway / Hallway'].map((rm) => (
                      <button
                        key={rm}
                        onClick={() => handleSelectOption('room', rm)}
                        className="p-5 text-left border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-ivory)] transition-all text-xs font-sans font-semibold uppercase tracking-wider"
                      >
                        {rm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Style */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    2. What aesthetic direction best defines your space?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Traditional & Vintage Oushak', value: 'oushak' },
                      { label: 'Intricate Persian Heritage', value: 'persian' },
                      { label: 'Modern & Architectural Minimalist', value: 'modern' },
                      { label: 'Organic Earthy & Textural Loop', value: 'loop' }
                    ].map((st) => (
                      <button
                        key={st.value}
                        onClick={() => handleSelectOption('style', st.value)}
                        className="p-5 text-left border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-ivory)] transition-all text-xs font-sans font-semibold uppercase tracking-wider"
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Color */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    3. What primary color palette do you prefer?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Terracotta & Warm Clay', 'Indigo & Slate Blue', 'Olive & Earthy Green', 'Neutral Sand & Off-White'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleSelectOption('color', c)}
                        className="p-5 text-left border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-ivory)] transition-all text-xs font-sans font-semibold uppercase tracking-wider"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Size */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    4. What dimension fits your room footprint?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["6' x 9'", "8' x 10'", "9' x 12'", "Runner / Custom"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handleSelectOption('size', sz)}
                        className="p-5 text-left border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-ivory)] transition-all text-xs font-sans font-semibold uppercase tracking-wider"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Material */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    5. What tactile materiality do you seek?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['New Zealand Hand-Spun Wool', 'Wool & Silk Blend', 'High-Low Un-Cut Loop', 'Natural Organic Jute'].map((m) => (
                      <button
                        key={m}
                        onClick={() => handleSelectOption('material', m)}
                        className="p-5 text-left border border-[var(--shukla-muted-border)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-ivory)] transition-all text-xs font-sans font-semibold uppercase tracking-wider"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-[var(--shukla-muted-border)] pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--shukla-terracotta)]" />
                  <h2 className="font-display text-2xl uppercase tracking-wider text-[var(--shukla-charcoal)]">
                    Your Curated Matches
                  </h2>
                </div>
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--shukla-terracotta)] hover:underline font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
