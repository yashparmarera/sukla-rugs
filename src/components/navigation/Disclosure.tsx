'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DisclosureProps {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  /** 'root' = large drawer row, 'nested' = compact indented row. */
  size?: 'root' | 'nested';
  children: React.ReactNode;
}

const TRIGGER_CLASS: Record<NonNullable<DisclosureProps['size']>, string> = {
  root: 'px-5 py-4 text-xl',
  nested: 'pl-8 pr-5 py-2.5 text-base'
};

/** Accordion row: a button toggling an inline region with a height transition. */
export const Disclosure: React.FC<DisclosureProps> = ({ id, label, open, onToggle, size = 'root', children }) => {
  const regionId = `${id}-region`;
  return (
    <div>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={regionId}
        onClick={onToggle}
        className={`flex min-h-[44px] w-full items-center justify-between text-left font-light focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)] ${TRIGGER_CLASS[size]}`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`${size === 'root' ? 'h-5 w-5' : 'h-4 w-4'} stroke-[1.5] transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={regionId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
