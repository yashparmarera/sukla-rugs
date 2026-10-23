'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { PHONE_TEL, whatsappUrl } from '@/lib/contact';

/**
 * "Talk to our Expert" card for the product detail purchase panel.
 *
 * Renders immediately after the add-to-cart controls so it reads as part of
 * the buy area. Offers exactly two contact actions — a direct phone call and a
 * WhatsApp chat — both sourced from the single contact.ts source of truth.
 * There is deliberately no "Book an appointment" action.
 *
 * Both buttons use color-only transitions, so no reduced-motion handling is
 * required. The inline WhatsApp glyph mirrors WhatsAppFloat.tsx, since
 * lucide-react has no official WhatsApp icon.
 */
export const TalkToExpert: React.FC = () => {
  return (
    <section
      aria-labelledby="talk-to-expert-heading"
      className="border border-[var(--sukla-muted-border)] p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h2
            id="talk-to-expert-heading"
            className="eyebrow text-xs font-semibold uppercase tracking-wider text-[var(--sukla-charcoal)]"
          >
            Talk to our Expert
          </h2>
          <p className="font-sans text-sm leading-relaxed text-[var(--sukla-charcoal)]/70 max-w-prose">
            Our design experts are always at your service to find the perfect rugs for your place.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={PHONE_TEL}
            aria-label="Call our rug expert"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)] transition-colors hover:bg-[var(--sukla-taupe)] focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)] focus:ring-offset-2"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with our rug expert on WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1da851] focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)] focus:ring-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              className="h-6 w-6"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
