import React from 'react';
import { EMAIL, EMAIL_HREF } from '@/lib/contact';

export const LEGAL_LINK_CLASS =
  'text-[var(--sukla-terracotta)] underline underline-offset-4 hover:text-[var(--sukla-terracotta-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

/** Renders owner text unchanged, turning every occurrence of the business email into a mailto: link. */
export const LegalText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(EMAIL);
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <a href={EMAIL_HREF} className={LEGAL_LINK_CLASS}>
              {EMAIL}
            </a>
          )}
          {part}
        </React.Fragment>
      ))}
    </>
  );
};
