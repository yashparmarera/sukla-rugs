/**
 * SUKLA RUGS "About us" menu: single source of truth for the desktop image-card
 * mega menu (AboutMegaMenu). The mobile drawer keeps its own text links.
 *
 * Images live in public/images/about us/ (the folder name contains a space, so
 * every URL is encoded). Width and height are the real pixel sizes of the
 * source files and are used only for documentation and aspect checks; the card
 * renders them with next/image `fill` inside a fixed 3:4 box.
 */

export interface AboutMenuItem {
  label: string;
  href: string;
  /** Encoded public URL of the card image. */
  imageSrc: string;
  /** Source pixel width. */
  width: number;
  /** Source pixel height. */
  height: number;
}

export const ABOUT_ROOT_HREF = '/story';

const ABOUT_IMAGE_DIR = '/images/about us/';

function aboutImage(fileName: string): string {
  return encodeURI(`${ABOUT_IMAGE_DIR}${fileName}`);
}

export const ABOUT_MENU: readonly AboutMenuItem[] = [
  {
    label: 'Our Story',
    href: '/story',
    imageSrc: aboutImage('our story.webp'),
    width: 2000,
    height: 2000
  },
  {
    label: 'Our Craft (7 Stages)',
    href: '/process',
    imageSrc: aboutImage('Our Craft (7 Stages).webp'),
    width: 3648,
    height: 5472
  },
  {
    label: 'Our Crafting Origin',
    href: '/artisans',
    imageSrc: aboutImage('our craft.webp'),
    width: 2000,
    height: 2000
  },
  {
    label: 'Our Impact',
    href: '/sustainability',
    imageSrc: aboutImage('our impact.webp'),
    width: 2000,
    height: 2000
  }
];
