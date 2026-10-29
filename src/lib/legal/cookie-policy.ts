/**
 * Sukla Rugs Global Cookie Policy, owner text (2026-10-28).
 * One string per source line. Edits applied: E2 ("we"), E4 (effective date).
 */

import { list, p, section, type LegalDocument } from './shared';

export const COOKIE_POLICY: LegalDocument = {
  href: '/cookie-policy',
  kicker: 'Legal',
  title: 'Sukla Rugs Global Cookie Policy',
  sections: [
    section(
      1,
      'Introduction',
      [
        p(
          'This Cookie Policy explains how Sukla Rugs ("we") uses cookies and similar tracking technologies when you visit our website at suklarugs.com. It explains what these technologies are, why we use them, and your rights to control our use of them across different global jurisdictions.'
        )
      ],
      [{ label: 'Read our Privacy Policy', href: '/privacy-policy' }]
    ),
    section(2, 'What Are Cookies?', [
      p(
        'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used by online store owners to make their websites work, or to work more efficiently, as well as to provide reporting information and personalized advertising.'
      )
    ]),
    section(3, 'Types of Cookies We Use', [
      p(
        'We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, while others enable us to track and target the interests of our users to enhance the shopping experience.'
      ),
      list(
        [
          'Strictly Necessary Cookies',
          'These are essential for you to browse the website and use its features, such as adding rugs to your shopping cart, securely proceeding to checkout, and managing your privacy preferences. The website cannot function properly without these cookies.'
        ],
        [
          'Performance & Analytics Cookies',
          'These cookies collect information about how you use our website, like which pages you visited and which links you clicked. All of the data is anonymized and cannot be used to identify you. We use this data to improve website functionality and measure how effective our marketing campaigns are.'
        ],
        [
          'Functionality Cookies',
          'These allow our website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features.'
        ],
        [
          'Targeting & Advertising Cookies',
          'These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. They can share this information with other organizations or advertisers.'
        ]
      )
    ]),
    section(4, 'Third-Party Cookies', [
      p(
        'In addition to our own cookies, we may also use various third-party cookies (such as Google Analytics, Meta Pixel, or our payment gateway providers) to report usage statistics of the service, deliver advertisements on and through the service, and process global transactions securely.'
      )
    ]),
    section(
      5,
      'How Can You Control Cookies?',
      [
        p(
          'You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie rights by setting your preferences in our Cookie Consent Banner upon your first visit to the site.'
        ),
        p('Additionally, you can restrict or block cookies through your browser settings:'),
        list(
          [
            'Browser Controls',
            'You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject strictly necessary cookies, you may still use our website, but your access to some functionality and areas (like the checkout process) will be severely restricted.'
          ],
          [
            'Targeting Opt-Out',
            'You can opt out of targeted advertising networks by visiting the Digital Advertising Alliance (DAA) or the Network Advertising Initiative (NAI). Users in the EU can opt out via the European Interactive Digital Advertising Alliance (EDAA).'
          ]
        )
      ],
      [{ label: 'Open cookie preferences', consentAction: 'preferences' }]
    ),
    section(6, 'Updates to This Policy', [
      p(
        'We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.'
      )
    ]),
    section(7, 'Contact Us', [
      p('If you have any questions about our use of cookies or other technologies, please contact us at:'),
      { kind: 'contact', email: true, mailingAddress: true }
    ])
  ]
};
