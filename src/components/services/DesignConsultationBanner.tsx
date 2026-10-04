import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DesignConsultationBanner: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--shukla-sand)]/60 border-y border-[var(--shukla-muted-border)]">
      <div className="editorial-container">
        <div className="bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-8 sm:p-12 md:p-16 shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--shukla-terracotta)] font-sans">
              <Compass className="w-4 h-4" />
              <span>Complimentary Concierge & Trade Services</span>
            </div>

            <h2 className="display-lg text-2xl sm:text-3xl md:text-4xl text-[var(--shukla-charcoal)]">
              Need Assistance Specifying the Perfect Rug?
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-[var(--shukla-charcoal)]/80 max-w-2xl">
              Whether you require custom dimensions, swatch samples, or room scale recommendations, our Bhadohi design specialists guide your selection step-by-step.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-end">
            <Button href="/design-consultation" variant="primary" size="md">
              <span>Book Design Consultation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Link
              href="/find-your-rug"
              className="inline-flex items-center justify-center border border-[var(--shukla-charcoal)] px-6 py-3.5 text-xs font-sans uppercase tracking-[0.18em] text-[var(--shukla-charcoal)] hover:bg-[var(--shukla-charcoal)] hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[var(--shukla-terracotta)]" />
              Take 60-Sec Rug Quiz
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
