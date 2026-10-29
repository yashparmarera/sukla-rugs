import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { PolicyDocument } from '@/components/legal/PolicyDocument';
import { RETURN_POLICY } from '@/lib/legal/returns-policy';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | SUKLA RUGS',
  description:
    'Return window, eligibility, defects, international return shipping, non-returnable items and refund processing for Sukla Rugs orders.'
};

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />
      <PolicyDocument doc={RETURN_POLICY} />
      <Footer />
    </div>
  );
}
