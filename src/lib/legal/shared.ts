/**
 * Shared types and constants for the legal and policy pages.
 *
 * Plain module (no `'use client'`, no server-only imports) so server pages,
 * client components (PDP, calculator, cart drawer, consent banner) and the
 * FAQ JSON-LD can all reuse the exact same strings.
 */

/**
 * Effective date of every dated policy. The owner's text had the placeholder
 * "Effective Date: Date"; change the date here only.
 */
export const LEGAL_EFFECTIVE_DATE = { display: '28 October 2026', iso: '2026-10-28' } as const;

/** Anchor id from a heading: lowercase, "&" becomes "and", other non-alphanumeric runs become "-". */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** One list line. A labelled item renders as "<strong>Label:</strong> text". */
export interface LegalListItem {
  label?: string;
  text: string;
}

export type LegalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: LegalListItem[] }
  /** "Email:" line, plus the "Mailing Address:" line when `mailingAddress` is true. */
  | { kind: 'contact'; email: boolean; mailingAddress: boolean };

/** Related link or consent control shown after a section. UI chrome, not owner text. */
export type LegalSeeAlso =
  | { label: string; href: string }
  | { label: string; consentAction: 'preferences' | 'do-not-sell' };

export interface LegalSection {
  id: string;
  number: number;
  title: string;
  blocks: LegalBlock[];
  seeAlso?: LegalSeeAlso[];
}

export interface LegalDocument {
  href: string;
  kicker: string;
  title: string;
  /** Paragraphs between the Effective Date line and section 1. */
  intro?: LegalBlock[];
  sections: LegalSection[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
  seeAlso?: LegalSeeAlso[];
}

export interface FaqDocumentData {
  href: string;
  kicker: string;
  title: string;
  groups: FaqGroup[];
}

/** Footer and "related policies" order. */
export const LEGAL_PAGES: { label: string; href: string }[] = [
  { label: 'Shipping & Customs FAQ', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' }
];

/** Builds a section, deriving the anchor id from its title. */
export function section(
  number: number,
  title: string,
  blocks: LegalBlock[],
  seeAlso?: LegalSeeAlso[]
): LegalSection {
  return { id: slugify(title), number, title, blocks, ...(seeAlso ? { seeAlso } : {}) };
}

export const p = (text: string): LegalBlock => ({ kind: 'paragraph', text });

export const list = (...items: (string | [label: string, text: string])[]): LegalBlock => ({
  kind: 'list',
  items: items.map((item) => (typeof item === 'string' ? { text: item } : { label: item[0], text: item[1] }))
});
