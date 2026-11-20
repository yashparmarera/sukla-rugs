'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
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
 * "Accept all" and "Reject non-essential" are the same size and sit side by
 * side, so declining is as easy as accepting.
 *
 * The cookie is read through useSyncExternalStore with a 'server' snapshot, so
 * the server HTML and the hydration render contain nothing (no mismatch).
 */

const SERVER = 'server';
const getServerSnapshot = () => SERVER;

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sukla-terracotta)]';

const BUTTON_BASE = `inline-flex min-h-11 items-center justify-center px-4 font-sans text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus:outline-none ${FOCUS_RING}`;
const BUTTON_SOLID = `${BUTTON_BASE} border border-[var(--sukla-charcoal)] bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)] hover:bg-[var(--sukla-terracotta-dark)] hover:border-[var(--sukla-terracotta-dark)]`;
const BUTTON_OUTLINE = `${BUTTON_BASE} border border-[var(--sukla-charcoal)] bg-transparent text-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-ivory)]`;
const TEXT_LINK = `font-sans text-xs text-[var(--sukla-charcoal)]/80 underline underline-offset-4 decoration-[var(--sukla-charcoal)]/30 transition-colors hover:text-[var(--sukla-terracotta-dark)] hover:decoration-[var(--sukla-terracotta-dark)] ${FOCUS_RING}`;

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
  <div className="flex items-start justify-between gap-5 border-b border-[var(--sukla-muted-border)] py-4 last:border-b-0">
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--sukla-charcoal)]">
        {label}
      </label>
      <p id={`${id}-desc`} className="mt-1 text-xs leading-relaxed text-[var(--sukla-charcoal)]/70">
        {description}
      </p>
      {note && <p className="mt-1 text-xs leading-relaxed text-[var(--sukla-terracotta-dark)]">{note}</p>}
    </div>
    <input
      id={id}
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      aria-describedby={`${id}-desc`}
      onChange={(event) => onChange?.(event.target.checked)}
      className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-[var(--sukla-charcoal)]/25 transition-colors duration-300 before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:duration-300 before:content-[''] checked:bg-[var(--sukla-terracotta-dark)] checked:before:translate-x-5 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
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
      className="cookie-consent fixed inset-x-0 bottom-0 z-[45] max-h-[calc(100svh-1rem)] overflow-y-auto border-t border-[var(--sukla-muted-border)] bg-[var(--sukla-ivory)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 font-sans text-[var(--sukla-charcoal)] shadow-[0_-12px_40px_-12px_rgba(33,29,27,0.25)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem] sm:border sm:px-7 sm:pb-7 sm:pt-7 sm:shadow-[0_24px_60px_-20px_rgba(33,29,27,0.35)]"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[var(--sukla-terracotta)]" />

      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--sukla-terracotta-dark)]">
        Your privacy
      </p>
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-serif text-2xl font-normal leading-tight outline-none"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Cookie preferences
      </h2>

      {view === 'banner' ? (
        <>
          <p id={descId} className="mt-3 text-sm leading-relaxed text-[var(--sukla-charcoal)]/75">
            We use strictly necessary cookies to run our shop. With your permission, we also use analytics and
            marketing cookies.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={rejectNonEssential} className={BUTTON_OUTLINE}>
              Reject
            </button>
            <button type="button" onClick={acceptAll} className={BUTTON_SOLID}>
              Accept all
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <button type="button" onClick={openPreferences} className={TEXT_LINK}>
              Manage preferences
            </button>
            <Link href="/cookie-policy" className={TEXT_LINK}>
              Cookie Policy
            </Link>
          </div>
        </>
      ) : (
        <>
          <p id={descId} className="mt-3 text-sm leading-relaxed text-[var(--sukla-charcoal)]/75">
            Choose which optional cookies we may use. You can change this at any time from the footer.
          </p>
          {optOutSaved && (
            <p role="status" className="mt-3 text-xs font-medium text-emerald-800">
              Your opt-out of data sharing for targeted advertising is saved.
            </p>
          )}
          <div className="mt-3 border-t border-[var(--sukla-muted-border)]">
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
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={rejectNonEssential} className={BUTTON_OUTLINE}>
              Reject
            </button>
            <button type="button" onClick={acceptAll} className={BUTTON_OUTLINE}>
              Accept all
            </button>
            <button type="button" onClick={savePreferences} className={`${BUTTON_SOLID} col-span-2`}>
              Save preferences
            </button>
          </div>
          <p className="mt-4 text-center">
            <Link href="/cookie-policy" className={TEXT_LINK}>
              Cookie Policy
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
