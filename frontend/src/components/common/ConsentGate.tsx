"use client";

import React from 'react';
import { useCookieConsent } from '../../context/CookieConsentContext';

interface ConsentGateProps {
  category: 'functional' | 'analytics' | 'marketing';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children (e.g. tracking scripts, marketing pixels, or analytics tags)
 * ONLY after the user has explicitly consented to the specified cookie category.
 */
export const ConsentGate: React.FC<ConsentGateProps> = ({ category, children, fallback = null }) => {
  const { hasConsent } = useCookieConsent();

  if (!hasConsent(category)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ConsentGate;
