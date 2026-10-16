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
    <div className={`p-6 border border-[var(--sukla-muted-border)] text-center bg-[var(--sukla-cream)]/50 backdrop-blur-xs transition-all duration-300 hover:border-[var(--sukla-taupe)] ${className}`}>
      <span className="block text-xs uppercase tracking-widest text-[var(--sukla-taupe)] font-sans mb-2">
        {label}
      </span>
      <span className="nums block text-2xl md:text-3xl font-light text-[var(--sukla-charcoal)] mb-1 tracking-tight">
        {value}
      </span>
      {sublabel && (
        <span className="block text-xs font-serif italic text-[var(--sukla-charcoal)]/70">
          {sublabel}
        </span>
      )}
    </div>
  );
};
