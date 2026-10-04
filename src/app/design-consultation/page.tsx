'use client';

import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight, Compass } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function DesignConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: 'Living Room',
    dimensions: '',
    stylePreference: 'Traditional Oushak',
    budget: '$2,500 - $5,000',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    trackEvent('consultation_submit', { ...formData });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <Compass className="w-8 h-8 text-[var(--shukla-terracotta)] mx-auto" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Complimentary Concierge
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl text-[var(--shukla-charcoal)]">
              Bespoke Design Consultation
            </h1>
            <p className="font-sans text-base text-[var(--shukla-charcoal)]/75 leading-relaxed">
              Work directly with our Bhadohi textile specialists for spatial rendering, swatch ordering, and custom dimensioning.
            </p>
          </div>

          {submitted ? (
            <div className="p-12 bg-[var(--shukla-cream)] border border-[var(--shukla-terracotta)] text-center space-y-4 shadow-subtle">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="display-lg text-2xl text-[var(--shukla-charcoal)]">
                Consultation Request Received
              </h2>
              <p className="font-sans text-base text-[var(--shukla-charcoal)]/75 leading-relaxed">
                Thank you, {formData.name}. A senior SHUKLA RUGS design concierge will review your architectural requirements and contact you within <span className="nums">24</span> business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] p-8 sm:p-12 space-y-6 shadow-subtle">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-3 text-xs font-sans focus:outline-none focus:border-[var(--shukla-charcoal)]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-3 text-xs font-sans focus:outline-none focus:border-[var(--shukla-charcoal)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
                    Room Type
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Primary Bedroom">Primary Bedroom</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Entryway">Entryway / Hallway</option>
                    <option value="Commercial / Hospitality">Commercial / Hospitality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
                    Target Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                  >
                    <option value="$1,500 - $2,500">$1,500 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+ (Bespoke Project)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
                  Project Notes / Space Details
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share room dimensions, lighting conditions, or color palettes..."
                  className="w-full bg-[var(--shukla-ivory)] border border-[var(--shukla-muted-border)] p-3 text-xs font-sans focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                Submit Consultation Request
              </Button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
