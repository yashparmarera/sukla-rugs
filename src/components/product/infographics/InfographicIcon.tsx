import React from 'react';
import type { IconName } from '@/lib/product-infographics';

/**
 * Hand-drawn 24x24 line icons for the PDP infographics. Same style as
 * KnotGlyph: no fill, currentColor strokes, round caps and joins. Always
 * decorative; the visible label next to each icon carries the meaning.
 */

/** Diagonal "not" stroke used by the prohibition icons. */
const Slash = () => <path d="M4 4l16 16" />;

const ICONS: Record<IconName, React.ReactNode> = {
  // Construction ------------------------------------------------------------
  'construction-hand-knotted': (
    <>
      <path d="M5 3v18M12 3v18M19 3v18" opacity={0.45} />
      <path d="M5 8c2.5 0 3.5 3 7 3s4.5-3 7-3" />
      <path d="M5 15c2.5 0 3.5 3 7 3s4.5-3 7-3" />
      <circle cx="12" cy="11" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
    </>
  ),
  'construction-hand-tufted': (
    <>
      <path d="M3 19h18" />
      <path d="M6 19v-4M9 19v-6M12 19v-4M15 19v-6M18 19v-4" />
      <path d="M14 3l-3.5 9.5" />
      <path d="M12.5 3.5l3 1.1" />
      <circle cx="10.3" cy="13" r="0.6" />
    </>
  ),
  'construction-flatweave': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 10h18M3 14h18" opacity={0.5} />
      <path d="M8 6l-2 4 2 4-2 4M16 6l-2 4 2 4-2 4" />
    </>
  ),
  'construction-handwoven': (
    <>
      <path d="M7 3v18M12 3v18M17 3v18" opacity={0.5} />
      <path d="M3 7c1.5 0 2.5 1.5 4 1.5S9.5 7 12 7s3.5 1.5 5 1.5S19.5 7 21 7" />
      <path d="M3 12c1.5 0 2.5-1.5 4-1.5S9.5 12 12 12s3.5-1.5 5-1.5 2.5 1.5 4 1.5" />
      <path d="M3 17c1.5 0 2.5 1.5 4 1.5S9.5 17 12 17s3.5 1.5 5 1.5S19.5 17 21 17" />
    </>
  ),
  'construction-braided': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" opacity={0.5} />
    </>
  ),
  'construction-generic': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M7 4v16M12 4v16M17 4v16" opacity={0.5} />
      <path d="M3 12h18" />
    </>
  ),

  // Material ----------------------------------------------------------------
  'material-wool': (
    <>
      <path d="M7 18a4 4 0 0 1-.6-7.95A5 5 0 0 1 16 8.5a4.5 4.5 0 0 1 1 9.5H7Z" />
      <path d="M9 14c1-1 2 1 3 0s2 1 3 0" />
    </>
  ),
  'material-jute': (
    <>
      <path d="M12 21V8" />
      <path d="M12 8c-2-1-3-3-3-5 2 0 3 2 3 5ZM12 8c2-1 3-3 3-5-2 0-3 2-3 5Z" />
      <path d="M12 13c-2.5-.5-4-2.5-4.5-4.5 2.5 0 4 2 4.5 4.5ZM12 13c2.5-.5 4-2.5 4.5-4.5-2.5 0-4 2-4.5 4.5Z" />
      <path d="M12 18c-2.5-.5-4-2.5-4.5-4.5 2.5 0 4 2 4.5 4.5ZM12 18c2.5-.5 4-2.5 4.5-4.5-2.5 0-4 2-4.5 4.5Z" />
    </>
  ),
  'material-cotton': (
    <>
      <circle cx="9" cy="10" r="3.5" />
      <circle cx="15" cy="10" r="3.5" />
      <circle cx="12" cy="14.5" r="3.5" />
      <path d="M12 18v3M9.5 19.5 12 21l2.5-1.5" />
    </>
  ),
  'material-silk': (
    <>
      <path d="M3 8c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 13c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 18c3-3 6 3 9 0s6 3 9 0" />
    </>
  ),
  'material-viscose': (
    <>
      <path d="M3 9c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 15c3-3 6 3 9 0s6 3 9 0" />
      <path d="M18 3l.7 1.6L20.3 5l-1.6.7L18 7.3l-.7-1.6L15.7 5l1.6-.4Z" />
    </>
  ),
  'material-generic': (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M5 9c4 1 10 1 14 0M5 15c4-1 10-1 14 0" />
      <path d="M12 4c-2 3-2 13 0 16" />
    </>
  ),

  // Rooms -------------------------------------------------------------------
  'room-living': (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3v-4Z" />
      <path d="M5 17v2M19 17v2" />
    </>
  ),
  'room-bedroom': (
    <>
      <path d="M3 18V7M21 18v-5a2 2 0 0 0-2-2h-8v5" />
      <path d="M3 16h18" />
      <rect x="5" y="11" width="4" height="3" rx="1" />
    </>
  ),
  'room-dining': (
    <>
      <path d="M3 10h18" />
      <path d="M6 10v9M18 10v9" />
      <path d="M9 6v2M12 5v3M15 6v2" />
    </>
  ),
  'room-entry': (
    <>
      <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
      <path d="M3 21h18" />
      <circle cx="15" cy="12" r="0.8" />
    </>
  ),
  'room-kids': (
    <>
      <rect x="4" y="12" width="7" height="7" rx="1" />
      <rect x="13" y="12" width="7" height="7" rx="1" />
      <rect x="8.5" y="4" width="7" height="7" rx="1" />
    </>
  ),
  'room-office': (
    <>
      <path d="M3 10h18M5 10v10M19 10v10" />
      <rect x="8" y="4" width="8" height="6" rx="0.5" />
    </>
  ),
  'room-kitchen': (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M4 9h16" />
      <circle cx="8" cy="6" r="0.8" />
      <circle cx="12" cy="6" r="0.8" />
      <rect x="7" y="12" width="10" height="6" rx="0.5" />
    </>
  ),
  'room-outdoor': (
    <>
      <path d="M12 3 6 12h3l-4 6h14l-4-6h3L12 3Z" />
      <path d="M12 18v3" />
    </>
  ),
  'room-generic': (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),

  // Care --------------------------------------------------------------------
  'care-vacuum': (
    <>
      <path d="M14 3v12" />
      <path d="M14 3h3" />
      <path d="M8 15h10a2 2 0 0 1 2 2v1H6v-1a2 2 0 0 1 2-2Z" />
      <path d="M3 21h18" opacity={0.5} />
    </>
  ),
  'care-no-beater-bar': (
    <>
      <rect x="4" y="9" width="16" height="6" rx="3" />
      <path d="M8 9l-1 6M12 9l-1 6M16 9l-1 6" opacity={0.6} />
      <Slash />
    </>
  ),
  'care-spot-clean': (
    <>
      <circle cx="10" cy="14" r="5" strokeDasharray="2 2" />
      <path d="M15 4l1 2.5L18.5 7.5 16 8.5 15 11l-1-2.5L11.5 7.5 14 6.5Z" />
    </>
  ),
  'care-blot': (
    <>
      <path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9Z" />
      <path d="M4 20h16" />
      <path d="M9 13a3 3 0 0 0 3 3" opacity={0.6} />
    </>
  ),
  'care-no-rub': (
    <>
      <path d="M4 12c2-3 4 3 6 0s4 3 6 0 3 2 4 0" />
      <path d="M6 17h12" opacity={0.5} />
      <Slash />
    </>
  ),
  'care-professional': (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  'care-rotate': (
    <>
      <path d="M20 12a8 8 0 1 1-2.35-5.65" />
      <path d="M20 4v4h-4" />
      <rect x="9" y="9.5" width="6" height="5" rx="0.5" opacity={0.6} />
    </>
  ),
  'care-avoid-sun': (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
      <Slash />
    </>
  ),
  'care-rug-pad': (
    <>
      <path d="M3 10l9-4 9 4-9 4-9-4Z" />
      <path d="M3 14l9 4 9-4" opacity={0.6} />
    </>
  ),
  'care-no-machine-wash': (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 6h2" />
      <Slash />
    </>
  ),
  'care-shake': (
    <>
      <path d="M8 6h8v12H8z" />
      <path d="M4 9c-1 1-1 5 0 6M20 9c1 1 1 5 0 6" />
      <path d="M10 20.5h.01M14 20.5h.01M12 21.5h.01" />
    </>
  ),
  'care-dry-naturally': (
    <>
      <path d="M3 8h18" />
      <path d="M6 8v7c0 1 1 2 2 2h8c1 0 2-1 2-2V8" />
      <path d="M8 3c.5 1 .5 2 0 3M12 3c.5 1 .5 2 0 3M16 3c.5 1 .5 2 0 3" opacity={0.6} />
    </>
  ),
  'care-avoid-water': (
    <>
      <path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9Z" />
      <Slash />
    </>
  ),

  // Measures and facts ------------------------------------------------------
  pile: (
    <>
      <path d="M3 20h18" />
      <path d="M6 20v-6M10 20V9M14 20v-8M18 20v-5" />
      <path d="M6 14c0-1 1-1 1-2M10 9c0-1 1-1 1-2M14 12c0-1 1-1 1-2M18 15c0-1 1-1 1-2" opacity={0.6} />
    </>
  ),
  knots: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" opacity={0.5} />
      <circle cx="6" cy="6" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="18" r="1" />
    </>
  ),
  size: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
    </>
  ),
  origin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  'craft-time': (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" />
    </>
  )
};

interface InfographicIconProps {
  name: IconName;
  className?: string;
}

export const InfographicIcon: React.FC<InfographicIconProps> = ({ name, className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {ICONS[name]}
  </svg>
);
