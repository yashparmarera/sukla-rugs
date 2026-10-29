/**
 * Sukla Rugs Global Privacy Policy, owner text (2026-10-28).
 * One string per source line. Edits applied: E1 ("we"), E3 (suklarugs.com),
 * E4 (effective date, see LEGAL_EFFECTIVE_DATE), E9 (Razorpay, owner decision OD3).
 */

import { list, p, section, type LegalDocument } from './shared';

export const PRIVACY_POLICY: LegalDocument = {
  href: '/privacy-policy',
  kicker: 'Legal',
  title: 'Sukla Rugs Global Privacy Policy',
  sections: [
    section(1, 'Introduction', [
      p(
        'Sukla Rugs ("we") respects your privacy. This Global Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, suklarugs.com and purchase our rugs worldwide.'
      )
    ]),
    section(2, 'Information We Collect', [
      p('To process orders and improve your shopping experience, we collect specific data points:'),
      list(
        ['Identity & Contact Data', 'Name, billing address, shipping address, email address, and phone number.'],
        [
          'Financial Data',
          'Payment card details (processed securely by our payment partner, Razorpay; we do not store full credit card numbers).'
        ],
        ['Technical Data', 'IP address, browser type, device identifiers, and time zone settings.'],
        ['Profile & Marketing Data', 'Order history, cart contents, preferences, and newsletter subscription status.']
      )
    ]),
    section(3, 'How We Use Your Data & Legal Basis', [
      p('Under global laws like the GDPR, we must establish a lawful basis for processing your data:'),
      list(
        ['Order fulfillment and shipping', 'Processed under contractual necessity.'],
        ['Payment processing and fraud prevention', 'Processed under legitimate interest and legal obligation.'],
        ['Marketing and newsletters', 'Processed based on your explicit consent, which you can withdraw at any time.']
      )
    ]),
    section(4, 'How We Share Your Information', [
      p('We only share your data to facilitate our global business operations:'),
      list(
        ['Service Providers', 'Payment processors, shipping couriers, and IT support platforms.'],
        ['Marketing Partners', 'Analytics and advertising providers, subject to your cookie preferences.'],
        [
          'Legal Compliance',
          'When required to comply with international laws, tax obligations, or to protect our rights.'
        ]
      )
    ]),
    section(5, 'International Data Transfers', [
      p(
        'As a global e-commerce business, your data may be transferred to and processed in countries outside your country of residence. For customers in the European Economic Area (EEA) or UK, we utilize Standard Contractual Clauses or rely on adequacy decisions to ensure your data remains legally protected.'
      )
    ]),
    section(
      6,
      'Your Global Privacy Rights',
      [
        p('Depending on your location, you hold specific legal rights over your data:'),
        list(
          ['Right to Access/Know', 'You may request a copy of the personal data we hold about you.'],
          [
            'Right to Deletion',
            'You may request data erasure, subject to legal exceptions like mandatory tax record retention.'
          ],
          ['Right to Correction', 'You may request updates to inaccurate or incomplete information.'],
          [
            'Right to Opt-Out',
            'You may opt out of data sharing for targeted advertising by clicking "Do Not Sell or Share My Personal Information" on our site.'
          ],
          [
            'Right to Non-Discrimination',
            'You will not receive discriminatory pricing or service for exercising these rights.'
          ]
        )
      ],
      [{ label: 'Do Not Sell or Share My Personal Information', consentAction: 'do-not-sell' }]
    ),
    section(
      7,
      'Cookies and Tracking Technologies',
      [
        p(
          "We rely on essential cookies to maintain your shopping cart, alongside non-essential analytics and marketing cookies to personalize advertisements. You can manage your specific tracking preferences through our website's cookie consent banner."
        )
      ],
      [
        { label: 'Read our Cookie Policy', href: '/cookie-policy' },
        { label: 'Open cookie preferences', consentAction: 'preferences' }
      ]
    ),
    section(8, 'Data Retention and Security', [
      p(
        'We retain your information only as long as necessary for the purposes outlined in this policy. Transactional records are kept for up to seven years for accounting and tax compliance. We implement industry-standard security protocols, including HTTPS encryption, to protect your data.'
      )
    ]),
    section(9, 'Contact Us', [
      p('To exercise your privacy rights or ask questions about this policy, contact us at:'),
      { kind: 'contact', email: true, mailingAddress: false }
    ])
  ]
};
