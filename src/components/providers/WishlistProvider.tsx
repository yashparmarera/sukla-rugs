'use client';

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { MAX_WISHLIST_ITEMS, WISHLIST_STORAGE_KEY, parseStoredWishlist } from '@/lib/wishlist';

/*
 * Device-local wishlist. localStorage holds a JSON array of Shopify product
 * GIDs under WISHLIST_STORAGE_KEY. It is read through useSyncExternalStore:
 * the server snapshot is always an empty list, so the first client render
 * matches the server HTML and the real list appears right after hydration
 * (no hydration mismatch). The 'storage' event keeps other tabs in sync.
 */

const EMPTY: string[] = [];
let cachedRaw: string | null | undefined;
let cachedIds: string[] = EMPTY;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  } catch {
    // Storage blocked (privacy mode, disabled cookies): behave as an empty wishlist.
    return null;
  }
}

function getSnapshot(): string[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseStoredWishlist(raw);
  }
  return cachedIds;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === WISHLIST_STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function write(ids: string[]): void {
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

const subscribeNever = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

export type WishlistToggleResult = 'added' | 'removed' | 'full';

interface WishlistContextValue {
  /** Saved product GIDs, oldest first. Empty until the browser has hydrated. */
  ids: string[];
  /** False during server render and hydration; true once localStorage has been read. */
  ready: boolean;
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => WishlistToggleResult;
  remove: (productIds: string[]) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeNever, getTrue, getFalse);

  const isSaved = useCallback((productId: string) => ids.includes(productId), [ids]);

  // Reads the latest stored list (not the render snapshot) so a stale tab never overwrites newer data.
  const toggle = useCallback((productId: string): WishlistToggleResult => {
    const current = getSnapshot();
    if (current.includes(productId)) {
      write(current.filter((id) => id !== productId));
      return 'removed';
    }
    if (current.length >= MAX_WISHLIST_ITEMS) return 'full';
    write([...current, productId]);
    return 'added';
  }, []);

  const remove = useCallback((productIds: string[]) => {
    const current = getSnapshot();
    const next = current.filter((id) => !productIds.includes(id));
    if (next.length !== current.length) write(next);
  }, []);

  const value = useMemo(() => ({ ids, ready, isSaved, toggle, remove }), [ids, ready, isSaved, toggle, remove]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside <WishlistProvider>.');
  return context;
}
