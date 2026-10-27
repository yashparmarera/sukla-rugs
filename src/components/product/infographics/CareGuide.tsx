import React from 'react';
import type { CareGuide as CareGuideData } from '@/lib/product-infographics';
import { InfographicIcon } from '@/components/product/infographics/InfographicIcon';

/**
 * Care icons for the steps named in sukla.care_instructions, followed by every
 * instruction line, so details such as frequencies stay readable and no text
 * is lost. Renders nothing when the product has no care instructions.
 */
export const CareGuide: React.FC<{ guide: CareGuideData }> = ({ guide }) => {
  if (guide.lines.length === 0) return null;

  return (
    <div className="space-y-4">
      {guide.icons.length > 0 && (
        <ul role="list" aria-label="Care at a glance" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {guide.icons.map((item) => (
            <li
              key={item.key}
              className="min-w-0 flex items-center gap-2.5 border border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] px-3 py-2.5"
            >
              <InfographicIcon name={item.icon} className="w-6 h-6 text-[var(--sukla-charcoal)]" />
              <span className="min-w-0 break-words text-xs font-sans text-[var(--sukla-charcoal)]">{item.caption}</span>
            </li>
          ))}
        </ul>
      )}
      <ol className="space-y-2 list-none">
        {guide.lines.map((line, index) => (
          <li key={`${index}-${line.text}`}>
            {line.label && <span className="font-medium text-[var(--sukla-charcoal)]">{line.label}: </span>}
            {line.text}
          </li>
        ))}
      </ol>
    </div>
  );
};
