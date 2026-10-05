'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { Button } from '@/components/ui/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)] pt-20 pb-12 border-t border-white/10">
      <div className="editorial-container">
        
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <KnotGlyph size="md" className="text-[var(--shukla-terracotta)]" />
              <span className="font-display text-2xl tracking-[0.22em] uppercase font-medium">
                SUKLA RUGS
              </span>
            </div>
            <p className="font-serif italic text-lg text-[var(--shukla-taupe-light)] max-w-md">
              &quot;Every rug tells a story. Handcrafted in Bhadohi, Uttar Pradesh — designed for living spaces around the world.&quot;
            </p>
            <div className="text-xs font-sans text-white/60 space-y-1">
              <p>Craft Workshop: Bhadohi Carpet Belt, Uttar Pradesh 221401, India</p>
              <p>Client Concierge: concierge@shuklarugs.com | +1 (800) 480-7847</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 lg:pl-12">
            <h4 className="eyebrow text-xs text-[var(--shukla-terracotta)]">
              The Sukla Journal &amp; Private Inquiries
            </h4>
            <p className="text-xs font-sans text-[var(--shukla-ivory)]/70 leading-relaxed">
              Subscribe to receive private previews of new loom releases, artisan narratives, and bespoke design guides.
            </p>
            
            {subscribed ? (
              <div className="p-4 bg-white/5 border border-[var(--shukla-terracotta)] text-xs font-sans text-white flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--shukla-terracotta)]" />
                <span>Thank you. You have been added to the SUKLA RUGS private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-xs font-sans text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--shukla-terracotta)] transition-colors"
                />
                <Button type="submit" variant="terracotta" size="sm">
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-white/10 text-xs font-sans">
          
          {/* Col 1: Shop */}
          <div className="space-y-4">
            <h5 className="eyebrow text-[var(--shukla-terracotta)] text-[11px]">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Handcrafted Rugs</Link></li>
              <li><Link href="/collections/hand-knotted-oushak" className="hover:text-white transition-colors">Hand-Knotted Oushak</Link></li>
              <li><Link href="/collections/persian-hand-tufted" className="hover:text-white transition-colors">Persian Hand-Tufted</Link></li>
              <li><Link href="/collections/modern-hand-tufted" className="hover:text-white transition-colors">Modern Hand-Tufted</Link></li>
              <li><Link href="/collections/hand-woven-rugs" className="hover:text-white transition-colors">Hand-Woven Rugs</Link></li>
              <li><Link href="/collections/the-artisan-loop-collection" className="hover:text-white transition-colors">The Artisan Loop</Link></li>
              <li><Link href="/collections/hand-woven-jute" className="hover:text-white transition-colors">Hand-Woven Jute</Link></li>
            </ul>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-4">
            <h5 className="eyebrow text-[var(--shukla-terracotta)] text-[11px]">
              Discover &amp; Heritage
            </h5>
            <ul className="space-y-2.5 text-white/70">
              <li><Link href="/story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/process" className="hover:text-white transition-colors">7 Craft Stages</Link></li>
              <li><Link href="/artisans" className="hover:text-white transition-colors">Artisans of Bhadohi</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition-colors">Sustainability & Ethics</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">The Journal</Link></li>
            </ul>
          </div>

          {/* Col 3: Services & Guides */}
          <div className="space-y-4">
            <h5 className="eyebrow text-[var(--shukla-terracotta)] text-[11px]">
              Services &amp; Guides
            </h5>
            <ul className="space-y-2.5 text-white/70">
              <li><Link href="/find-your-rug" className="hover:text-white transition-colors font-medium text-white">Find Your Rug Quiz</Link></li>
              <li><Link href="/design-consultation" className="hover:text-white transition-colors">Design Consultation</Link></li>
              <li><Link href="/guides/rug-size" className="hover:text-white transition-colors">Rug Size Placement Guide</Link></li>
              <li><Link href="/guides/rug-care" className="hover:text-white transition-colors">Rug Care & Stain Removal</Link></li>
              <li><Link href="/custom-rugs" className="hover:text-white transition-colors">Bespoke Rug Projects</Link></li>
              <li><Link href="/trade" className="hover:text-white transition-colors">Trade & Designer Program</Link></li>
            </ul>
          </div>

          {/* Col 4: International Markets & Guarantees */}
          <div className="space-y-4">
            <h5 className="eyebrow text-[var(--shukla-terracotta)] text-[11px]">
              Global Markets
            </h5>
            <p className="text-white/70 leading-relaxed">
              Servicing interior designers, private residences, and architecture firms across United States, Canada, United Kingdom, European Union, Australia, and UAE.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] nums text-white/50">
              <span className="px-2 py-1 bg-white/5 border border-white/10">USD ($)</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10">EUR (â‚¬)</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10">GBP (Â£)</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10">CAD ($)</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10">AED</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-sans text-white/50 space-y-4 md:space-y-0">
          <p><span className="nums">Â© {new Date().getFullYear()}</span> SUKLA RUGS. All rights reserved. Handcrafted in Bhadohi, India.</p>
          <div className="flex space-x-6">
            <span>Shopify Headless Commerce</span>
            <span>WCAG 2.1 AA Accessible</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
