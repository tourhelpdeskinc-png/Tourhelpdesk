"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CookieConsentPreferences {
  essential: true; // Always true & required
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentData extends CookieConsentPreferences {
  timestamp: string;
  version: string;
}

interface CookieConsentContextType {
  consent: CookieConsentData | null;
  hasConsented: boolean;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: { functional: boolean; analytics: boolean; marketing: boolean }) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  hasConsent: (category: 'essential' | 'functional' | 'analytics' | 'marketing') => boolean;
}

const STORAGE_KEY = 'thd_cookie_consent_v1';
const CURRENT_VERSION = '1.0';

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsentData | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved consent on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CookieConsentData = JSON.parse(stored);
        if (parsed && parsed.version === CURRENT_VERSION && parsed.essential === true) {
          setConsent(parsed);
          setIsBannerVisible(false);
          return;
        }
      }
      // If no valid consent stored, show banner after a tiny delay for smooth animation
      const timer = setTimeout(() => {
        setIsBannerVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    } catch (e) {
      // In case localStorage is blocked
      setIsBannerVisible(true);
    }
  }, []);

  const persistConsent = useCallback((data: CookieConsentData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Also write standard 1-year first-party cookie for any edge/middleware checks
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(data))}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    } catch {
      // Ignore write errors (e.g., storage quota or strict privacy modes)
    }

    setConsent(data);
    setIsBannerVisible(false);
    setIsPreferencesOpen(false);

    // Broadcast change so dynamic scripts or listeners update immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('thd_cookie_consent_changed', { detail: data }));
    }
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    });
  }, [persistConsent]);

  const rejectNonEssential = useCallback(() => {
    persistConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    });
  }, [persistConsent]);

  const savePreferences = useCallback(
    (prefs: { functional: boolean; analytics: boolean; marketing: boolean }) => {
      persistConsent({
        essential: true,
        functional: prefs.functional,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        timestamp: new Date().toISOString(),
        version: CURRENT_VERSION,
      });
    },
    [persistConsent]
  );

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const hasConsent = useCallback(
    (category: 'essential' | 'functional' | 'analytics' | 'marketing'): boolean => {
      if (category === 'essential') return true;
      if (!consent) return false;
      return Boolean(consent[category]);
    },
    [consent]
  );

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsented: Boolean(consent),
        isBannerVisible: isMounted && isBannerVisible,
        isPreferencesOpen: isMounted && isPreferencesOpen,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        closePreferences,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
