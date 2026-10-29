'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  isGpcEnabled,
  onOpenCookiePreferences,
  parseConsent,
  readConsentRaw,
  saveConsent,
  subscribeConsent,
  type ConsentPanelMode
} from '@/lib/consent';

/*
 * Cookie consent banner and preferences panel (Privacy Policy §6/§7, Cookie Policy §5).
 *
 * Shown on the first visit until the shopper makes a choice, and reopened from
 * the footer or the policy pages. Non-modal: the rest of the page stays usable.
 * It closes only through a choice button (no close icon, Escape does nothing),
 * so a visit never ends without a recorded decision once the banner is used.
 *
 * The cookie is read through useSyncExternalStore with a 'server' snapshot, so
 * the server HTML and the hydration render contain nothing (no mismatch).
 */

const SERVER = 'server';
const getServerSnapshot = () => SERVER;

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

interface SwitchRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  note?: string;
  onChange?: (checked: boolean) => void;
}

const SwitchRow: React.FC<SwitchRowProps> = ({ id, label, description, checked, disabled, note, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--sukla-muted-border)] last:border-b-0">
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--sukla-charcoal)]">
        {label}
      </label>
      <p id={`${id}-desc`} className="text-xs text-[var(--sukla-charcoal)]/70 leading-relaxed">
        {description}
      </p>
      {note && <p className="mt-1 text-xs text-[var(--sukla-terracotta-dark)] leading-relaxed">{note}</p>}
    </div>
    <input
      id={id}
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      aria-describedby={`${id}-desc`}
      onChange={(event) => onChange?.(event.target.checked)}
      className={`mt-1 h-4 w-4 shrink-0 accent-[var(--sukla-terracotta)] disabled:opacity-60 ${FOCUS_RING}`}
    />
  </div>
);

export const CookieConsent: React.FC = () => {
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, getServerSnapshot);
  const [reopened, setReopened] = useState(false);
  const [view, setView] = useState<'banner' | 'preferences'>('banner');
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [optOutSaved, setOptOutSaved] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const baseId = useId();
  const headingId = `${baseId}-heading`;
  const descId = `${baseId}-desc`;

  // Reopen requests from the footer and the policy pages. setState happens only in the callback.
  useEffect(
    () =>
      onOpenCookiePreferences((mode: ConsentPanelMode) => {
        const stored = parseConsent(readConsentRaw());
        openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        if (mode === 'do-not-sell') {
          const saved = saveConsent({ analytics: stored?.analytics ?? false, marketing: false });
          setAnalytics(saved.analytics);
          setMarketing(false);
          setOptOutSaved(true);
        } else {
          setAnalytics(stored?.analytics ?? false);
          setMarketing((stored?.marketing ?? false) && !isGpcEnabled());
          setOptOutSaved(false);
        }
        setView('preferences');
        setReopened(true);
        setFocusRequest((n) => n + 1);
      }),
    []
  );

  // Move focus to the panel heading only when it was opened on request (never on first visit).
  useEffect(() => {
    if (focusRequest > 0) headingRef.current?.focus();
  }, [focusRequest]);

  if (raw === SERVER) return null;
  const hasChoice = parseConsent(raw) !== null;
  if (hasChoice && !reopened) return null;

  const gpc = isGpcEnabled();

  const finish = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setReopened(false);
    setView('banner');
    setOptOutSaved(false);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && opener.isConnected) opener.focus();
  };

  const acceptAll = () => finish({ analytics: true, marketing: true });
  const rejectNonEssential = () => finish({ analytics: false, marketing: false });
  const savePreferences = () => finish({ analytics, marketing: marketing && !gpc });

  const openPreferences = () => {
    const stored = parseConsent(raw);
    setAnalytics(stored?.analytics ?? false);
    setMarketing((stored?.marketing ?? false) && !gpc);
    setView('preferences');
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      aria-describedby={descId}
      className="fixed z-[45] bottom-3 inset-x-3 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm max-h-[calc(100svh-1.5rem)] overflow-y-auto bg-[var(--sukla-ivory)] border border-[var(--sukla-muted-border)] shadow-xl p-5 font-sans text-[var(--sukla-charcoal)]"
    >
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="heading text-base outline-none">
        Cookie preferences
      </h2>

      {view === 'banner' ? (
        <>
          <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--sukla-charcoal)]/80">
            We use strictly necessary cookies to run our shop. With your permission, we also use analytics and
            marketing cookies.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={acceptAll} className={FOCUS_RING}>
              Accept all
            </Button>
            <Button variant="outline" size="sm" onClick={rejectNonEssential} className={FOCUS_RING}>
              Reject non-essential
            </Button>
            <Button variant="outline" size="sm" onClick={openPreferences} className={FOCUS_RING}>
              Manage preferences
            </Button>
          </div>
          <p className="mt-3 text-xs">
            <Link
              href="/cookie-policy"
              className={`text-[var(--sukla-terracotta)] underline underline-offset-4 hover:text-[var(--sukla-terracotta-dark)] ${FOCUS_RING}`}
            >
              Cookie Policy
            </Link>
          </p>
        </>
      ) : (
        <>
          <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--sukla-charcoal)]/80">
            Choose which optional cookies we may use. You can change this at any time from the footer.
          </p>
          {optOutSaved && (
            <p role="status" className="mt-3 text-xs font-medium text-emerald-800">
              Your opt-out of data sharing for targeted advertising is saved.
            </p>
          )}
          <div className="mt-3">
            <SwitchRow
              id={`${baseId}-necessary`}
              label="Strictly necessary"
              description="Shopping cart, checkout, your country and currency choice, and these privacy settings. Always on."
              checked
              disabled
            />
            <SwitchRow
              id={`${baseId}-analytics`}
              label="Performance & analytics"
              description="Helps us understand how the site is used so we can improve it."
              checked={analytics}
              onChange={setAnalytics}
            />
            <SwitchRow
              id={`${baseId}-marketing`}
              label="Targeting & advertising"
              description="Used to make advertising more relevant to you."
              checked={marketing && !gpc}
              disabled={gpc}
              note={
                gpc
                  ? "Your browser's Global Privacy Control signal is on, so targeting and advertising cookies stay off."
                  : undefined
              }
              onChange={setMarketing}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={savePreferences} className={FOCUS_RING}>
              Save preferences
            </Button>
            <Button variant="outline" size="sm" onClick={acceptAll} className={FOCUS_RING}>
              Accept all
            </Button>
            <Button variant="outline" size="sm" onClick={rejectNonEssential} className={FOCUS_RING}>
              Reject non-essential
            </Button>
          </div>
          <p className="mt-3 text-xs">
            <Link
              href="/cookie-policy"
              className={`text-[var(--sukla-terracotta)] underline underline-offset-4 hover:text-[var(--sukla-terracotta-dark)] ${FOCUS_RING}`}
            >
              Cookie Policy
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
