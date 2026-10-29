'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { LEGAL_PAGES } from '@/lib/legal/shared';
import { announceMegaMenuOpen, useCloseWhenOtherMegaMenuOpens } from '@/lib/mega-menu-events';

const CLOSE_DELAY_MS = 150;
const PANEL_ID = 'guides-mega-panel';
const MENU_ID = 'guides';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-charcoal)]';

/** Columns of the Guides panel. Policies reuse the footer's list, so both stay in sync. */
const GUIDES_MENU: { id: string; heading: string; items: { label: string; href: string }[] }[] = [
  // Policies first (left), Guides second (right), per owner request.
  { id: 'policies', heading: 'Policies', items: LEGAL_PAGES },
  {
    id: 'guides',
    heading: 'Guides',
    items: [
      { label: 'Rug Care & Maintenance', href: '/guides/rug-care' },
      { label: 'Blogs', href: '/journal' }
    ]
  }
];

/**
 * Desktop Guides mega menu. Same disclosure pattern and behaviour as the Shop
 * mega menu: the "Guides" label links to the rug care guide, the chevron
 * button toggles a full-width panel. Opens on hover, keyboard focus and
 * click/tap; closes on Escape, outside click, focus leaving, link click and
 * route change. Shop, About us and Guides are never open together.
 */
export const GuidesMegaMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
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
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
      clearTimer();
      pinned.current = false;
      setOpen(true);
    }
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    clearTimer();
    if (event.detail === 0) {
      pinned.current = false;
      setOpen((value) => !value);
      return;
    }
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
        <Link href="/guides/rug-care" className={`hover-underline-animation font-medium ${FOCUS_RING}`}>
          Guides
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-label="Guides menu"
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
        aria-label="Guides menu"
        className={`absolute inset-x-0 top-full z-50 before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-[''] border-y border-[var(--sukla-muted-border)] bg-[var(--sukla-cream)] shadow-subtle [transition-property:opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="editorial-container grid grid-cols-5 gap-10 py-10 text-left font-sans">
          {GUIDES_MENU.map((column) => (
            <section key={column.id}>
              <p
                id={`guides-menu-${column.id}`}
                className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sukla-charcoal)]"
              >
                {column.heading}
              </p>
              <ul aria-labelledby={`guides-menu-${column.id}`} className="mt-5 space-y-3.5">
                {column.items.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      onClick={() => setOpen(false)}
                      className={`text-base leading-snug text-[var(--sukla-charcoal)]/85 underline-offset-4 decoration-transparent decoration-1 transition-colors motion-reduce:transition-none hover:underline hover:decoration-[var(--sukla-charcoal)] hover:text-[var(--sukla-charcoal)] ${FOCUS_RING}`}
                    >
                      {entry.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
