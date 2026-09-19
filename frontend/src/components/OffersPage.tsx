"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Copy, Check, PhoneCall, ShieldCheck, Tag, Sparkles, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../constants/config';

export interface OfferItem {
  id: string;
  category: 'International' | 'Domestic' | 'Bank';
  title: string;
  description: string;
  code: string;
  discount: string;
  image: string;
  validity?: string;
}

const ALL_OFFERS: OfferItem[] = [
  {
    id: '1',
    category: 'International',
    title: 'London Fare Special',
    description: 'Special weekend fares for all major cities to London Heathrow & Gatwick. Limited seats available.',
    code: 'LONFARE150',
    discount: 'Save $150',
    image: '/exclusive-offer/offer-1.webp',
    validity: 'Limited Seats'
  },
  {
    id: '2',
    category: 'International',
    title: 'European Summer Sale',
    description: 'Book your dream European vacation now and save big on return tickets across top hubs.',
    code: 'EUROSAVE15',
    discount: 'Up to 15% Off',
    image: '/exclusive-offer/offer-2.webp',
    validity: 'All Europe'
  },
  {
    id: '3',
    category: 'Bank',
    title: 'Partner Card Cashback Deal',
    description: 'Use your partner debit or credit card at checkout to get additional cashback on every flight.',
    code: 'BANKCASH10',
    discount: '10% Cashback',
    image: '/exclusive-offer/offer-5.webp',
    validity: 'Partner Cards'
  },
  {
    id: '4',
    category: 'International',
    title: 'Bali Calling Tropical Deal',
    description: 'Unwind at exotic beaches with our special contracted resort and flight package fares.',
    code: 'BALIDEAL20',
    discount: 'Flat 20% Off',
    image: '/exclusive-offer/offer-4.webp',
    validity: 'Island Specials'
  },
  {
    id: '5',
    category: 'International',
    title: 'Dubai Gateway Package',
    description: 'Complimentary visa assistance and exclusive flight discounts on premium Dubai bookings.',
    code: 'DXBFLY300',
    discount: 'Save $300',
    image: '/exclusive-offer/offer-10.webp',
    validity: 'Direct Routes'
  },
  {
    id: '6',
    category: 'Bank',
    title: 'Credit Card Instant Discount',
    description: 'Get an instant discount of up to $250 on long-haul international sectors with major cards.',
    code: 'CREDITFLY250',
    discount: 'Save $250',
    image: '/exclusive-offer/offer-18.webp',
    validity: 'Major Cards'
  },
  {
    id: '7',
    category: 'International',
    title: 'Amore Italy Package',
    description: 'Experience the romance of Rome, Venice, and Florence with exclusive flight bundles.',
    code: 'ITALYLOVE15',
    discount: 'Flat 15% Off',
    image: '/exclusive-offer/offer-7.webp',
    validity: 'Multi-City'
  },
  {
    id: '8',
    category: 'International',
    title: 'Discover China Deals',
    description: 'Walk the Great Wall and explore ancient heritage temples with seasonal round-trip deals.',
    code: 'CHINATOUR300',
    discount: 'Save $300',
    image: '/exclusive-offer/offer-8.webp',
    validity: 'Round Trips'
  },
  {
    id: '9',
    category: 'International',
    title: 'Singapore City Highlights',
    description: 'Tour Marina Bay Sands, Gardens by the Bay, and Sentosa Island with special airfares.',
    code: 'SINGAFLY10',
    discount: '10% Off',
    image: '/exclusive-offer/offer-9.webp',
    validity: 'City Breaks'
  },
  {
    id: '10',
    category: 'International',
    title: 'Bangkok Adventure Deal',
    description: 'Experience vibrant street markets, ornate shrines, and authentic culinary journeys.',
    code: 'BKKTRIP50',
    discount: 'Save $50',
    image: '/exclusive-offer/offer-3.webp',
    validity: 'Southeast Asia'
  },
  {
    id: '11',
    category: 'Domestic',
    title: 'New York City Explorer',
    description: 'Take a bite out of the Big Apple in NYC. Prime domestic airline seats at discounted rates.',
    code: 'NYCMAGIC250',
    discount: 'Save $250',
    image: '/exclusive-offer/offer-17.webp',
    validity: 'Domestic Flight'
  },
  {
    id: '12',
    category: 'International',
    title: 'Toronto Calling Special',
    description: 'Visit the CN Tower and explore the natural beauty of Ontario with discounted round trips.',
    code: 'YYZDEAL100',
    discount: 'Save $100',
    image: '/exclusive-offer/offer-14.webp',
    validity: 'Canada Routes'
  },
  {
    id: '13',
    category: 'International',
    title: 'Sydney Harbor Holiday',
    description: 'Sun, surf, and the iconic Opera House! Experience Australia with contracted promotional fares.',
    code: 'SYDNEYGO10',
    discount: '10% Cashback',
    image: '/exclusive-offer/offer-13.webp',
    validity: 'Pacific Routes'
  },
  {
    id: '14',
    category: 'International',
    title: 'Paris Romance Getaway',
    description: 'Fall in love with the City of Light. Special couple and family holiday packages available.',
    code: 'PARISLOVE20',
    discount: '20% Off',
    image: '/exclusive-offer/offer-12.webp',
    validity: 'Couples & Family'
  },
  {
    id: '15',
    category: 'Domestic',
    title: 'Florida Coast Getaway',
    description: 'Sunshine, coastal beaches, and family theme parks with special domestic airfare promotions.',
    code: 'FLSUN75',
    discount: 'Save $75',
    image: '/exclusive-offer/offer-15.webp',
    validity: 'Domestic Flights'
  },
  {
    id: '16',
    category: 'International',
    title: 'Istanbul Crossroads',
    description: 'Where East meets West. Discover the Bosphorus, Grand Bazaar, and ancient architecture.',
    code: 'ISTANBUL120',
    discount: 'Save $120',
    image: '/exclusive-offer/offer-16.webp',
    validity: 'Turkey Routes'
  },
  {
    id: '17',
    category: 'International',
    title: 'Tokyo Neon Nights',
    description: 'Explore futuristic Shibuya, ancient Asakusa, and Mt. Fuji with premium airfare deals.',
    code: 'TOKYOTRIP300',
    discount: 'Save $300',
    image: '/exclusive-offer/offer-11.webp',
    validity: 'Asia Flights'
  },
  {
    id: '18',
    category: 'International',
    title: 'Seoul Cultural Tour',
    description: 'K-culture, historic palaces, and bustling shopping districts with verified discounts.',
    code: 'SEOULFLY15',
    discount: 'Flat 15% Off',
    image: '/exclusive-offer/offer-6.webp',
    validity: 'South Korea'
  },
  {
    id: '19',
    category: 'International',
    title: 'Berlin Explorer',
    description: 'Experience the rich history, art galleries, and vibrant culture of Germany’s capital.',
    code: 'BERLINFLY150',
    discount: 'Save $150',
    image: '/exclusive-offer/offer-19.webp',
    validity: 'Europe Sector'
  },
  {
    id: '20',
    category: 'Domestic',
    title: 'Las Vegas Strip Escape',
    description: 'World-class entertainment, luxury resorts, and dining with exclusive domestic flight deals.',
    code: 'VEGAS99',
    discount: 'Flat $100 Off',
    image: '/exclusive-offer/offer-20.webp',
    validity: 'Weekend Specials'
  }
];

