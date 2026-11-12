import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeDesignerContent } from '@/components/editorial/TradeDesignerContent';
import { ContactForm } from '@/components/editorial/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | SUKLA RUGS',
  description:
    'Contact SUKLA RUGS by WhatsApp, phone or email, and learn about our trade program for architects and interior designers.'
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--sukla-ivory)]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <h1 className="sr-only">Contact Us</h1>
        <div className="editorial-container max-w-4xl mx-auto space-y-16">
          <TradeDesignerContent headingAs="h2" showApplication={false} />
          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
