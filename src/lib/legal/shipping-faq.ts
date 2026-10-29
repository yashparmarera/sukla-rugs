/**
 * Sukla Rugs: International Shipping, Customs & Returns FAQ, owner text (2026-10-28).
 * Published verbatim (no edits; the source has no Effective Date line).
 * The page and its FAQPage JSON-LD both render from this module.
 */

import { slugify, type FaqDocumentData, type FaqGroup, type FaqItem } from './shared';

const item = (question: string, answer: string): FaqItem => ({ id: slugify(question), question, answer });

const group = (title: string, items: FaqItem[], seeAlso?: FaqGroup['seeAlso']): FaqGroup => ({
  id: slugify(title),
  title,
  items,
  ...(seeAlso ? { seeAlso } : {})
});

export const SHIPPING_FAQ: FaqDocumentData = {
  href: '/shipping',
  kicker: 'Customer care',
  title: 'Sukla Rugs: International Shipping, Customs & Returns FAQ',
  groups: [
    group('Shipping & Delivery', [
      item(
        'How long does international shipping take?',
        'For ready-to-ship rugs, international delivery typically takes 6–12 business days once dispatched from our facility in India. Custom or made-to-order rugs require a production period of 6–12 weeks before they are shipped.'
      ),
      item(
        'Which carriers do you use for international shipments?',
        'We partner with established international couriers, primarily DHL, FedEx, and UPS International, to ensure secure and traceable delivery worldwide.'
      ),
      item(
        'How do I track my rug?',
        "Once your order is dispatched, you will receive a confirmation email containing your courier tracking number and a direct link to monitor your shipment's progress."
      )
    ]),
    group('Customs, Duties & Taxes', [
      item(
        'Are import duties and taxes included in the product price?',
        "No. International customers are responsible for paying any applicable duties, taxes, and import charges upon delivery. Sukla Rugs does not include these fees at checkout, as they are levied directly by your destination country's government."
      ),
      item(
        'How are customs fees calculated?',
        "Customs authorities determine duties based on the rug's declared value, composition (e.g., wool or jute), and construction method. For example, hand-knotted wool rugs generally fall under different Harmonized Tariff Schedule (HTS) codes (such as HTS 5701.10 for the US) than hand-tufted rugs, which dictates the final duty rate applied by customs."
      ),
      item(
        'What happens if I refuse to pay the customs fees?',
        'If you refuse to pay the required import duties, the courier may return the rug to us or abandon the package. In such cases, any return shipping costs, unpaid duties, and administrative fees will be deducted from your final refund.'
      )
    ]),
    group(
      'Returns & Exchanges',
      [
        item(
          'Can I return an international order?',
          'Standard non-custom rugs can be returned within our return window (typically 14–30 days), provided they are unused and in original packaging. However, the customer is fully responsible for arranging and paying for return international shipping to India, which can be costly due to the weight and dimensions of the rugs. Custom-made pieces are non-returnable unless defective.'
        ),
        item(
          'What is considered a manufacturing defect?',
          'A genuine defect includes structural flaws or damage upon arrival. However, slight variations in size (up to +/- 3%), natural color differences, temporary rolling marks, initial shedding, and occasional sprouting (loose threads) are inherent to handcrafted wool and jute rugs and do not qualify as defects.'
        ),
        item(
          'How do I initiate a return or report a defect?',
          'Please contact us at info@suklarugs.com with your order number and clear photos of the rug. If the item arrived damaged, please also include photos of the exterior packaging. Do not ship the rug back without receiving a Return Authorization (RA) number and our official return address.'
        )
      ],
      [{ label: 'Read the full Return and Refund Policy', href: '/returns' }]
    )
  ]
};

/** schema.org FAQPage built from the exact strings the page renders. */
export function buildFaqJsonLd(doc: FaqDocumentData): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: doc.groups.flatMap((g) =>
      g.items.map((i) => ({
        '@type': 'Question',
        name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer }
      }))
    )
  };
}