interface OffersPageProps {
  onBack: () => void;
}

const OffersPage: React.FC<OffersPageProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<'All' | 'International' | 'Domestic' | 'Bank'>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories = [
    { id: 'All' as const, label: 'All Offers', count: ALL_OFFERS.length },
    { id: 'International' as const, label: 'International', count: ALL_OFFERS.filter(o => o.category === 'International').length },
    { id: 'Domestic' as const, label: 'Domestic', count: ALL_OFFERS.filter(o => o.category === 'Domestic').length },
    { id: 'Bank' as const, label: 'Bank & Cards', count: ALL_OFFERS.filter(o => o.category === 'Bank').length },
  ];

  const filteredOffers = filter === 'All' 
    ? ALL_OFFERS 
    : ALL_OFFERS.filter(o => o.category === filter);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Header & Breadcrumb */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md py-1.5 px-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Flights</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {CONTACT_INFO.AVAILABILITY}
            </span>
            <a
              href={CONTACT_INFO.HOTLINE_TEL}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{CONTACT_INFO.HOTLINE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Travel Promos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Tour Help Desk Exclusives
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Hand-picked airline discounts, bank card offers, and seasonal specials curated by our travel specialists. Copy your promo code and apply it during checkout or over the phone.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredOffers.map((offer, idx) => (
            <article
              key={offer.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={idx < 4}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/85 text-white backdrop-blur-sm shadow-sm">
                    {offer.discount}
                  </span>
                </div>

                {/* Category Pill */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-white/90 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 backdrop-blur-sm">
                    {offer.category}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  <span>{offer.validity || offer.category}</span>
                </div>

                <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {offer.title}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 line-clamp-2 leading-relaxed flex-grow">
                  {offer.description}
                </p>

                {/* Promo Code & Action Box */}
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 px-2.5 py-1 rounded border border-blue-200/60 dark:border-blue-900/40">
                    <Tag className="w-3 h-3 shrink-0" />
                    <span>{offer.code}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(offer.code)}
                    aria-label={`Copy discount promo code ${offer.code}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Unpublished / Call-Only Banner */}
        <section className="mt-14 sm:mt-16 bg-slate-900 text-white rounded-xl p-6 sm:p-8 md:p-10 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-200 mb-4">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Unpublished Airline Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Need Unpublished Fares or Custom Itinerary?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Certain consolidated international fares and business class discounts cannot be published online due to airline contract rules. Call our dedicated booking desk directly to unlock additional offline savings.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={CONTACT_INFO.HOTLINE_TEL}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {CONTACT_INFO.HOTLINE_DISPLAY}</span>
              </a>
              <span className="text-xs text-slate-400">
                Free Consultation &bull; 24/7 Live Concierge &bull; No Obligation
              </span>
            </div>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="mt-14 sm:mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Daily Verified Deals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  All coupon codes and promotion rules are tested and confirmed daily with partner airlines and banks.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Transparent Fare Guarantee</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Zero hidden booking charges. The discount applied is the exact deduction reflected on your ticket.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">24/7 Dedicated Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Need help applying a voucher or booking complex routes? Our live travel agents are available around the clock.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default OffersPage;