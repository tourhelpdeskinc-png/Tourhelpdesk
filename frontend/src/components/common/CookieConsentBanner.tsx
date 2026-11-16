"use client";

import React from 'react';
import Link from 'next/link';
import { useCookieConsent } from '../../context/CookieConsentContext';

export const CookieConsentBanner: React.FC = () => {
  const { isBannerVisible, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-4 sm:p-6 pointer-events-auto transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          {/* Information & Icon */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs border border-blue-100 dark:border-blue-900/40 text-xl sm:text-2xl">
              🍪
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Your Privacy & Cookie Choices
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                  Zero Ad-Tracking by Default
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We use essential cookies to keep flight search and booking inquiry sessions secure. With your permission, we also use cookies to remember your preferred currency (CAD, USD, INR) and dark mode.{' '}
                <Link
                  href="/cookie-policy"
                  className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Learn more in our Cookie Policy
                </Link>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={openPreferences}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer text-center"
            >
              Customize
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer text-center"
            >
              Essential Only
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
    </aside>
  );
};

export default CookieConsentBanner;
