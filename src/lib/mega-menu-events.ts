'use client';

import { useEffect } from 'react';

/**
 * Lets the desktop mega menus (Shop, About us) stay mutually exclusive without
 * lifting state into Header. A menu announces itself when it opens; every other
 * menu listening closes. State changes happen inside the event callback, never
 * synchronously in an effect body.
 */
const MEGA_MENU_OPEN_EVENT = 'sukla:mega-menu-open';

export function announceMegaMenuOpen(id: string): void {
  window.dispatchEvent(new CustomEvent<string>(MEGA_MENU_OPEN_EVENT, { detail: id }));
}

/** Calls `close` when a different mega menu announces that it opened. */
export function useCloseWhenOtherMegaMenuOpens(id: string, close: () => void): void {
  useEffect(() => {
    const handle = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) close();
    };
    window.addEventListener(MEGA_MENU_OPEN_EVENT, handle);
    return () => window.removeEventListener(MEGA_MENU_OPEN_EVENT, handle);
  }, [id, close]);
}
