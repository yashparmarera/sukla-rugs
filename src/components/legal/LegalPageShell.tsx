import React from 'react';
import Link from 'next/link';
import { KnotGlyph } from '@/components/ui/KnotGlyph';
import { LEGAL_EFFECTIVE_DATE, LEGAL_PAGES } from '@/lib/legal/shared';

interface LegalPageShellProps {
  kicker: string;
  title: string;
  showEffectiveDate: boolean;
  toc: { id: string; label: string }[];
  currentHref: string;
  children: React.ReactNode;
}

const NAV_LINK_CLASS =
  'hover:text-[var(--sukla-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

/** Shared layout for the legal and policy pages: header, table of contents, readable article column, related policies. */
export const LegalPageShell: React.FC<LegalPageShellProps> = ({
  kicker,
  title,
  showEffectiveDate,
  toc,
  currentHref,
  children
}) => {
  const related = LEGAL_PAGES.filter((page) => page.href !== currentHref);

  return (
    <main className="flex-1 py-16 md:py-24">
      <div className="editorial-container space-y-12 md:space-y-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <KnotGlyph size="md" className="text-[var(--sukla-terracotta)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--sukla-taupe)] font-sans block">
            {kicker}
          </span>
          <h1 data-legal-text className="display-lg text-3xl sm:text-4xl md:text-5xl text-[var(--sukla-charcoal)] break-words">
            {title}
          </h1>
          {showEffectiveDate && (
            <p data-legal-text className="nums text-sm font-sans text-[var(--sukla-taupe)]">
              Effective Date: <time dateTime={LEGAL_EFFECTIVE_DATE.iso}>{LEGAL_EFFECTIVE_DATE.display}</time>
            </p>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,70ch)] lg:justify-center lg:gap-16">
          <nav
            aria-label="On this page"
            className="self-start bg-[var(--sukla-cream)] border border-[var(--sukla-muted-border)] p-5 lg:bg-transparent lg:border-0 lg:p-0 lg:sticky lg:top-28"
          >
            <p className="eyebrow text-[11px] text-[var(--sukla-taupe)] mb-3">On this page</p>
            <ol className="space-y-2 text-sm font-sans text-[var(--sukla-charcoal)]/80">
              {toc.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`} className={NAV_LINK_CLASS}>
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-[70ch] font-sans text-[15px] md:text-base leading-[1.75] text-[var(--sukla-charcoal)]/85 break-words">
            {children}

            <nav
              aria-label="Related policies"
              className="mt-14 pt-8 border-t border-[var(--sukla-muted-border)]"
            >
              <p className="eyebrow text-[11px] text-[var(--sukla-taupe)] mb-3">Related policies</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {related.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className={`text-[var(--sukla-charcoal)] underline underline-offset-4 ${NAV_LINK_CLASS}`}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
};
