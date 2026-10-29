/**
 * Short policy summaries reused on the product page, the custom-size
 * calculator and the cart drawer. Each line restates existing policy text
 * (source quoted above it) and links to the full page. No new claims.
 */

export interface PolicyHighlight {
  text: string;
  linkLabel: string;
  href: string;
}

/** PDP "Shipping & returns" fallback, shown only when Shopify has no shipping/refund policy. */
export const SHIPPING_RETURNS_HIGHLIGHTS: PolicyHighlight[] = [
  {
    // source (FAQ, "How long does international shipping take?"): "For ready-to-ship rugs, international
    // delivery typically takes 6–12 business days once dispatched from our facility in India."
    text: 'For ready-to-ship rugs, international delivery typically takes 6–12 business days once dispatched from our facility in India.',
    linkLabel: 'Shipping FAQ',
    href: '/shipping#shipping-and-delivery'
  },
  {
    // source (FAQ, "Can I return an international order?"): "Standard non-custom rugs can be returned within
    // our return window (typically 14–30 days), provided they are unused and in original packaging."
    // Wording set by the owner (2026-10-28 update): no fixed day count on the PDP.
    text: 'Returns accepted on standard, non-custom rugs within the return window, unused and in original packaging.',
    linkLabel: 'Return policy',
    href: '/returns'
  },
  {
    // source (FAQ, "Can I return an international order?"): "Custom-made pieces are non-returnable unless defective."
    text: 'Custom-made pieces are non-returnable unless defective.',
    linkLabel: 'Non-returnable items',
    href: '/returns#non-returnable-items'
  },
  {
    // source (FAQ, "Are import duties and taxes included in the product price?"): "International customers are
    // responsible for paying any applicable duties, taxes, and import charges upon delivery."
    text: 'International customers are responsible for paying any applicable duties, taxes, and import charges upon delivery.',
    linkLabel: 'Customs & duties',
    href: '/shipping#customs-duties-and-taxes'
  }
];

/** Calculator note. source: FAQ "Custom-made pieces are non-returnable unless defective." and Returns §6. */
export const CUSTOM_SIZE_RETURNS_NOTE = {
  text: 'Custom-size rugs are made to order and are non-returnable unless defective.',
  href: '/returns#non-returnable-items'
} as const;

/** Cart drawer line. source: FAQ "...paying any applicable duties, taxes, and import charges upon delivery." */
export const CART_DUTIES_NOTE = {
  text: 'Import duties and taxes are paid on delivery.',
  linkLabel: 'See shipping & customs.',
  href: '/shipping#customs-duties-and-taxes'
} as const;

/** Cart drawer summary row (owner update 2026-10-28; replaces "Taxes & Duties: Calculated at checkout"). */
export const CART_DUTIES_ROW = {
  label: 'Import duties & taxes',
  value: 'Paid on delivery',
  href: '/shipping#customs-duties-and-taxes'
} as const;
