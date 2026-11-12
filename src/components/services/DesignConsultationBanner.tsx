import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DesignConsultationBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-[var(--sukla-sand)]/60 border-y border-[var(--sukla-muted-border)]">
      <div className="editorial-container">
        <div className="text-center lg:text-left md:bg-[var(--sukla-ivory)] md:border md:border-[var(--sukla-muted-border)] p-0 md:p-16 md:shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs uppercase tracking-[0.25em] text-[var(--sukla-terracotta)] font-sans">
              <Compass className="w-4 h-4" />
              <span>Custom Rugs &amp; Design Guidance</span>
            </div>

            <h2 className="display-lg text-2xl sm:text-3xl md:text-4xl text-[var(--sukla-charcoal)]">
              Looking for a Rug Made Just for You?
            </h2>

            <p className="font-sans text-base sm:text-lg text-[var(--sukla-charcoal)]/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Share your size, colours and ideas, and our Bhadohi artisans will design and handcraft a rug to fit your space, with guidance at every step.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-end">
            <Button href="/customisation" variant="primary" size="md">
              <span>Book Design Consultation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};
