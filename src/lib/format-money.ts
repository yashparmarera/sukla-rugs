/**
 * Formats a Shopify money amount using the currency code returned by the
 * Storefront API, instead of assuming USD.
 */
export function formatMoney(amount: string | number, currencyCode: string = 'USD'): string {
  const value = typeof amount === 'number' ? amount : parseFloat(amount);

  if (Number.isNaN(value)) {
    return '';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(value);
  } catch {
    // Unknown currency code: fall back to a plain, honest representation.
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}
