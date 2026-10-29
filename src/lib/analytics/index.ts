import { hasAnalyticsConsent } from '@/lib/consent';

export type AnalyticsEvent =
  | 'product_view'
  | 'collection_view'
  | 'search'
  | 'filter'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'wishlist'
  | 'consultation_submit'
  | 'trade_enquiry'
  | 'custom_quote_request';

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  console.log(`[SUKLA ANALYTICS] Event: "${event}" at ${timestamp}`, payload || {});

  // Integration point for GA4 / Shopify Pixel / Segment. All events are
  // Performance & analytics: nothing is pushed for a tag to send unless the
  // shopper has given analytics consent in the cookie banner.
  if (hasAnalyticsConsent() && Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer)) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event: `sukla_${event}`,
      ...payload
    });
  }
}
