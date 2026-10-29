/**
 * Sukla Rugs Global Terms and Conditions, owner text (2026-10-28).
 * One string per source line. Edits applied: E4 (effective date),
 * E7 (Razorpay, owner decision OD3), E10 (laws of India, owner decision OD6).
 */

import { list, p, section, type LegalDocument } from './shared';

export const TERMS_AND_CONDITIONS: LegalDocument = {
  href: '/terms',
  kicker: 'Legal',
  title: 'Sukla Rugs Global Terms and Conditions',
  sections: [
    section(1, 'Agreement to Terms', [
      p(
        'These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Sukla Rugs, concerning your access to and use of the suklarugs.com website as well as any related mobile applications or sales channels. By accessing the site and purchasing our products, you agree that you have read, understood, and agree to be bound by all of these Terms and Conditions.'
      )
    ]),
    section(2, 'Products and Natural Variations', [
      p(
        "We make every effort to display the colors, textures, and designs of our rugs as accurately as possible. However, because many of our rugs are handcrafted, slight variations in size (standard industry tolerance of +/- 3%), color, and weave are inherent to the manufacturing process and are not considered defects. We cannot guarantee that your device's display of any color will perfectly accurately reflect the physical product."
      )
    ]),
    section(3, 'Pricing and Payments', [
      p(
        'All prices are listed in USD unless otherwise localized by our payment gateways. We reserve the right to correct any pricing errors and to change prices at any time without prior notice. We accept payments through Razorpay, which supports major credit and debit cards and other payment methods. By submitting payment information, you represent and warrant that you have the legal right to use the designated payment method.'
      )
    ]),
    section(
      4,
      'International Shipping, Customs, and Duties',
      [
        p(
          'We ship globally. Delivery times provided are estimates and are not guaranteed. For international orders, the customer is the importer of record. You are solely responsible for all import duties, customs taxes, and local brokerage fees levied by your destination country. Sukla Rugs is not responsible for delays caused by customs clearance processes.'
        )
      ],
      [{ label: 'Shipping, customs & duties FAQ', href: '/shipping#customs-duties-and-taxes' }]
    ),
    section(
      5,
      'Returns, Exchanges, and Cancellations',
      [
        list(
          ['Cancellations', 'Orders may be canceled within 24 hours of placement before they enter the shipping process.'],
          [
            'Returns',
            'We accept returns on standard items within 30 days of delivery. The item must be unused, unwashed, and in its original condition and packaging.'
          ],
          [
            'Return Shipping',
            'Customers are responsible for return shipping costs unless the return is due to a defect or an error on our part. Custom or made-to-order rugs are strictly non-refundable.'
          ]
        )
      ],
      [{ label: 'Read the full Return and Refund Policy', href: '/returns' }]
    ),
    section(6, 'Intellectual Property', [
      p(
        'All content on this website, including but not limited to rug designs, photographs, branding, text, graphics, logos, and software, is the property of Sukla Rugs or its content suppliers and is protected by international copyright and trademark laws. You may not reproduce, distribute, or commercially exploit any of our intellectual property without our express written permission.'
      )
    ]),
    section(7, 'Limitation of Liability', [
      p(
        'To the fullest extent permitted by law, Sukla Rugs shall not be liable for any indirect, consequential, incidental, or punitive damages arising out of your use of the website or the purchase of our products. Our total liability to you for any claim arising out of or relating to these Terms or your purchase shall not exceed the total amount you paid for the specific product in dispute.'
      )
    ]),
    section(8, 'Governing Law and Dispute Resolution', [
      p(
        'These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or related to these Terms shall be resolved exclusively in the competent courts of New Delhi, India.'
      )
    ]),
    section(9, 'Modifications to the Service and Terms', [
      p(
        'We reserve the right to update, change, or replace any part of these Terms and Conditions by posting updates to our website. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.'
      )
    ]),
    section(10, 'Contact Information', [
      p('For questions regarding these Terms and Conditions, please contact us:'),
      { kind: 'contact', email: true, mailingAddress: true }
    ])
  ]
};
