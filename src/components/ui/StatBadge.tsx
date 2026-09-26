import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  value,
  sublabel,
  className = ''
}) => {
  return (
    <div className={`p-6 border border-[var(--shukla-muted-border)] text-center bg-[var(--shukla-cream)]/50 backdrop-blur-xs transition-all duration-300 hover:border-[var(--shukla-taupe)] ${className}`}>
      <span className="block text-xs uppercase tracking-widest text-[var(--shukla-taupe)] font-sans mb-2">
        {label}
      </span>
      <span className="block font-display text-2xl md:text-3xl font-normal text-[var(--shukla-charcoal)] mb-1">
        {value}
      </span>
      {sublabel && (
        <span className="block text-xs font-serif italic text-[var(--shukla-charcoal)]/70">
          {sublabel}
        </span>
      )}
    </div>
  );
};
