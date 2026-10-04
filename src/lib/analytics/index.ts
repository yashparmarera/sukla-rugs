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
  | 'trade_enquiry';

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  console.log(`[SHUKLA ANALYTICS] Event: "${event}" at ${timestamp}`, payload || {});

  // Integration point for GA4 / Shopify Pixel / Segment
  if (Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer)) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event: `shukla_${event}`,
      ...payload
    });
  }
}
