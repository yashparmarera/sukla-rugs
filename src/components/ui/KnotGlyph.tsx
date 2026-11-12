import React from 'react';
import Image from 'next/image';

interface KnotGlyphProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Kept for backwards compatibility. The brand visual mark is a fixed-colour image, so this has no effect. */
  color?: string;
}

/**
 * Brand ornament. Renders the SUKLA visual mark (public/images/visual-mark/visualmark.png).
 * The image is square with empty space above and below the mark, so the box is sized by width.
 * Callers that pass `text-white` (marks on dark photography) get the mark inverted to white.
 */
export const KnotGlyph: React.FC<KnotGlyphProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  const onDark = /(^|\s)text-white(\s|$)/.test(className);

  return (
    <Image
      src="/images/visual-mark/visualmark.png"
      alt=""
      aria-hidden="true"
      width={64}
      height={64}
      className={`inline-block object-contain ${sizeMap[size]} ${onDark ? 'invert' : ''} ${className}`}
    />
  );
};
