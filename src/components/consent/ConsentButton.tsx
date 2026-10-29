'use client';

import React from 'react';
import { openCookiePreferences, type ConsentPanelMode } from '@/lib/consent';

interface ConsentButtonProps {
  mode: ConsentPanelMode;
  className?: string;
  children: React.ReactNode;
}

/** Opens the cookie consent panel ("preferences") or saves a Do Not Sell or Share opt-out ("do-not-sell"). */
export const ConsentButton: React.FC<ConsentButtonProps> = ({ mode, className = '', children }) => (
  <button type="button" onClick={() => openCookiePreferences(mode)} className={className}>
    {children}
  </button>
);
