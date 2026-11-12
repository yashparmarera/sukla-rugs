'use client';

import React, { useId, useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

/**
 * Collapsible rows; any number may be open, all closed by default.
 * Panel content stays in the DOM (SEO) and is hidden from view, tab order and
 * assistive tech while collapsed via `visibility: hidden`.
 */
export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (items.length === 0) return null;

  return (
    <div className={`border-t border-[var(--sukla-muted-border)] ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-[var(--sukla-muted-border)]">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-[15px] uppercase tracking-[0.12em] text-[var(--sukla-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]"
              >
                <span>{item.title}</span>
                <span
                  data-accordion-icon={isOpen ? 'minus' : 'plus'}
                  aria-hidden="true"
                  className="relative block h-4 w-4 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr] visible' : 'grid-rows-[0fr] invisible'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-6 text-sm font-sans leading-relaxed text-[var(--sukla-charcoal)]/80">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
