"use client";

import React, { useState } from 'react';
import LegalPageLayout from './layout/LegalPageLayout';
import { useCookieConsent } from '../context/CookieConsentContext';
import { CONTACT_INFO } from '../constants/config';

interface CookiePolicyPageProps {
  onBack: () => void;
}

const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onBack }) => {
  const { consent, openPreferences } = useCookieConsent();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <LegalPageLayout
      title="Cookie Policy"
      effectiveDate="Last Updated: November 17, 2026. Plain English, transparent privacy, and total traveler control."
      onBack={onBack}
    >
      <div className="space-y-14">
        {/* At A Glance (TL;DR) Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-blue-50/80 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 border border-blue-100 dark:border-blue-900/40 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cookie Policy at a Glance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
            Clear, Honest & Traveler-First
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl">
            We built TourHelpDesk to make finding cheap flights simple and secure. We do not sell your personal details, and we only use non-essential cookies if you explicitly say it's okay.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Essential for Booking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Keeps your flight search session alive and protects booking inquiry forms from resetting.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl mb-2">💵</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Your Currency & Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Remembers if you prefer Canadian Dollars ($ CAD) or Dark Mode, so you don't have to re-select it.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">You Are in Charge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Change your consent at any time in one click. Optional cookies never load without your permission.
              </p>
            </div>
          </div>
        </div>

        {/* Live Consent Status & Quick Settings Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Current Active Cookie Settings
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Essential: Active (Locked)
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${consent?.functional ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                Functional: {consent?.functional ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${consent?.analytics ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                Analytics: {consent?.analytics ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${consent?.marketing ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                Marketing: {consent?.marketing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openPreferences}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0 text-center"
          >
            Update Cookie Preferences
          </button>
        </div>

        {/* Quick Navigation Anchor Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[11px] mr-1">Jump to:</span>
          <a href="#what-are-cookies" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">What Are Cookies?</a>
          <a href="#why-we-use" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Why We Use Them</a>
          <a href="#categories" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Types of Cookies</a>
          <a href="#inventory" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Exact Cookie List</a>
          <a href="#managing" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">How to Manage</a>
          <a href="#faq" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Traveler FAQ</a>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">01</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Introduction</h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-base">
            <p>
              Welcome to TourHelpDesk (operated by <strong>Tour Help Desk Inc.</strong>, British Columbia Registration #1578191). We want your travel booking journey to be as transparent, reliable, and stress-free as possible.
            </p>
            <p>
              When you visit <strong>TourHelpDesk.com</strong>, we use small data storage files known as cookies and modern browser storage to ensure our search engine runs fast, flights remain accurate, and your preferences stay put. This policy outlines exactly what we store, why we store it, and how you can change your mind anytime.
            </p>
          </div>
        </section>

        {/* 2. What Are Cookies? */}
        <section id="what-are-cookies" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">02</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">What Are Cookies & Local Storage?</h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-base">
            <p>
              Think of cookies as <em>digital travel bookmarks</em>. When you browse flights, compare hotels, or select a currency, a tiny text file on your device tells our servers who you are during that visit so you don't have to keep retyping your search details.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Session Cookies</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Active only while you have your browser open. As soon as you close your window or finish booking, these disappear automatically.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Persistent Cookies & LocalStorage</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Files that stay saved on your device for a fixed period (typically 30 days to 1 year) so your preferred currency and light/dark theme persist between visits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Why We Use Cookies */}
        <section id="why-we-use" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">03</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Why We Use Cookies</h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 text-base">
            <p>We use these technologies for sensible, traveler-oriented reasons:</p>
            <ul className="space-y-3 pt-1">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Seamless Flight Searching:</strong> Keeps your departure and arrival dates in memory so when you click a flight details card, your search isn't lost.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Security & Anti-Fraud:</strong> Protects your account sessions and ensures flight booking inquiries are authentic and safeguarded from duplicate clicks.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Currency & Appearance:</strong> Saves whether you want prices in USD, CAD, EUR, GBP, or INR, and keeps your preferred display mode active.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Faster Performance:</strong> Helps our infrastructure detect slow network routes and keep response times swift under heavy flight search volume.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Types of Cookies We Use */}
        <section id="categories" className="space-y-5 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">04</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Types of Cookies We Use</h2>
          </div>

          <div className="space-y-4">
            {/* Essential */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  1. Essential & Strictly Necessary Cookies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Always Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                These are mandatory for the website to function securely. They protect login authentication tokens, maintain your booking session, and prevent form tampering.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Real-World Example:</strong> When you submit a zero-risk booking request, our servers generate an anti-duplicate token so you are never charged twice or submitted with incomplete passenger data.
              </div>
            </div>

            {/* Functional */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  2. Functional & Preference Cookies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  User Choice
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Functional cookies help make the site feel like yours. They remember choices you make across sessions to save you time.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Real-World Example:</strong> If you select Canadian Dollars ($ CAD) in the currency selector, we save this setting so all subsequent searches automatically calculate in CAD.
              </div>
            </div>

            {/* Analytics */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  3. Analytics Cookies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  User Choice
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Collects aggregated, anonymous statistics about how travelers navigate through flight schedules and hotel reviews.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Real-World Example:</strong> Helps our engineers identify if an airline filter button is hard to tap on mobile screens so we can fix it.
              </div>
            </div>

            {/* Performance */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  4. Performance Cookies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  User Choice
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Monitors page load latency, network response speeds, and server health during high-volume flight booking campaigns.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Real-World Example:</strong> Measures if flight fare searches take longer than 2 seconds so our caching layer can optimize airline API connections.
              </div>
            </div>

            {/* Marketing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  5. Marketing & Advertising Cookies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Requires Opt-In
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Used with promotional partners (such as Taboola and Microsoft Advertising / Bing UET on cheap flight promotions) to evaluate campaign conversion and show relevant flight deals rather than repetitive generic ads.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Gated Script Guarantee:</strong> In accordance with our consent system, third-party marketing pixels remain completely dormant and will never load or execute until you click "Accept All" or toggle Marketing ON.
              </div>
            </div>
          </div>
        </section>

        {/* 5. Third-Party Cookies */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">05</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Third-Party Cookies</h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 text-base">
            <p>
              To offer modern convenience, TourHelpDesk partners with select technology providers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google OAuth:</strong> Allows travelers to sign in instantly using their Google account without remembering separate passwords. Google sets security tokens to prevent fraudulent sign-ins.</li>
              <li><strong>Taboola:</strong> Advertising conversion tracking on specialized landing pages (e.g. cheap-flights) to track which discounts are performing best.</li>
              <li><strong>Microsoft Advertising (Bing UET):</strong> Universal Event Tracking tag on <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">/cheap-flights</code> to measure search campaign effectiveness and flight inquiry conversions (consent-gated).</li>
              <li><strong>Forex Exchange APIs:</strong> Caches real-time exchange rates to display accurate currency conversions without querying external banks repeatedly.</li>
            </ul>
          </div>
        </section>

        {/* 6. Exact Cookie List */}
        <section id="inventory" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">06</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Exact Cookie Inventory</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Here is the transparent list of storage identifiers used across our website:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Identifier</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">What it Does</th>
                  <th className="py-3.5 px-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">thd_cookie_consent_v1</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Essential</td>
                  <td className="py-3 px-4">TourHelpDesk</td>
                  <td className="py-3 px-4">Saves your cookie choices so we don't nag you with the banner every reload.</td>
                  <td className="py-3 px-4">12 Months</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">auth_token</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Essential</td>
                  <td className="py-3 px-4">TourHelpDesk</td>
                  <td className="py-3 px-4">Cryptographically keeps you signed in to view past booking inquiries.</td>
                  <td className="py-3 px-4">7 Days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">tourhelpdesk_currency</td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">Functional</td>
                  <td className="py-3 px-4">TourHelpDesk</td>
                  <td className="py-3 px-4">Remembers your preferred currency (USD, CAD, EUR, INR, GBP).</td>
                  <td className="py-3 px-4">Persistent</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">theme</td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">Functional</td>
                  <td className="py-3 px-4">TourHelpDesk</td>
                  <td className="py-3 px-4">Remembers whether you turned Dark Mode ON or OFF.</td>
                  <td className="py-3 px-4">Persistent</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">recent_searches</td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">Functional</td>
                  <td className="py-3 px-4">TourHelpDesk</td>
                  <td className="py-3 px-4">Remembers your recent flight search routes in the search bar autocomplete.</td>
                  <td className="py-3 px-4">90 Days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">tb_tfa_script</td>
                  <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Marketing</td>
                  <td className="py-3 px-4">Taboola</td>
                  <td className="py-3 px-4">Attribution pixel for promotional flight deals. Only runs if you opt in.</td>
                  <td className="py-3 px-4">Session / 13 Mo.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">_uetsid / _uetvid</td>
                  <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Marketing</td>
                  <td className="py-3 px-4">Microsoft Bing</td>
                  <td className="py-3 px-4">Conversion and remarketing tag on <code className="text-xs font-mono">/cheap-flights</code>. Only loads after marketing opt-in.</td>
                  <td className="py-3 px-4">1 Day / 13 Mo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. How to Manage and Disable */}
        <section id="managing" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">07</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Managing & Disabling Cookies</h2>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-base">
            <p>
              You don't need technical skills to control your cookies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Option A: Use Our One-Click Panel</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Click the button below or tap "Cookie Preferences" in the footer anytime to toggle functional, analytics, or marketing cookies.
                </p>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Open Cookie Settings
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Option B: Use Your Browser Settings</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Every modern browser lets you inspect, block, or clear all cookies from your device cache:
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Chrome</a>
                  <span className="text-slate-400">•</span>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Safari</a>
                  <span className="text-slate-400">•</span>
                  <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Firefox</a>
                  <span className="text-slate-400">•</span>
                  <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Edge</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Retention */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">08</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Cookie Retention</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We store cookies only for as long as they are useful for your travel booking experience. Session data clears immediately when you close your browser. Preferences like currency and theme remain saved for up to 12 months unless you clear them manually.
          </p>
        </section>

        {/* 9. Policy Changes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">09</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Changes to This Policy</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            As we introduce new features (like airline seat map pickers or bundle deals), we may update this policy. We will always update the "Last Updated" date at the top so you can see when changes were made.
          </p>
        </section>

        {/* 10. Traveler FAQ */}
        <section id="faq" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">10</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Traveler FAQ</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Can I still search and book flights if I reject optional cookies?",
                a: "Yes, absolutely! The flight booking engine, search filters, and customer service hotline work 100% normally even if you only allow Essential cookies."
              },
              {
                q: "Do cookies ever store my credit card, banking, or passport numbers?",
                a: "No, never. Sensitive payment details and passport credentials are strictly processed through encrypted HTTPS security channels and are never stored in browser cookies or client storage."
              },
              {
                q: "How do I change my mind after clicking Accept All?",
                a: "Just scroll down to the footer of any page on TourHelpDesk and click 'Cookie Preferences', or tap the 'Update Cookie Preferences' button on this page."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`text-slate-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 11. Contact Info */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">11</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Questions & Contact</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Have a question about our data practices or need help booking your journey? Our Canadian headquarters and 24/7 travel desk are here for you:
          </p>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white text-base">Tour Help Desk Inc.</p>
            <p>7952, Graham Ave, Burnaby, BC, V3N1V9, Canada</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">British Columbia Registration: #1578191</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-8">
              <p>
                <strong>Privacy Inquiries:</strong>{' '}
                <a href="mailto:legal@tourhelpdesk.com" className="text-blue-600 dark:text-blue-400 underline font-medium">
                  {CONTACT_INFO.LEGAL_EMAIL}
                </a>
              </p>
              <p>
                <strong>24/7 Booking Desk:</strong>{' '}
                <a href={CONTACT_INFO.HOTLINE_TEL} className="text-blue-600 dark:text-blue-400 underline font-semibold">
                  {CONTACT_INFO.HOTLINE_DISPLAY}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default CookiePolicyPage;
