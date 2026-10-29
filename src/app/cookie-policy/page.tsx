import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { PolicyDocument } from '@/components/legal/PolicyDocument';
import { COOKIE_POLICY } from '@/lib/legal/cookie-policy';

export const metadata: Metadata = {
  title: 'Cookie Policy | SUKLA RUGS',
  description:
    'How Sukla Rugs uses cookies and similar tracking technologies on suklarugs.com, and how you can control them.'
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />
      <PolicyDocument doc={COOKIE_POLICY} />
      <Footer />
    </div>
  );
}
