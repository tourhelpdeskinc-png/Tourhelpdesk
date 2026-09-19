"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  keywords?: string;
}

export const AIRPORTS_DATA: Airport[] = [
  // --- CANADA (Primary Hubs) ---
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson International Airport', keywords: 'toronto yyz canada ontario pearson' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International Airport', keywords: 'vancouver yvr canada bc british columbia richmond' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', name: 'Montréal-Trudeau International Airport', keywords: 'montreal yul canada quebec trudeau' },
  { code: 'YYC', city: 'Calgary', country: 'Canada', name: 'Calgary International Airport', keywords: 'calgary yyc canada alberta' },
  { code: 'YEG', city: 'Edmonton', country: 'Canada', name: 'Edmonton International Airport', keywords: 'edmonton yeg canada alberta' },
  { code: 'YOW', city: 'Ottawa', country: 'Canada', name: 'Ottawa Macdonald-Cartier International', keywords: 'ottawa yow canada ontario capital' },
  { code: 'YWG', city: 'Winnipeg', country: 'Canada', name: 'Winnipeg Richardson International Airport', keywords: 'winnipeg ywg canada manitoba' },
  { code: 'YHZ', city: 'Halifax', country: 'Canada', name: 'Halifax Stanfield International Airport', keywords: 'halifax yhz canada nova scotia' },
  { code: 'YYJ', city: 'Victoria', country: 'Canada', name: 'Victoria International Airport', keywords: 'victoria yyj canada bc vancouver island' },
  { code: 'YQB', city: 'Quebec City', country: 'Canada', name: 'Québec City Jean Lesage International', keywords: 'quebec yqb canada' },
  { code: 'YLW', city: 'Kelowna', country: 'Canada', name: 'Kelowna International Airport', keywords: 'kelowna ylw canada bc okanagan' },
  { code: 'YTZ', city: 'Toronto (City)', country: 'Canada', name: 'Billy Bishop Toronto City Airport', keywords: 'billy bishop island toronto ytz canada' },

  // --- UNITED STATES ---
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International Airport', keywords: 'new york jfk nyc usa queens kennedy' },
  { code: 'EWR', city: 'Newark / New York', country: 'USA', name: 'Newark Liberty International Airport', keywords: 'newark new york ewr nyc usa new jersey' },
  { code: 'LGA', city: 'New York (LaGuardia)', country: 'USA', name: 'LaGuardia Airport', keywords: 'laguardia lga new york nyc usa' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International Airport', keywords: 'los angeles lax california usa lax' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', name: 'San Francisco International Airport', keywords: 'san francisco sfo california usa bay area' },
  { code: 'SEA', city: 'Seattle', country: 'USA', name: 'Seattle-Tacoma International Airport', keywords: 'seattle sea seatac washington usa' },
  { code: 'ORD', city: 'Chicago', country: 'USA', name: 'O\'Hare International Airport', keywords: 'chicago ord ohare illinois usa' },
  { code: 'MIA', city: 'Miami', country: 'USA', name: 'Miami International Airport', keywords: 'miami mia florida usa' },
  { code: 'BOS', city: 'Boston', country: 'USA', name: 'Boston Logan International Airport', keywords: 'boston bos logan massachusetts usa' },
  { code: 'DFW', city: 'Dallas / Fort Worth', country: 'USA', name: 'Dallas/Fort Worth International', keywords: 'dallas dfw texas usa' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', name: 'Hartsfield-Jackson Atlanta Intl', keywords: 'atlanta atl georgia usa' },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', name: 'Harry Reid International Airport', keywords: 'las vegas las mccarran nevada usa' },
  { code: 'MCO', city: 'Orlando', country: 'USA', name: 'Orlando International Airport', keywords: 'orlando mco florida disney usa' },

  // --- UNITED KINGDOM & EUROPE ---
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport', keywords: 'london lhr heathrow uk england europe' },
  { code: 'LGW', city: 'London (Gatwick)', country: 'UK', name: 'Gatwick Airport', keywords: 'london lgw gatwick uk england' },
  { code: 'MAN', city: 'Manchester', country: 'UK', name: 'Manchester Airport', keywords: 'manchester man uk england' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport', keywords: 'paris cdg france europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Airport Schiphol', keywords: 'amsterdam ams schiphol netherlands europe' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport', keywords: 'frankfurt fra germany europe' },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Leonardo da Vinci–Fiumicino Airport', keywords: 'rome fco fiumicino italy europe' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', name: 'Adolfo Suárez Madrid–Barajas Airport', keywords: 'madrid mad spain europe' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Airport', keywords: 'zurich zrh switzerland europe' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', name: 'Dublin Airport', keywords: 'dublin dub ireland europe' },

  // --- MIDDLE EAST & ASIA PACIFIC ---
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport', keywords: 'dubai dxb uae emirates' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', name: 'Abu Dhabi International Airport', keywords: 'abu dhabi auh uae' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport', keywords: 'doha doh qatar hamad' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport', keywords: 'singapore sin changi asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport', keywords: 'bangkok bkk suvarnabhumi thailand' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport', keywords: 'kuala lumpur kul malaysia klia' },
  { code: 'HND', city: 'Tokyo (Haneda)', country: 'Japan', name: 'Tokyo Haneda Airport', keywords: 'tokyo hnd haneda japan' },
  { code: 'NRT', city: 'Tokyo (Narita)', country: 'Japan', name: 'Narita International Airport', keywords: 'tokyo nrt narita japan' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', name: 'Hong Kong International Airport', keywords: 'hong kong hkg chek lap kok' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', name: 'Incheon International Airport', keywords: 'seoul icn incheon korea' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith Airport', keywords: 'sydney syd australia' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport', keywords: 'melbourne mel australia tullamarine' },

  // --- INDIA ---
  { code: 'DEL', city: 'Delhi / New Delhi', country: 'India', name: 'Indira Gandhi International Airport', keywords: 'delhi new delhi igi igiat ndls' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj Intl', keywords: 'mumbai bombay csia csmit' },
  { code: 'BLR', city: 'Bengaluru / Bangalore', country: 'India', name: 'Kempegowda International Airport', keywords: 'bangalore bengaluru kemp' },
  { code: 'MAA', city: 'Chennai / Madras', country: 'India', name: 'Chennai International Airport', keywords: 'chennai madras' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International Airport', keywords: 'hyderabad rgia secunderabad' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose Intl', keywords: 'kolkata calcutta dumdum' },
  { code: 'AMD', city: 'Ahmedabad', country: 'India', name: 'Sardar Vallabhbhai Patel Intl', keywords: 'ahmedabad gujarat svpi' },
  { code: 'COK', city: 'Kochi / Cochin', country: 'India', name: 'Cochin International Airport', keywords: 'kochi cochin kerala cial' },
  { code: 'ATQ', city: 'Amritsar', country: 'India', name: 'Sri Guru Ram Dass Jee Intl', keywords: 'amritsar punjab raja sansi' },
  { code: 'IXC', city: 'Chandigarh', country: 'India', name: 'Chandigarh International Airport', keywords: 'chandigarh mohali punjab haryana' },
  { code: 'PNQ', city: 'Pune', country: 'India', name: 'Pune Airport', keywords: 'pune maharashtra lohegaon' },
  { code: 'JAI', city: 'Jaipur', country: 'India', name: 'Jaipur International Airport', keywords: 'jaipur rajasthan sanganer' },
  { code: 'LKO', city: 'Lucknow', country: 'India', name: 'Chaudhary Charan Singh Intl', keywords: 'lucknow up uttar pradesh amausi' },
  { code: 'GOI', city: 'Goa', country: 'India', name: 'Goa Dabolim / Mopa Airport', keywords: 'goa dabolim mopa' },
];

