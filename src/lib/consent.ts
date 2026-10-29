/**
 * Cookie consent state for the Next.js storefront.
 *
 * The shopper's choice is stored in a first-party cookie (`sukla_consent`,
 * same pattern as `sukla_country`) so future server code can read it too.
 * Strictly necessary storage (cart, country/currency, this choice) is always
 * on and has no toggle. Two optional categories: Performance & analytics and
 * Targeting & advertising. A browser Global Privacy Control signal is
 * honoured as a targeting/advertising opt-out.
 *
 * Plain module, safe to import from server code: every function guards
 * `typeof window` / `document`.
 */

export const CONSENT_COOKIE = 'sukla_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_SECONDS = 31536000;

const CHANGED_EVENT = 'sukla:consent-changed';
const OPEN_EVENT = 'sukla:open-cookie-preferences';

export interface ConsentChoice {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

export type ConsentPanelMode = 'preferences' | 'do-not-sell';

/** Raw cookie value, or null when unset or outside the browser. */
export function readConsentRaw(): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${CONSENT_COOKIE}=`;
  const entry = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : null;
}

/** Parses the cookie value. Malformed values or other versions count as "no choice yet". */
export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentChoice>;
    if (data.v !== CONSENT_VERSION || typeof data.analytics !== 'boolean' || typeof data.marketing !== 'boolean') {
      return null;
    }
    return { v: 1, analytics: data.analytics, marketing: data.marketing, ts: Number(data.ts) || 0 };
  } catch {
    return null;
  }
}

export function getConsent(): ConsentChoice | null {
  return parseConsent(readConsentRaw());
}

/** True when the browser sends a Global Privacy Control signal. */
export function isGpcEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** Saves a choice (marketing is forced off under GPC) and notifies subscribers. */
export function saveConsent(choice: { analytics: boolean; marketing: boolean }): ConsentChoice {
  const value: ConsentChoice = {
    v: 1,
    analytics: choice.analytics,
    marketing: choice.marketing && !isGpcEnabled(),
    ts: Date.now()
  };
  if (typeof document === 'undefined') return value;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGED_EVENT));
  return value;
}

/** Performance & analytics consent. Required before any analytics data leaves the browser. */
export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

/** Targeting & advertising consent. Any future ad pixel must check this first. */
export function hasMarketingConsent(): boolean {
  return getConsent()?.marketing === true && !isGpcEnabled();
}

/** For useSyncExternalStore: fires when this tab saves a new choice. */
export function subscribeConsent(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGED_EVENT, onChange);
  return () => window.removeEventListener(CHANGED_EVENT, onChange);
}

/** Opens the consent panel from anywhere (footer, policy pages). */
export function openCookiePreferences(mode: ConsentPanelMode): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<{ mode: ConsentPanelMode }>(OPEN_EVENT, { detail: { mode } }));
}

/** Listens for {@link openCookiePreferences}. */
export function onOpenCookiePreferences(handler: (mode: ConsentPanelMode) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (event: Event) => {
    const mode = (event as CustomEvent<{ mode?: ConsentPanelMode }>).detail?.mode;
    handler(mode === 'do-not-sell' ? 'do-not-sell' : 'preferences');
  };
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
