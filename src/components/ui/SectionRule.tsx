import React from 'react';
import { KnotGlyph } from './KnotGlyph';

interface SectionRuleProps {
  className?: string;
  withGlyph?: boolean;
}

export const SectionRule: React.FC<SectionRuleProps> = ({
  className = '',
  withGlyph = true
}) => {
  return (
    <div className={`w-full flex items-center justify-center my-12 md:my-20 ${className}`}>
      <div className="h-[1px] bg-[var(--shukla-muted-border)] flex-grow" />
      {withGlyph && (
        <div className="px-6 text-[var(--shukla-taupe)]">
          <KnotGlyph size="sm" />
        </div>
      )}
      <div className="h-[1px] bg-[var(--shukla-muted-border)] flex-grow" />
    </div>
  );
};
