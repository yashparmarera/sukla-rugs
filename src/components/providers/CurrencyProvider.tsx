'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { STORE_CURRENCY, formatDisplayMoney, type DisplayMoney } from '@/lib/currency';

interface CurrencyContextValue {
  /** Currency the shopper expects to see for their selected country. */
  displayCurrency: string;
  /** Formats a price in the shopper's currency; approximate values are marked. */
  format: (amount: string | number, sourceCurrency: string) => DisplayMoney;
}

// Without a provider, prices fall back to Shopify's exact amounts.
const CurrencyContext = createContext<CurrencyContextValue>({
  displayCurrency: STORE_CURRENCY,
  format: (amount, sourceCurrency) => formatDisplayMoney(amount, sourceCurrency, sourceCurrency, null)
});

interface CurrencyProviderProps {
  displayCurrency: string;
  /** Units of displayCurrency per 1 store-currency unit, or null if unavailable. */
  rate: number | null;
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ displayCurrency, rate, children }) => {
  const format = useCallback(
    (amount: string | number, sourceCurrency: string) =>
      formatDisplayMoney(amount, sourceCurrency, displayCurrency, rate),
    [displayCurrency, rate]
  );

  const value = useMemo(() => ({ displayCurrency, format }), [displayCurrency, format]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
