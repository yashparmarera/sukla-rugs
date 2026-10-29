import React from 'react';
import Link from 'next/link';
import { ConsentButton } from '@/components/consent/ConsentButton';
import type { LegalSeeAlso } from '@/lib/legal/shared';

const ITEM_CLASS =
  'text-[var(--sukla-terracotta)] hover:text-[var(--sukla-terracotta-dark)] hover:underline underline-offset-4 text-left uppercase tracking-[0.1em] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

/** Related-policy links and consent controls after a section. UI chrome: never part of the owner's text. */
export const LegalSeeAlsoLinks: React.FC<{ items?: LegalSeeAlso[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <p className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-xs">
      {items.map((item) =>
        'href' in item ? (
          <Link key={item.label} href={item.href} className={ITEM_CLASS}>
            {item.label} &rarr;
          </Link>
        ) : (
          <ConsentButton key={item.label} mode={item.consentAction} className={ITEM_CLASS}>
            {item.label} &rarr;
          </ConsentButton>
        )
      )}
    </p>
  );
};
