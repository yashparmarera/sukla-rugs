import React from 'react';

interface KnotGlyphProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const KnotGlyph: React.FC<KnotGlyphProps> = ({
  className = '',
  size = 'md',
  color = 'currentColor'
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      {/* Triple Diamond Knot Motif */}
      <path
        d="M12 2L16.5 6.5L12 11L7.5 6.5L12 2Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12L11 16.5L6.5 21L2 16.5L6.5 12Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 12L22 16.5L17.5 21L13 16.5L17.5 12Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
