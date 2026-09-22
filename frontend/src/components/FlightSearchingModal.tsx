"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AIRPORTS_DATA } from './AirportAutocomplete';

interface FlightSearchingModalProps {
  isOpen: boolean;
  searchParams?: {
    from?: string;
    to?: string;
    date?: string;
    returnDate?: string;
    passengers?: number;
    travelClass?: string;
    airline?: string;
    airlineCode?: string;
  } | null;
  onClose?: () => void;
}

// Lightweight 2KB airline carrier logos (Kiwi CDN - highly cached, instant loading)
const FEATURED_AIRLINE_CODES = ['6E', 'AI', 'EK', 'UA', 'SG', 'QP', 'QR', 'BA'] as const;

const STEPS = [
  'Searching Airlines',
  'Comparing Routes',
  'Checking Live Prices',
  'Verifying Availability',
  'Finalizing Results',
] as const;

/**
 * Lightweight resolver for city name & 3-letter IATA code
 */
const resolveCityAndCode = (val?: string): { city: string; code: string } => {
  if (!val) return { city: 'Departure', code: 'DEP' };

  const clean = val.trim();
  const parenMatch = clean.match(/\(([A-Z]{3})\)/i);
  if (parenMatch) {
    const code = parenMatch[1].toUpperCase();
    const city = clean.replace(/\s*\([A-Z]{3}\).*/i, '').trim();
    return { city, code };
  }

  if (clean.length === 3 && /^[A-Z]{3}$/i.test(clean)) {
    const code = clean.toUpperCase();
    const airport = AIRPORTS_DATA.find((a) => a.code === code);
    return { city: airport?.city || code, code };
  }

  const airport = AIRPORTS_DATA.find(
    (a) =>
      a.city.toLowerCase() === clean.toLowerCase() ||
      a.keywords?.toLowerCase().includes(clean.toLowerCase())
  );
  if (airport) {
    return { city: airport.city, code: airport.code };
  }

  return { city: clean, code: clean.slice(0, 3).toUpperCase() };
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const FlightSearchingModal: React.FC<FlightSearchingModalProps> = React.memo(({
  isOpen,
  searchParams,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2);
  const [progress, setProgress] = useState<number>(60);

  // Dynamic route data
  const origin = useMemo(() => resolveCityAndCode(searchParams?.from), [searchParams?.from]);
  const destination = useMemo(() => resolveCityAndCode(searchParams?.to), [searchParams?.to]);

  // Primary airline code if specified by user search, else default to '6E' (IndiGo)
  const primaryAirlineCode = useMemo(() => {
    return (searchParams?.airlineCode || searchParams?.airline || '6E').slice(0, 2).toUpperCase();
  }, [searchParams?.airlineCode, searchParams?.airline]);

  // Subtitle info: Dates | Passengers | Class
  const subtitleInfo = useMemo(() => {
    const depart = formatDate(searchParams?.date);
    const ret = formatDate(searchParams?.returnDate);
    const dateRange = ret ? `${depart} – ${ret}` : (depart || 'Upcoming Dates');
    const pax = searchParams?.passengers ? `${searchParams.passengers} Passenger${searchParams.passengers > 1 ? 's' : ''}` : '1 Passenger';
    const travelClass = searchParams?.travelClass || 'Economy';
    return `${dateRange}  |  ${pax}  |  ${travelClass}`;
  }, [searchParams]);

  // Real-time animated progress & stepper advancement
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(15);
      return;
    }

    setCurrentStepIndex(0);
    setProgress(20);

    const stepTimers = [
      setTimeout(() => { setCurrentStepIndex(1); setProgress(40); }, 900),
      setTimeout(() => { setCurrentStepIndex(2); setProgress(60); }, 2000),
      setTimeout(() => { setCurrentStepIndex(3); setProgress(82); }, 3800),
      setTimeout(() => { setCurrentStepIndex(4); setProgress(96); }, 5800),
    ];

    return () => {
      stepTimers.forEach(clearTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn">
      {/* Ultra-Compact & Responsive Modal Card */}
      <div className="relative w-full max-w-[94vw] sm:max-w-md md:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 p-3 sm:p-5 overflow-hidden text-slate-800">
        
        {/* Close Button Top Right */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close search popup"
            className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 1. Header: Route with Origin & Destination badges and blue swap arrow */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 w-full px-1">
            
            {/* Origin City & Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {origin.code}
              </div>
              <div className="text-left sm:text-right min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-tight truncate">
                  {origin.city}
                </h3>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {origin.code}
                </span>
              </div>
            </div>

            {/* Blue Bidirectional Arrow */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>

            {/* Destination City & Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-start min-w-0">
              <div className="text-left min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-tight truncate">
                  {destination.city}
                </h3>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {destination.code}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {destination.code}
              </div>
            </div>
          </div>

          {/* Subtitle: Dates | Passenger | Class */}
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1 tracking-tight text-center">
            {subtitleInfo}
          </p>
        </div>

        {/* 2. Super Compact Airplane Animation */}
        <div className="relative w-full max-w-[240px] sm:max-w-xs h-9 sm:h-12 mx-auto flex items-center justify-center my-0.5">
          {/* Subtle cloud backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 240 50" fill="none">
              <ellipse cx="40" cy="30" rx="18" ry="8" fill="#e0f2fe" />
              <ellipse cx="55" cy="25" rx="14" ry="8" fill="#bae6fd" opacity="0.6" />
              <path d="M 35 32 Q 90 38, 130 18 T 205 10" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
              <ellipse cx="195" cy="18" rx="20" ry="9" fill="#e0f2fe" />
            </svg>
          </div>

          {/* Airplane Vector */}
          <div className="relative z-10 transform -rotate-12 translate-y-0.5 animate-pulse">
            <svg className="w-12 sm:w-16 h-auto drop-shadow-2xs" viewBox="0 0 160 80" fill="none">
              <path d="M10 40 C30 38, 90 32, 140 28 C148 27, 155 31, 155 35 C155 38, 148 42, 135 44 C85 50, 30 52, 10 44 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M12 40 L5 20 L22 22 L26 40 Z" fill="#001b69" />
              <path d="M65 42 L85 68 L102 68 L88 40 Z" fill="#001b69" />
              <circle cx="50" cy="38" r="1.5" fill="#64748b" />
              <circle cx="65" cy="37" r="1.5" fill="#64748b" />
              <circle cx="80" cy="36" r="1.5" fill="#64748b" />
              <circle cx="95" cy="35" r="1.5" fill="#64748b" />
              <circle cx="110" cy="34" r="1.5" fill="#64748b" />
              <path d="M142 30 C146 31, 148 33, 146 34 L138 34 Z" fill="#1e293b" />
            </svg>
          </div>
        </div>

        {/* 3. Main Status Text & Airline Badges */}
        <div className="text-center mb-2">
          <h2 className="text-xs sm:text-base font-black text-slate-900 tracking-tight leading-tight">
            Searching for the best flights...
          </h2>
          <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
            Checking live fares across verified airlines
          </p>

          {/* Compact Verified Airline Carrier Logos Strip */}
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {FEATURED_AIRLINE_CODES.slice(0, 6).map((code) => (
              <div
                key={code}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-slate-50 border border-slate-200/80 p-0.5 flex items-center justify-center shadow-2xs"
                title={`Airline ${code}`}
              >
                <img
                  src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
                  alt={code}
                  width={18}
                  height={18}
                  className="w-full h-full object-contain"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Compact Mobile-Friendly Stepper */}
        <div className="w-full max-w-md mx-auto mb-2">
          <div className="flex items-center justify-between relative">
            
            {/* Background connecting track */}
            <div className="absolute top-2.5 sm:top-3 left-2.5 right-2.5 h-0.5 bg-slate-200 -z-0" />
            
            {/* Active blue connecting progress track */}
            <div
              className="absolute top-2.5 sm:top-3 left-2.5 h-0.5 bg-blue-600 transition-all duration-500 ease-out -z-0"
              style={{
                width: `${(currentStepIndex / (STEPS.length - 1)) * 92}%`,
              }}
            />

            {/* Stepper Nodes */}
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  {isCompleted ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-2xs relative">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 animate-ping absolute" />
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 relative" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center" />
                  )}

                  <span
                    className={`mt-1 text-[8px] sm:text-[10px] text-center max-w-[48px] sm:max-w-[65px] leading-tight font-bold ${
                      isActive
                        ? 'text-slate-900 font-extrabold'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Compact Progress Bar */}
        <div className="w-full max-w-md mx-auto flex items-center gap-2 my-1.5">
          <div className="flex-1 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] sm:text-xs font-black text-blue-600 w-7 text-right">
            {progress}%
          </span>
        </div>

        {/* 6. Compact Bottom Trust Status Banner */}
        <div className="bg-[#f0f7ff] border border-blue-100/90 rounded-xl p-2 sm:p-2.5 grid grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] mt-1.5">
          {/* Item 1 */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <div className="leading-none min-w-0">
              <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] truncate">6 travelers</p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 truncate">searching</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-1.5 border-l border-blue-100 pl-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="leading-none min-w-0">
              <p className="text-[8px] sm:text-[9px] text-slate-500 truncate">Usually takes</p>
              <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] truncate">10–20 sec</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-1.5 border-l border-blue-100 pl-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <div className="leading-none min-w-0">
              <p className="font-bold text-slate-900 text-[10px] sm:text-[11px] truncate">Real-time</p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 truncate">Live data</p>
            </div>
          </div>
        </div>

        {/* 7. Footer text */}
        <p className="text-center text-[9px] sm:text-[10px] text-slate-400 font-medium mt-1.5">
          Good things take a moment 💙
        </p>
      </div>
    </div>
  );
});

FlightSearchingModal.displayName = 'FlightSearchingModal';

export default FlightSearchingModal;
