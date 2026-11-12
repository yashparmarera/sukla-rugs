'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_TEL, whatsappUrl } from '@/lib/contact';

type Fields = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\-\s\d]{7,20}$/;

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = 'Please enter your name.';
  if (!f.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(f.email.trim())) errors.email = 'Please enter a valid email address.';
  if (f.phone.trim() && !PHONE_PATTERN.test(f.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (!f.message.trim()) errors.message = 'Please enter a message.';
  else if (f.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  return errors;
}

const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_URL || 'https://formspree.io/f/mzeevkwq';
const ENQUIRY_TYPES = ['General enquiry', 'Trade & Designer', 'Custom rug', 'Order support'];

const FIELD_KEYS: Record<string, keyof Fields> = { name: 'name', email: 'email', _replyto: 'email', phone: 'phone', message: 'message' };
type FormspreeError = { field?: string; code?: string; message?: string };
const inputClass =
  'w-full bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] p-2.5 text-sm font-sans text-[var(--sukla-charcoal)] focus:outline-none focus:border-[var(--sukla-charcoal)]';
const errorClass = 'mt-1 text-xs font-sans text-red-700';

export function ContactForm({ children }: { children?: React.ReactNode }) {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', phone: '', message: '' });
  const [enquiryType, setEnquiryType] = useState(ENQUIRY_TYPES[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<{ text: string; fallback: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSent(false);
    setFormError(null);
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = new FormData();
    const clean = (v: string) => v.replace(/\s+/g, ' ').trim();
    const name = clean(fields.name);
    const email = fields.email.trim();
    const phone = clean(fields.phone);
    data.append('Enquiry type', enquiryType);
    data.append('Name', name);
    data.append('Email', email);
    data.append('Phone', phone || 'Not provided');
    data.append('Message', fields.message.trim());
    data.append('Submitted from page', window.location.origin + window.location.pathname);
    data.append('_replyto', email);
    const subject = `New ${enquiryType} enquiry from ${name} | SUKLA RUGS`;
    data.append('_subject', subject.length > 100 ? subject.slice(0, 97).trimEnd() + '...' : subject);
    data.append('_gotcha', (e.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value ?? '');

    setSending(true);
    try {
      const res = await fetch(FORMSPREE_URL, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        trackEvent('contact_handoff', {});
        setSent(true);
        setFields({ name: '', email: '', phone: '', message: '' });
        setEnquiryType(ENQUIRY_TYPES[0]);
        setErrors({});
        return;
      }
      let list: FormspreeError[] = [];
      try {
        const json = await res.json();
        if (Array.isArray(json?.errors)) list = json.errors;
      } catch {
        /* non-JSON error body */
      }
      const fieldErrors: Errors = {};
      const general: string[] = [];
      for (const err of list) {
        const key = FIELD_KEYS[(err.field ?? '').toLowerCase()];
        if (key) fieldErrors[key] = err.message || 'Please check this field.';
        else if (err.message) general.push(err.message);
      }
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0 && general.length === 0) {
        setFormError({ text: 'Please correct the highlighted fields and try again.', fallback: false });
      } else {
        setFormError({ text: general.join(' ') || 'Sorry, we could not send your message. Please try again.', fallback: true });
      }
    } catch {
      setFormError({ text: 'We could not reach the server. Please check your connection and try again.', fallback: true });
    } finally {
      setSending(false);
    }
  };
  return (
    <section aria-labelledby="contact-form-heading" className="space-y-8">
      <div className="text-center space-y-3">
        <h2 id="contact-form-heading" className="display-lg text-2xl sm:text-3xl text-[var(--sukla-charcoal)]">
          Send Us a Message
        </h2>
        <p className="font-sans text-sm text-[var(--sukla-charcoal)]/75">
          Send us your enquiry and we will reply by email. You can also call, email or message us on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-sans text-sm">
        <a href={PHONE_TEL} className="p-4 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] hover:border-[var(--sukla-charcoal)]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[var(--sukla-taupe)]">Phone</span>
          <span className="nums">{PHONE_DISPLAY}</span>
        </a>
        <a href={EMAIL_HREF} className="p-4 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] hover:border-[var(--sukla-charcoal)]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[var(--sukla-taupe)]">Email</span>
          {EMAIL}
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] hover:border-[var(--sukla-charcoal)]"
        >
          <span className="block text-xs uppercase tracking-[0.2em] text-[var(--sukla-taupe)]">WhatsApp</span>
          Chat with us
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] shadow-subtle">
        <div className="min-w-0 p-6 sm:p-8">
        <div aria-live="polite" role="status">
          {sent && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-sans flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Thank you. Your message has been sent and we will reply by email soon.</span>
            </div>
          )}
        </div>
        <div aria-live="assertive" role="alert">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-900 text-xs font-sans">
              <p>{formError.text}</p>
              {formError.fallback && (
                <p className="mt-2">
                  You can also reach us on{' '}
                  <a className="underline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>{' '}
                  or at{' '}
                  <a className="underline" href={EMAIL_HREF}>
                    {EMAIL}
                  </a>
                  .
                </p>
              )}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <div>
            <label htmlFor="contact-name" className="block mb-1 text-xs uppercase tracking-[0.15em] font-sans">Name *</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={fields.name}
              onChange={update('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={inputClass}
            />
            {errors.name && <p id="contact-name-error" className={errorClass}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="contact-email" className="block mb-1 text-xs uppercase tracking-[0.15em] font-sans">Email *</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={update('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={inputClass}
            />
            {errors.email && <p id="contact-email-error" className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="contact-phone" className="block mb-1 text-xs uppercase tracking-[0.15em] font-sans">Phone (optional)</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={update('phone')}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
              className={inputClass}
            />
            {errors.phone && <p id="contact-phone-error" className={errorClass}>{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="contact-message" className="block mb-1 text-xs uppercase tracking-[0.15em] font-sans">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              rows={3}
              value={fields.message}
              onChange={update('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={inputClass}
            />
            {errors.message && <p id="contact-message-error" className={errorClass}>{errors.message}</p>}
          </div>
          <div>
            <label htmlFor="contact-enquiry-type" className="block mb-1 text-xs uppercase tracking-[0.15em] font-sans">Enquiry type</label>
            <select
              id="contact-enquiry-type"
              name="enquiry_type"
              value={enquiryType}
              onChange={(e) => setEnquiryType(e.target.value)}
              className={inputClass}
            >
              {ENQUIRY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="contact-gotcha">Leave this field empty</label>
            <input id="contact-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <Button type="submit" variant="primary" fullWidth size="md" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
        </div>

        <div className="relative hidden md:block min-h-[20rem] bg-[#F6F4EE]">
          <Image
            src="/images/custom-page/grid2.jpg"
            alt="Illustration of designers gathered around a table reviewing rug sketches and swatches"
            fill
            unoptimized
            loading="eager"
            sizes="50vw"
            className="object-contain object-center"
          />
        </div>
      </div>

      {children && <div className="space-y-8 pt-8">{children}</div>}
    </section>
  );
}
