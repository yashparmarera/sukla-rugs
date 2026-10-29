import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqDocumentData } from '@/lib/legal/shared';
import { LegalPageShell } from './LegalPageShell';
import { LegalText } from './LegalText';
import { LegalSeeAlsoLinks } from './LegalSeeAlsoLinks';

/**
 * The shipping FAQ: one section per heading, each question a native
 * <details>/<summary> (keyboard operable with Enter and Space, no script).
 * The source has no Effective Date line, so none is shown.
 */
export const FaqDocument: React.FC<{ doc: FaqDocumentData }> = ({ doc }) => (
  <LegalPageShell
    kicker={doc.kicker}
    title={doc.title}
    showEffectiveDate={false}
    currentHref={doc.href}
    toc={doc.groups.map((g) => ({ id: g.id, label: g.title }))}
  >
    <div className="space-y-12">
      {doc.groups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`} className="scroll-mt-28 space-y-2">
          <h2 id={`${g.id}-heading`} data-legal-text className="heading text-xl md:text-2xl text-[var(--sukla-charcoal)]">
            {g.title}
          </h2>
          <div className="border-t border-[var(--sukla-muted-border)]">
            {g.items.map((item) => (
              <details key={item.id} id={item.id} className="group scroll-mt-28 border-b border-[var(--sukla-muted-border)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]">
                  <span data-legal-text className="heading text-base text-[var(--sukla-charcoal)]">
                    {item.question}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-[var(--sukla-taupe)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <p data-legal-text className="pb-5">
                  <LegalText text={item.answer} />
                </p>
              </details>
            ))}
          </div>
          <div className="pt-3">
            <LegalSeeAlsoLinks items={g.seeAlso} />
          </div>
        </section>
      ))}
    </div>
  </LegalPageShell>
);
