'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { ABOUT_MENU, ABOUT_ROOT_HREF } from '@/lib/about-menu';
import { announceMegaMenuOpen, useCloseWhenOtherMegaMenuOpens } from '@/lib/mega-menu-events';

const CLOSE_DELAY_MS = 150;
const PANEL_ID = 'about-mega-panel';
const MENU_ID = 'about';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]';

/**
 * Desktop "About us" mega menu. Same disclosure pattern as ShopMegaMenu: the
 * "About us" label is a normal link to /story, the chevron button toggles a
 * full-width panel, and the panel holds one row of image cards (one link per
 * card, image plus label).
 *
 * Opens on mouse hover, keyboard focus and click/tap. Closes on Escape,
 * outside click, focus leaving, link click, route change and when the Shop
 * menu opens. The panel is positioned against the sticky <header>, so it spans
 * the full width and causes no layout shift.
 *
 * Card images are not mounted until the first hover, focus or tap on the
 * trigger, so pages that never use the menu never request them.
 */
export const AboutMegaMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFocusOpen = useRef(false);
  // Pinned = opened or confirmed by a click/tap, so pointer-leave must not close it.
  const pinned = useRef(false);

  // Close on route change by adjusting state during render (no effect).
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

  const clearTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Keep Shop and About us from being open together.
  const closeFromOtherMenu = useCallback(() => {
    clearTimer();
    pinned.current = false;
    setOpen(false);
  }, [clearTimer]);
  useCloseWhenOtherMegaMenuOpens(MENU_ID, closeFromOtherMenu);
  useEffect(() => {
    if (open) announceMegaMenuOpen(MENU_ID);
  }, [open]);

  // Outside click / tap. Attached only while open.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => clearTimer, [clearTimer]);

  const handlePointerEnter = (event: React.PointerEvent) => {
    setArmed(true);
    if (event.pointerType !== 'mouse') return;
    clearTimer();
    if (!open) pinned.current = false;
    setOpen(true);
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || pinned.current) return;
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleFocus = (event: React.FocusEvent) => {
    if (skipFocusOpen.current) return;
    // Open for keyboard focus only. Pointer focus is handled by hover and click,
    // otherwise a tap on the chevron would open and immediately toggle shut.
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
      setArmed(true);
      clearTimer();
      pinned.current = false;
      setOpen(true);
    }
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    setArmed(true);
    clearTimer();
    // detail === 0 means the click came from the keyboard (Enter / Space): plain toggle.
    if (event.detail === 0) {
      pinned.current = false;
      setOpen((value) => !value);
      return;
    }
    // Pointer click: if hover already opened it, pin it open; a second click closes it.
    if (open && pinned.current) {
      pinned.current = false;
      setOpen(false);
    } else {
      pinned.current = true;
      setOpen(true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && wrapperRef.current && !wrapperRef.current.contains(next)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape' || !open) return;
    clearTimer();
    setOpen(false);
    const active = document.activeElement;
    if (active && wrapperRef.current?.contains(active) && active !== buttonRef.current) {
      // Return focus to the trigger without re-opening via the focus handler.
      skipFocusOpen.current = true;
      buttonRef.current?.focus();
      skipFocusOpen.current = false;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="py-2"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <div className="relative flex items-center gap-1">
        <Link href={ABOUT_ROOT_HREF} className={`hover-underline-animation font-medium ${FOCUS_RING}`}>
          About us
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-label="About us menu"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={PANEL_ID}
          onClick={handleToggleClick}
          className={`p-1 text-[var(--sukla-charcoal)]/70 hover:text-[var(--sukla-charcoal)] ${FOCUS_RING}`}
        >
          <ChevronDown
            aria-hidden="true"
            className={`w-3 h-3 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {/* Invisible bridge so the pointer can travel from trigger to panel. */}
        {open && <span aria-hidden="true" className="absolute left-0 top-full h-8 w-full" />}
      </div>

      <div
        id={PANEL_ID}
        role="group"
        aria-label="About us menu"
        className={`absolute inset-x-0 top-full z-50 before:absolute before:inset-x-0 before:-top-8 before:h-8 before:content-[''] border-y border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] shadow-subtle [transition-property:opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <ul className="editorial-container flex flex-wrap gap-6 py-8 text-left font-sans">
          {ABOUT_MENU.map((entry) => (
            <li key={entry.href} className="w-[195px]">
              <Link
                href={entry.href}
                onClick={() => setOpen(false)}
                className={`group block text-[var(--sukla-charcoal)] ${FOCUS_RING}`}
              >
                <span
                  aria-hidden="true"
                  className="relative block aspect-[3/4] w-full overflow-hidden bg-[var(--sukla-muted-border)]"
                >
                  {armed && (
                    <Image
                      src={entry.imageSrc}
                      alt=""
                      fill
                      sizes="195px"
                      className="object-cover transition-transform duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                    />
                  )}
                </span>
                <span className="mt-3 block text-sm font-semibold underline-offset-4 decoration-transparent decoration-1 transition-colors motion-reduce:transition-none group-hover:underline group-hover:decoration-[var(--sukla-charcoal)]">
                  {entry.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
