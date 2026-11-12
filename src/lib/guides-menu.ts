import { LEGAL_PAGES } from '@/lib/legal/shared';

/**
 * SUKLA RUGS "Guides" menu: single source of truth for the desktop
 * GuidesMegaMenu and the mobile drawer. Policies reuse the footer's list.
 */
export interface GuidesMenuColumn {
  id: string;
  heading: string;
  items: { label: string; href: string }[];
}

export const GUIDES_ROOT_HREF = '/guides/rug-care';

export const GUIDES_MENU: readonly GuidesMenuColumn[] = [
  // Policies first (left), Guides second (right), per owner request.
  { id: 'policies', heading: 'Policies', items: LEGAL_PAGES },
  {
    id: 'guides',
    heading: 'Guides',
    items: [
      { label: 'Rug Care & Maintenance', href: '/guides/rug-care' },
      { label: 'Blogs', href: '/journal' }
    ]
  }
];
