"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, ShieldCheck } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const HOME_FAQS: FaqItem[] = [
  {
    q: "What is TourHelpDesk and how does it work?",
    a: "TourHelpDesk is a full-service travel booking platform and 24/7 concierge. We compare live fares across 500+ global airlines, luxury hotels, and intercity buses in real time, while offering exclusive unpublished offline phone discounts to ensure travelers get the lowest guaranteed rate."
  },
  {
    q: "How do I access unpublished offline flight discounts?",
    a: "Airlines often provide consolidated fares that cannot be published online due to airline advertising agreements. You can access these phone-only discounts starting from $49 by calling our 24/7 Booking Desk toll-free at +1 (888) 791-8007."
  },
  {
    q: "Can I book flights, hotels, and buses from one place?",
    a: "Yes. TourHelpDesk offers complete end-to-end trip planning. You can search, compare, and reserve domestic and international flights, boutique and luxury hotel stays, and intercity coach tickets all within our secure platform."
  },
  {
    q: "What is your ticket cancellation and modification policy?",
    a: "Ticket changes and cancellations depend on the specific airline or hotel tariff rules. Our 24/7 support desk is always available at +1 (888) 791-8007 to process date changes, seat reassignments, and eligible refunds with zero hassle."
  },
  {
    q: "Are there any hidden fees or extra surcharges at checkout?",
    a: "No, never. We believe in 100% transparent travel pricing. All flight quotes and hotel prices include mandatory government taxes and standard carrier charges before you confirm payment."
  },
  {
    q: "Is payment on TourHelpDesk safe and protected?",
    a: "Yes. All transactions are protected by bank-level 256-bit SSL encryption and processed in compliance with strict PCI-DSS payment security standards."
  }
];

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": HOME_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-2xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Traveler Help & FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Everything you need to know about booking cheap flights, luxury stays, and 24/7 phone assistance.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>📅</span>
            <span>Last Updated: November 2026</span>
          </div>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 24/7 Call to Action Box */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="text-left">
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2 justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Need custom itinerary assistance?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Call our certified travel specialists for unpublished phone fares and instant bookings.
            </p>
          </div>
          <a
            href="tel:+18887918007"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+1 (888) 791-8007</span>
          </a>
        </div>
      </div>
    </section>
  );
}
