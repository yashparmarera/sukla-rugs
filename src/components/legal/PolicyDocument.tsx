import React from 'react';
import { EMAIL, EMAIL_HREF, MAILING_ADDRESS } from '@/lib/contact';
import type { LegalBlock, LegalDocument } from '@/lib/legal/shared';
import { LegalPageShell } from './LegalPageShell';
import { LEGAL_LINK_CLASS, LegalText } from './LegalText';
import { LegalSeeAlsoLinks } from './LegalSeeAlsoLinks';

/*
 * Every element carrying the owner's text has `data-legal-text` (used by the
 * text-fidelity check). Navigation, links and buttons added around the text do not.
 */

const Block: React.FC<{ block: LegalBlock }> = ({ block }) => {
  if (block.kind === 'paragraph') {
    return (
      <p data-legal-text>
        <LegalText text={block.text} />
      </p>
    );
  }

  if (block.kind === 'list') {
    return (
      <ul className="list-disc pl-5 space-y-2 marker:text-[var(--sukla-terracotta)]">
        {block.items.map((item) => (
          <li key={item.text} data-legal-text>
            {item.label && (
              <>
                <strong className="font-medium text-[var(--sukla-charcoal)]">{item.label}:</strong>{' '}
              </>
            )}
            <LegalText text={item.text} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-1">
      {block.email && (
        <p data-legal-text>
          Email:{' '}
          <a href={EMAIL_HREF} className={LEGAL_LINK_CLASS}>
            {EMAIL}
          </a>
        </p>
      )}
      {block.mailingAddress && (
        <address data-legal-text className="not-italic">
          Mailing Address: {MAILING_ADDRESS}
        </address>
      )}
    </div>
  );
};

/** A numbered policy (Privacy, Cookie, Terms, Returns) rendered from its data module. */
export const PolicyDocument: React.FC<{ doc: LegalDocument }> = ({ doc }) => {
  const hasIntro = Boolean(doc.intro && doc.intro.length > 0);
  return (
  <LegalPageShell
    kicker={doc.kicker}
    title={doc.title}
    showEffectiveDate
    currentHref={doc.href}
    toc={doc.sections.map((s) => ({ id: s.id, label: `${s.number}. ${s.title}` }))}
  >
    {hasIntro && (
      <div className="space-y-4 pb-10 border-b border-[var(--sukla-muted-border)]">
        {doc.intro?.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    )}

    <div>
      {doc.sections.map((s, index) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-heading`}
          className={`scroll-mt-28 space-y-4 pb-10 last:pb-0 ${
            index === 0 ? (hasIntro ? 'pt-10' : '') : 'pt-10 border-t border-[var(--sukla-muted-border)]'
          }`}
        >
          <h2 id={`${s.id}-heading`} data-legal-text className="heading text-xl md:text-2xl text-[var(--sukla-charcoal)]">
            <span className="nums text-[var(--sukla-terracotta)]">{s.number}.</span> {s.title}
          </h2>
          {s.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} />
          ))}
          <LegalSeeAlsoLinks items={s.seeAlso} />
        </section>
      ))}
    </div>
  </LegalPageShell>
  );
};
