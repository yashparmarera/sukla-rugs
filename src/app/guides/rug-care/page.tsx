import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { ShieldAlert, Sparkles, RefreshCw, Sun } from 'lucide-react';

export const metadata = {
  title: 'Rug Care & Maintenance Guide | SHUKLA RUGS',
  description: 'Learn how to care for hand-knotted wool, silk, and jute rugs. Vacuuming, stain emergency steps, shedding, rotation, and professional cleaning.'
};

export default function RugCareGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--shukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--shukla-taupe)] font-sans block">
              Longevity & Preservation
            </span>
            <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--shukla-charcoal)]">
              Rug Care &amp; Maintenance Guide
            </h1>
            <p className="font-serif italic text-base md:text-lg text-[var(--shukla-charcoal)]/80 max-w-2xl mx-auto">
              A handcrafted rug in natural wool or jute is built to age gracefully over decades. Simple routine care ensures perpetual beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <ShieldAlert className="w-8 h-8 text-[var(--shukla-terracotta)]" />
              <h3 className="heading text-lg">Emergency Spill Protocol</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                <strong>1. Blot immediately:</strong> Use a clean, dry white cotton towel to absorb liquid. Never rub or scrub violently, which damages pile fibers.<br/>
                <strong>2. Dilute carefully:</strong> For coffee or wine, press with mild soapy lukewarm water. Work from the outer edge inward.<br/>
                <strong>3. Dry thoroughly:</strong> Elevate the wet section to allow air circulation underneath.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <Sparkles className="w-8 h-8 text-amber-700" />
              <h3 className="heading text-lg">Vacuuming Guidelines</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                Vacuum high-traffic areas weekly using suction-only mode. <strong>Disable the rotating beater bar</strong> to prevent pulling yarn loops or fringe edges.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <RefreshCw className="w-8 h-8 text-emerald-700" />
              <h3 className="heading text-lg">Rotation &amp; Wear Distribution</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                Rotate your rug 180 degrees every 6 months to ensure uniform wear from foot traffic and balanced light exposure from windows.
              </p>
            </div>

            <div className="p-8 bg-[var(--shukla-cream)] border border-[var(--shukla-muted-border)] space-y-4">
              <Sun className="w-8 h-8 text-blue-700" />
              <h3 className="heading text-lg">Shedding &amp; Initial Break-In</h3>
              <p className="text-xs font-sans text-[var(--shukla-charcoal)]/80 leading-relaxed">
                All high-grade hand-spun wool rugs shed loose staple fibers during the first 4-8 weeks. This is completely natural and stops as the pile settles.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
