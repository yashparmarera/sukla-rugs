import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { PaymentLogos } from '@/components/ui/PaymentLogos';
import { ConsentButton } from '@/components/consent/ConsentButton';
import { EMAIL, EMAIL_HREF, MAILING_ADDRESS, PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact';
import { LEGAL_PAGES } from '@/lib/legal/shared';
import { shopHref } from '@/lib/shop-menu';

type FooterLink = { label: string; href: string };

const EXPLORE_LINKS: FooterLink[] = [
  { label: 'Shop All Rugs', href: '/shop' },
  { label: 'Custom Rugs', href: '/custom-rugs' },
  { label: 'Customisation', href: '/customisation' },
  { label: 'Design Consultation', href: '/design-consultation' },
  { label: 'Trade & Designers', href: '/trade' },
  { label: 'Journal', href: '/journal' }
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: 'Our Story', href: '/story' },
  { label: 'Our Process', href: '/process' },
  { label: 'Artisans', href: '/artisans' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Rug Size Guide', href: '/guides/rug-size' },
  { label: 'Rug Care Guide', href: '/guides/rug-care' },
  { label: 'Contact', href: '/contact' }
];

const POPULAR_SEARCHES: FooterLink[] = [
  { label: 'Wool Rugs', href: shopHref('material', 'wool') },
  { label: 'Custom Rugs', href: '/custom-rugs' },
  { label: 'Hand Knotted Rugs', href: shopHref('construction', 'hand-knotted') },
  { label: 'Hand Tufted Rugs', href: shopHref('construction', 'hand-tufted') },
  { label: 'Runners', href: shopHref('collection', 'runners') },
  { label: 'Round Rugs', href: shopHref('collection', 'round-rugs') },
  { label: 'Rugs for Living Room', href: shopHref('room', 'living-room') },
  { label: 'Rugs for Bedroom', href: shopHref('room', 'bedroom') }
];

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';
const LINK = `transition-colors hover:text-[var(--sukla-terracotta)] ${FOCUS}`;

function LinkColumn({ heading, links, label }: { heading: string; links: FooterLink[]; label: string }) {
  return (
    <nav aria-label={label}>
      <h2 className="eyebrow mb-3 text-[11px] font-bold text-[var(--sukla-charcoal)]">{heading}</h2>
      <ul className="space-y-2 text-sm text-[var(--sukla-charcoal)]/75">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] font-sans text-[var(--sukla-charcoal)]">
      <div className="editorial-container pt-10 pb-6 md:pt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="space-y-4">
            <Link href="/" aria-label="Sukla Rugs home" className={`inline-flex items-center gap-3 ${FOCUS}`}>
              <Image
                src="/images/visual-mark/visualmark.png"
                alt=""
                width={2000}
                height={2000}
                className="h-11 w-11 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-medium uppercase tracking-[0.22em]">SUKLA RUGS</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--sukla-taupe)]">
                  Bhadohi • India
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--sukla-charcoal)]/75">
              Handcrafted rugs made by artisans in Bhadohi, Uttar Pradesh, for homes around the world.
            </p>
            <SocialLinks />
          </div>

          <LinkColumn heading="Explore" label="Footer explore" links={EXPLORE_LINKS} />
          <LinkColumn heading="About & Support" label="Footer about and support" links={SUPPORT_LINKS} />

          <div>
            <h2 className="eyebrow mb-3 text-[11px] font-bold text-[var(--sukla-charcoal)]">Contact Us</h2>
            <address className="space-y-2 text-sm not-italic text-[var(--sukla-charcoal)]/75">
              <p>{MAILING_ADDRESS}</p>
              <p>
                <a href={EMAIL_HREF} className={LINK}>
                  {EMAIL}
                </a>
              </p>
              <p>
                <a href={PHONE_TEL} className={`nums ${LINK}`}>
                  {PHONE_DISPLAY}
                </a>
              </p>
            </address>
            <PaymentLogos className="mt-5 border-t border-[var(--sukla-muted-border)] pt-4 md:justify-end" />
          </div>
        </div>

        <nav
          aria-label="Popular searches"
          className="mt-8 border-t border-[var(--sukla-muted-border)] pt-5 text-xs leading-7 text-[var(--sukla-charcoal)]/75"
        >
          <h2 className="eyebrow mr-2 inline text-[11px] font-bold text-[var(--sukla-charcoal)]">Popular Searches</h2>
          <ul className="inline">
            {POPULAR_SEARCHES.map((link, index) => (
              <li key={link.label} className="inline">
                {index > 0 && (
                  <span aria-hidden="true" className="mx-2 text-[var(--sukla-taupe)]">
                    |
                  </span>
                )}
                <Link href={link.href} className={`underline underline-offset-2 ${LINK}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex flex-col gap-3 border-t border-[var(--sukla-muted-border)] pt-4 text-[11px] text-[var(--sukla-charcoal)]/65 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="nums">&copy; {new Date().getFullYear()}</span> SUKLA RUGS. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {LEGAL_PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={LINK}>
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <ConsentButton mode="preferences" className={`text-left ${LINK}`}>
                  Cookie preferences
                </ConsentButton>
              </li>
              <li>
                <ConsentButton mode="do-not-sell" className={`text-left ${LINK}`}>
                  Do Not Sell or Share My Personal Information
                </ConsentButton>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
