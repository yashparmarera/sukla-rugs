/**
 * Sukla Rugs Global Return and Refund Policy, owner text (2026-10-28).
 * One string per source line. Edits applied: E4 (effective date),
 * E8 (Razorpay, owner decision OD3).
 */

import { list, p, section, type LegalDocument } from './shared';

export const RETURN_POLICY: LegalDocument = {
  href: '/returns',
  kicker: 'Customer care',
  title: 'Sukla Rugs Global Return and Refund Policy',
  intro: [
    p(
      'At Sukla Rugs, we take pride in the quality of our handcrafted wool and jute rugs. Because international shipping for heavy items like rugs involves significant logistics, we have outlined a clear policy to ensure you know exactly what to expect if a return is necessary.'
    )
  ],
  sections: [
    section(1, 'Return Window and Eligibility', [
      p(
        'We accept returns for standard, non-custom rugs within 30 days of the delivery date. To be eligible for a return, your rug must be:'
      ),
      list(
        'Unused, unwashed, and in its original, sellable condition.',
        'Free from pet hair, stains, odors, or damage.',
        'Repackaged securely in its original packaging or equivalent heavy-duty protective wrapping.'
      )
    ]),
    section(2, 'Handcrafted Variations vs. Defects', [
      p(
        'Because our wool and jute rugs are individually handcrafted, slight variations in color, weave, and dimensions (industry standard tolerance of +/- 3%) are natural characteristics of the artisanal process. Sprouting (loose threads) and initial shedding are also normal for natural fiber rugs. These inherent qualities do not qualify as manufacturing defects.'
      )
    ]),
    section(
      3,
      'International Return Shipping Costs',
      [
        p('Due to the weight and dimensions of our rugs, international return shipping can be expensive.'),
        list(
          [
            'Customer Responsibility',
            'For all standard returns (e.g., change of mind, incorrect size ordered), you are fully responsible for arranging and paying for return shipping to our facility in India.'
          ],
          [
            'Shipping Method',
            'We strongly recommend using a trackable international shipping service and purchasing shipping insurance. We cannot issue refunds for returned items lost or damaged in transit.'
          ]
        )
      ],
      [{ label: 'International shipping, customs & returns FAQ', href: '/shipping#returns-and-exchanges' }]
    ),
    section(
      4,
      'Customs, Duties, and Taxes',
      [
        p(
          'Original shipping charges, as well as any import duties, taxes, or customs fees paid upon delivery, are strictly non-refundable. If Sukla Rugs incurs any unpaid customs fees or return duties upon receiving your returned rug, that amount will be deducted from your final refund.'
        )
      ],
      [{ label: 'Customs, duties & taxes FAQ', href: '/shipping#customs-duties-and-taxes' }]
    ),
    section(5, 'Damaged or Defective Items', [
      p(
        'If your rug arrives damaged due to transit or has a genuine manufacturing defect, please contact us within 48 hours of delivery at info@suklarugs.com. You must include:'
      ),
      list(
        'Your order number.',
        'Clear photographs of the damage/defect.',
        'Photographs of the exterior packaging if damaged in transit.'
      ),
      p(
        'If the claim is approved, we will arrange for a replacement, repair, or full refund, and we will cover the return shipping costs.'
      )
    ]),
    section(6, 'Non-Returnable Items', [
      p('The following items cannot be returned or refunded:'),
      list(
        'Custom-made, personalized, or bespoke rugs.',
        'Items marked as "Final Sale" or "Clearance."',
        'Rug pads that have been opened or unrolled.'
      )
    ]),
    section(7, 'Refund Processing', [
      p(
        'Once your return is received and inspected at our facility, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original method of payment (the card or payment method you used through Razorpay) within 7–10 business days. Please note that it may take additional time for your bank or credit card company to post the refund to your account.'
      )
    ]),
    section(8, 'How to Initiate a Return', [
      p(
        'To start a return, please contact our support team at info@suklarugs.com with your order number and reason for return. Do not send the rug back without receiving a Return Authorization (RA) number and our official return address.'
      )
    ])
  ]
};