// Helper: Resolve any free text or display label to 3-letter IATA code
export function resolveIataCode(inputStr: string): string {
  if (!inputStr) return '';
  const trimmed = inputStr.trim();
  
  // 1. Check if string contains (CODE) format e.g. "Toronto (YYZ)" or "Delhi (DEL)"
  const codeMatch = trimmed.match(/\(([A-Za-z]{3})\)/);
  if (codeMatch) return codeMatch[1].toUpperCase();

  const lower = trimmed.toLowerCase();

  // 2. Direct exact 3-letter code match in dataset
  const exactByCode = AIRPORTS_DATA.find(a => a.code.toLowerCase() === lower);
  if (exactByCode) return exactByCode.code;

  // 3. Fallback to 3 uppercase letters if valid 3-letter code
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // 4. Exact city match
  const exactByCity = AIRPORTS_DATA.find(a => a.city.toLowerCase() === lower);
  if (exactByCity) return exactByCity.code;

  // 5. Match by prefix / search (requires at least 3 characters to avoid false matches)
  if (lower.length >= 3) {
    const startsByCity = AIRPORTS_DATA.find(a => a.city.toLowerCase().startsWith(lower));
    if (startsByCity) return startsByCity.code;

    const matched = AIRPORTS_DATA.find(a => 
      a.city.toLowerCase().includes(lower) || 
      a.name.toLowerCase().includes(lower) ||
      (a.keywords && a.keywords.toLowerCase().includes(lower))
    );
    if (matched) return matched.code;
  }

  return '';
}

