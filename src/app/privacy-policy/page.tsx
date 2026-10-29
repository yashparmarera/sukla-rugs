import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { PolicyDocument } from '@/components/legal/PolicyDocument';
import { PRIVACY_POLICY } from '@/lib/legal/privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy | SUKLA RUGS',
  description:
    'How Sukla Rugs collects, uses, shares and protects your personal information when you visit suklarugs.com and purchase our rugs worldwide.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />
      <PolicyDocument doc={PRIVACY_POLICY} />
      <Footer />
    </div>
  );
}
