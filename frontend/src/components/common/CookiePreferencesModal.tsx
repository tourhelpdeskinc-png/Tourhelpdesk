"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '../../context/CookieConsentContext';

export const CookiePreferencesModal: React.FC = () => {
  const { consent, isPreferencesOpen, closePreferences, savePreferences, acceptAll } = useCookieConsent();

  // Local state for checkboxes
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal opens or existing consent changes
  useEffect(() => {
    if (consent) {
      setFunctional(consent.functional);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    } else {
      setFunctional(false);
      setAnalytics(false);
      setMarketing(false);
    }
    setIsSaved(false);
  }, [consent, isPreferencesOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isPreferencesOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreferences();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreferencesOpen, closePreferences]);

  if (!isPreferencesOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      savePreferences({ functional, analytics, marketing });
    }, 200);
  };

  const handleDisableAll = () => {
    setFunctional(false);
    setAnalytics(false);
    setMarketing(false);
  };

  const handleEnableAll = () => {
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closePreferences}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40 text-xl">
              ⚙️
            </div>
            <div>
              <h2 id="cookie-preferences-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Customize Cookie Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose which non-essential cookies you allow on your device
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closePreferences}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close preferences modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Bulk Actions */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Quick selection:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDisableAll}
              className="font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              Disable All Optional
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <button
              type="button"
              onClick={handleEnableAll}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Enable All Optional
            </button>
          </div>
        </div>

        {/* Category List (Scrollable) */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          {/* 1. Essential Cookies */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Strictly Necessary</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  Required
                </span>
              </div>
              {/* Locked Active Toggle */}
              <div className="w-11 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1 opacity-70 cursor-not-allowed">
                <div className="w-4 h-4 bg-white rounded-full shadow-xs"></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Required for basic website security, login session tokens, CSRF protection, and submitting flight booking inquiries. Cannot be disabled.
            </p>
          </div>

          {/* 2. Functional Cookies */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Functional & Preferences</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                  Recommended
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600 rounded-full"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Remembers your chosen currency (e.g. CAD, USD, INR), Light/Dark visual theme, and recently searched airport codes so you don't have to keep reselecting them.
            </p>
          </div>

          {/* 3. Analytics Cookies */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Analytics & Performance</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Optional
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600 rounded-full"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Helps us see anonymous page load speeds and traffic patterns to ensure flight searching doesn't lag during peak holiday booking periods.
            </p>
          </div>

          {/* 4. Marketing Cookies */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Marketing & Advertising</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
                  Opt-In
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600 rounded-full"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Allows our promotional partners (like Taboola on cheap-flight discount deals) to measure campaign performance. Third-party marketing pixels never run until this is enabled.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Link
            href="/cookie-policy"
            onClick={closePreferences}
            className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline"
          >
            Read Full Cookie Policy
          </Link>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-white bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer text-center"
            >
              {isSaved ? 'Saving...' : 'Save My Choices'}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;
