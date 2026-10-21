import React from 'react';
import Image from 'next/image';

interface BrandMarkProps {
  className?: string;
}

/**
 * The SUKLA RUGS visual mark (triple diamond with a line on each side).
 * Decorative: the brand name is always written next to it, so it has no alt text.
 * Size it with a height class (for example `h-3 md:h-4`); the width follows the 448x132 artwork.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ className = '' }) => (
  <Image
    src="/images/visual-mark-sukla.png"
    alt=""
    width={448}
    height={132}
    aria-hidden="true"
    className={`inline-block w-auto shrink-0 ${className}`}
  />
);