interface AirportAutocompleteProps {
  name: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string, airport?: Airport) => void;
  required?: boolean;
  flat?: boolean;
  variant?: 'default' | 'mmt';
  className?: string;
  defaultCode?: string;
}

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  name,
  placeholder,
  value: externalValue,
  onChange,
  required = false,
  flat = false,
  variant = 'default',
  className = '',
  defaultCode
}) => {
  const defaultAirport = defaultCode 
    ? AIRPORTS_DATA.find(a => a.code.toLowerCase() === defaultCode.toLowerCase())
    : null;

  const [query, setQuery] = useState<string>(
    externalValue || (defaultAirport ? `${defaultAirport.city} (${defaultAirport.code})` : '')
  );
  const [selectedCode, setSelectedCode] = useState<string>(
    defaultAirport ? defaultAirport.code : (externalValue ? resolveIataCode(externalValue) : '')
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [recentAirports, setRecentAirports] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocusedRef = useRef<boolean>(false);

  // Load recent searches on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tourhelpdesk_recent_airports');
        if (saved) {
          setRecentAirports(JSON.parse(saved));
        }
      } catch {}
    }
  }, []);

  // Sync externalValue prop changes if provided (ONLY when user is not actively typing)
  useEffect(() => {
    if (externalValue !== undefined && !isFocusedRef.current) {
      setQuery(externalValue);
      if (externalValue.trim()) {
        const code = resolveIataCode(externalValue);
        setSelectedCode(code);
      } else {
        setSelectedCode('');
      }
    }
  }, [externalValue]);

  // Current matched airport
  const currentAirport = useMemo(() => {
    if (selectedCode) {
      return AIRPORTS_DATA.find(a => a.code.toLowerCase() === selectedCode.toLowerCase()) || null;
    }
    if (!query || query.trim().length === 0) return null;
    const resolved = resolveIataCode(query);
    if (!resolved) return null;
    return AIRPORTS_DATA.find(a => a.code.toLowerCase() === resolved.toLowerCase()) || null;
  }, [selectedCode, query]);

  // Filter airports based on query search term with smart relevance sorting
  const filteredAirports = useMemo(() => {
    if (!query || query.trim().length < 1) {
      // Prioritize Canadian and top international hubs on empty query
      return AIRPORTS_DATA.slice(0, 12);
    }

    const q = query.toLowerCase().trim();
    
    // Sort relevance:
    // 1. Exact 3-letter IATA code match
    const exactCode = AIRPORTS_DATA.filter(a => a.code.toLowerCase() === q);
    // 2. Code starts with query
    const startsWithCode = AIRPORTS_DATA.filter(a => a.code.toLowerCase().startsWith(q) && a.code.toLowerCase() !== q);
    // 3. City starts with query
    const startsWithCity = AIRPORTS_DATA.filter(a => 
      a.city.toLowerCase().startsWith(q) && 
      !startsWithCode.includes(a) && 
      !exactCode.includes(a)
    );
    // 4. Other matches (city contains, airport name contains, keywords contain)
    const others = AIRPORTS_DATA.filter(a =>
      !exactCode.includes(a) &&
      !startsWithCode.includes(a) &&
      !startsWithCity.includes(a) &&
      (a.city.toLowerCase().includes(q) ||
       a.name.toLowerCase().includes(q) ||
       a.country.toLowerCase().includes(q) ||
       (a.keywords && a.keywords.toLowerCase().includes(q)))
    );

    return [...exactCode, ...startsWithCode, ...startsWithCity, ...others].slice(0, 15);
  }, [query]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Handle select airport item
  const handleSelect = (airport: Airport) => {
    const displayLabel = `${airport.city} (${airport.code})`;
    setQuery(displayLabel);
    setSelectedCode(airport.code);
    setIsOpen(false);
    isFocusedRef.current = false;

    // Save to recents
    if (typeof window !== 'undefined') {
      try {
        const next = [airport, ...recentAirports.filter(r => r.code !== airport.code)].slice(0, 4);
        setRecentAirports(next);
        localStorage.setItem('tourhelpdesk_recent_airports', JSON.stringify(next));
      } catch {}
    }

    if (onChange) {
      onChange(displayLabel, airport);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredAirports.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredAirports.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAirports[activeIndex]) {
        handleSelect(filteredAirports[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Handle input text typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedCode(''); // Reset confirmed code while actively typing
    setIsOpen(true);

    // Pass the raw typing to parent without forcing code resolution
    if (onChange) {
      const resolved = resolveIataCode(val);
      const matched = resolved ? AIRPORTS_DATA.find(a => a.code.toLowerCase() === resolved.toLowerCase()) : undefined;
      onChange(val, matched);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    setIsOpen(true);
    // Auto-select entire text on focus so user can immediately type to replace without backspacing
    e.target.select();
  };

  const handleBlur = () => {
    // Delay to allow clicking on dropdown options
    setTimeout(() => {
      isFocusedRef.current = false;
      setIsOpen(false);

      // If user typed something and blurred without clicking, try to resolve to closest match
      if (query.trim() && !selectedCode) {
        const resolved = resolveIataCode(query);
        const matched = resolved ? AIRPORTS_DATA.find(a => a.code.toLowerCase() === resolved.toLowerCase()) : null;
        if (matched) {
          handleSelect(matched);
        }
      }
    }, 250);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        isFocusedRef.current = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {variant === 'mmt' ? (
        <div 
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
          className="cursor-text min-w-0 group/input relative"
        >
          <div className="flex items-center justify-between gap-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              required={required}
              autoComplete="off"
              spellCheck={false}
              className={`w-full bg-transparent border-0 outline-none p-0 tracking-tight focus:ring-0 focus:outline-none font-black text-lg sm:text-xl md:text-2xl truncate transition-colors ${
                query ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 font-bold'
              }`}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuery('');
                  setSelectedCode('');
                  if (onChange) onChange('', undefined);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
                className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs shrink-0 transition-colors cursor-pointer"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5 pointer-events-none">
            {currentAirport 
              ? `${currentAirport.code}, ${currentAirport.name}` 
              : (query ? 'Select from list below' : 'Enter city, airport or code')}
          </p>
        </div>
      ) : (
        /* Standard Flat / Default Input */
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            required={required}
            autoComplete="off"
            spellCheck={false}
            className={flat 
              ? "w-full bg-transparent border-0 outline-none p-0 text-slate-800 dark:text-white font-extrabold text-xs sm:text-[15px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none"
              : "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none font-bold text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            }
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuery('');
                setSelectedCode('');
                if (onChange) onChange('', undefined);
                setTimeout(() => inputRef.current?.focus(), 10);
              }}
              className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] shrink-0 ml-1 hover:bg-slate-300 cursor-pointer"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Hidden Input for Form Submission: ALWAYS SENDS ONLY THE 3-LETTER IATA CODE (e.g. YYZ, YVR, DEL, BOM) */}
      <input 
        type="hidden" 
        name={name} 
        value={selectedCode || resolveIataCode(query)} 
      />

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[280px] sm:min-w-[340px]">
          {/* Recent Searches Header if empty query */}
          {(!query || query.trim().length === 0) && recentAirports.length > 0 && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#E8A11A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Searches
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRecentAirports([]);
                  localStorage.removeItem('tourhelpdesk_recent_airports');
                }}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={airport.code}
                    type="button"
                    className={`w-full px-4 py-3 flex items-center justify-between transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 text-left group cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50/90 dark:bg-slate-800/90 ring-1 ring-blue-500/20' 
                        : 'hover:bg-blue-50/80 dark:hover:bg-slate-800/60'
                    }`}
                    onMouseDown={(e) => {
                      // Use onMouseDown to ensure selection registers before input onBlur fires
                      e.preventDefault();
                      handleSelect(airport);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                      }`}>
                        ✈
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-extrabold text-xs sm:text-sm truncate transition-colors ${
                          isActive 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          {airport.city}, {airport.country}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {airport.name}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      {airport.code}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs">No airports found matching "{query}"</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try city name (Toronto, Vancouver) or code (YYZ, YVR)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
