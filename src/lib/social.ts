/**
 * Single source of truth for Sukla Rugs official social media profiles.
 * Do not alter the URLs (including query strings).
 */
export type SocialId = 'instagram' | 'facebook' | 'pinterest';

export type SocialLink = { id: SocialId; label: string; href: string };

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/suklarugs_?exln=c3NoMDBid2FzOWt1' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1JK525UDRM/' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://pin.it/3xCNC02k3' }
];
