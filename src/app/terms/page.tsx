import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { PolicyDocument } from '@/components/legal/PolicyDocument';
import { TERMS_AND_CONDITIONS } from '@/lib/legal/terms';

export const metadata: Metadata = {
  title: 'Terms & Conditions | SUKLA RUGS',
  description:
    'The terms that apply when you use suklarugs.com and purchase Sukla Rugs products, including pricing, shipping, returns and liability.'
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />
      <PolicyDocument doc={TERMS_AND_CONDITIONS} />
      <Footer />
    </div>
  );
}
