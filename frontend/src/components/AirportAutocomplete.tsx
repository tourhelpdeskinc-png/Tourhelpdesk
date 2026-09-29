"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';

import { flightService } from '../services/flightService';

export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  keywords?: string;
}

export const AIRPORTS_DATA: Airport[] = [
  // --- NEPAL & SOUTH ASIA ---
  { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International Airport', keywords: 'kathmandu khatmandu khat ktm nepal tribhuvan bagmati' },
  { code: 'PKR', city: 'Pokhara', country: 'Nepal', name: 'Pokhara International Airport', keywords: 'pokhara pkr nepal gandaki' },
  { code: 'BWA', city: 'Bhairahawa', country: 'Nepal', name: 'Gautam Buddha International Airport', keywords: 'bhairahawa bwa nepal lumbini' },
  { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Hazrat Shahjalal International Airport', keywords: 'dhaka dac bangladesh shahjalal' },
  { code: 'CGP', city: 'Chittagong', country: 'Bangladesh', name: 'Shah Amanat International Airport', keywords: 'chittagong cgp bangladesh' },
  { code: 'CMB', city: 'Colombo', country: 'Sri Lanka', name: 'Bandaranaike International Airport', keywords: 'colombo cmb sri lanka bandaranaike' },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International Airport', keywords: 'male mle maldives velana' },
  { code: 'ISB', city: 'Islamabad', country: 'Pakistan', name: 'Islamabad International Airport', keywords: 'islamabad isb pakistan' },
  { code: 'LHE', city: 'Lahore', country: 'Pakistan', name: 'Allama Iqbal International Airport', keywords: 'lahore lhe pakistan' },
  { code: 'KHI', city: 'Karachi', country: 'Pakistan', name: 'Jinnah International Airport', keywords: 'karachi khi pakistan' },

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
  { code: 'IAH', city: 'Houston', country: 'USA', name: 'George Bush Intercontinental Airport', keywords: 'houston iah texas usa' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', name: 'Hartsfield-Jackson Atlanta Intl', keywords: 'atlanta atl georgia usa' },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', name: 'Harry Reid International Airport', keywords: 'las vegas las mccarran nevada usa' },
  { code: 'MCO', city: 'Orlando', country: 'USA', name: 'Orlando International Airport', keywords: 'orlando mco florida disney usa' },
  { code: 'IAD', city: 'Washington D.C.', country: 'USA', name: 'Washington Dulles International Airport', keywords: 'washington dc iad dulles usa' },

  // --- UNITED KINGDOM & EUROPE ---
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport', keywords: 'london lhr heathrow uk england europe' },
  { code: 'LGW', city: 'London (Gatwick)', country: 'UK', name: 'Gatwick Airport', keywords: 'london lgw gatwick uk england' },
  { code: 'MAN', city: 'Manchester', country: 'UK', name: 'Manchester Airport', keywords: 'manchester man uk england' },
  { code: 'EDI', city: 'Edinburgh', country: 'UK', name: 'Edinburgh Airport', keywords: 'edinburgh edi scotland uk' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport', keywords: 'paris cdg france europe roissy' },
  { code: 'ORY', city: 'Paris (Orly)', country: 'France', name: 'Paris Orly Airport', keywords: 'paris ory orly france europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Airport Schiphol', keywords: 'amsterdam ams schiphol netherlands europe' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport', keywords: 'frankfurt fra germany europe' },
  { code: 'MUC', city: 'Munich', country: 'Germany', name: 'Munich Airport', keywords: 'munich muc germany europe bayern' },
  { code: 'BER', city: 'Berlin', country: 'Germany', name: 'Berlin Brandenburg Airport', keywords: 'berlin ber germany europe' },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Leonardo da Vinci–Fiumicino Airport', keywords: 'rome fco fiumicino italy europe' },
  { code: 'MXP', city: 'Milan', country: 'Italy', name: 'Milan Malpensa Airport', keywords: 'milan mxp malpensa italy europe' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', name: 'Adolfo Suárez Madrid–Barajas Airport', keywords: 'madrid mad spain europe' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Josep Tarradellas Barcelona-El Prat', keywords: 'barcelona bcn el prat spain europe catalonia' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Airport', keywords: 'zurich zrh switzerland europe' },
  { code: 'GVA', city: 'Geneva', country: 'Switzerland', name: 'Geneva Airport', keywords: 'geneva gva switzerland europe' },
  { code: 'VIE', city: 'Vienna', country: 'Austria', name: 'Vienna International Airport', keywords: 'vienna vie austria europe' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', name: 'Dublin Airport', keywords: 'dublin dub ireland europe' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', name: 'Humberto Delgado Airport', keywords: 'lisbon lis portugal europe' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport', keywords: 'istanbul ist turkey turkiye europe' },

  // --- MIDDLE EAST & ASIA PACIFIC ---
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport', keywords: 'dubai dxb uae emirates' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', name: 'Abu Dhabi International Airport', keywords: 'abu dhabi auh uae' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport', keywords: 'doha doh qatar hamad' },
  { code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', name: 'King Khalid International Airport', keywords: 'riyadh ruh saudi arabia' },
  { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International Airport', keywords: 'jeddah jed saudi arabia mecca' },
  { code: 'KWI', city: 'Kuwait City', country: 'Kuwait', name: 'Kuwait International Airport', keywords: 'kuwait kwi kuwait city' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport', keywords: 'singapore sin changi asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport', keywords: 'bangkok bkk suvarnabhumi thailand' },
  { code: 'HKT', city: 'Phuket', country: 'Thailand', name: 'Phuket International Airport', keywords: 'phuket hkt thailand' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport', keywords: 'kuala lumpur kul malaysia klia' },
  { code: 'DPS', city: 'Bali / Denpasar', country: 'Indonesia', name: 'Ngurah Rai International Airport', keywords: 'bali dps denpasar indonesia' },
  { code: 'CGK', city: 'Jakarta', country: 'Indonesia', name: 'Soekarno-Hatta International Airport', keywords: 'jakarta cgk indonesia' },
  { code: 'MNL', city: 'Manila', country: 'Philippines', name: 'Ninoy Aquino International Airport', keywords: 'manila mnl philippines' },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', name: 'Tan Son Nhat International Airport', keywords: 'ho chi minh sgn saigon vietnam' },
  { code: 'HAN', city: 'Hanoi', country: 'Vietnam', name: 'Noi Bai International Airport', keywords: 'hanoi han vietnam' },
  { code: 'HND', city: 'Tokyo (Haneda)', country: 'Japan', name: 'Tokyo Haneda Airport', keywords: 'tokyo hnd haneda japan' },
  { code: 'NRT', city: 'Tokyo (Narita)', country: 'Japan', name: 'Narita International Airport', keywords: 'tokyo nrt narita japan' },
  { code: 'KIX', city: 'Osaka', country: 'Japan', name: 'Kansai International Airport', keywords: 'osaka kix kansai japan' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', name: 'Hong Kong International Airport', keywords: 'hong kong hkg chek lap kok' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', name: 'Taiwan Taoyuan International Airport', keywords: 'taipei tpe taiwan' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', name: 'Incheon International Airport', keywords: 'seoul icn incheon korea' },
  { code: 'PEK', city: 'Beijing', country: 'China', name: 'Beijing Capital International Airport', keywords: 'beijing pek capital china' },
  { code: 'PVG', city: 'Shanghai', country: 'China', name: 'Shanghai Pudong International', keywords: 'shanghai pvg pudong china' },
  { code: 'CAN', city: 'Guangzhou', country: 'China', name: 'Guangzhou Baiyun International', keywords: 'guangzhou can china' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith Airport', keywords: 'sydney syd australia' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport', keywords: 'melbourne mel australia tullamarine' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport', keywords: 'brisbane bne australia' },
  { code: 'PER', city: 'Perth', country: 'Australia', name: 'Perth Airport', keywords: 'perth per australia' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', name: 'Auckland Airport', keywords: 'auckland akl new zealand nz' },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', name: 'Cairo International Airport', keywords: 'cairo cai egypt' },
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', name: 'O. R. Tambo International Airport', keywords: 'johannesburg jnb south africa' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', name: 'Jomo Kenyatta International Airport', keywords: 'nairobi nbo kenya' },

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
  { code: 'GOX', city: 'Goa (Mopa)', country: 'India', name: 'Manohar International Airport', keywords: 'goa mopa north goa' },
  { code: 'TRV', city: 'Thiruvananthapuram', country: 'India', name: 'Trivandrum International Airport', keywords: 'thiruvananthapuram trivandrum' },
  { code: 'PAT', city: 'Patna', country: 'India', name: 'Jay Prakash Narayan Airport', keywords: 'patna bihar' },
  { code: 'BBI', city: 'Bhubaneswar', country: 'India', name: 'Biju Patnaik International Airport', keywords: 'bhubaneswar odisha' },
  { code: 'GAU', city: 'Guwahati', country: 'India', name: 'Lokpriya Gopinath Bordoloi Intl', keywords: 'guwahati assam' },
  { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam International Airport', keywords: 'srinagar kashmir' },
  { code: 'VNS', city: 'Varanasi', country: 'India', name: 'Lal Bahadur Shastri Intl', keywords: 'varanasi banaras kashi' },
  { code: 'VTZ', city: 'Visakhapatnam', country: 'India', name: 'Visakhapatnam International Airport', keywords: 'visakhapatnam vizag' },
  { code: 'CJB', city: 'Coimbatore', country: 'India', name: 'Coimbatore International Airport', keywords: 'coimbatore tamil nadu' },
  { code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra Airport', keywords: 'bagdogra siliguri' },
  { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant Airport', keywords: 'dehradun rishikesh' },
  { code: 'AYJ', city: 'Ayodhya', country: 'India', name: 'Maharishi Valmiki International Airport', keywords: 'ayodhya ram mandir' },
];

// Helper: Resolve any free text or display label to 3-letter IA// Helper: Resolve any free text or display label to 3-letter IATA code
export function resolveIataCode(inputStr: string): string {
  if (!inputStr) return '';
  const trimmed = inputStr.trim();
  
  // 1. Check if string contains (CODE) format e.g. "Toronto (YYZ)" or "Kathmandu (KTM)"
  const codeMatch = trimmed.match(/\(([A-Za-z]{3})\)/);
  if (codeMatch) return codeMatch[1].toUpperCase();

  // 2. Direct exact 3-letter IATA code match (e.g. KTM, DEL, LHR, DXB)
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const lower = trimmed.toLowerCase();

  // 3. Exact 3-letter code match in dataset
  const exactByCode = AIRPORTS_DATA.find(a => a.code.toLowerCase() === lower);
  if (exactByCode) return exactByCode.code;

  // 4. Exact city match
  const exactByCity = AIRPORTS_DATA.find(a => 
    a.city.toLowerCase() === lower || 
    a.city.toLowerCase().split('/')[0].trim() === lower
  );
  if (exactByCity) return exactByCity.code;

  // 5. Match by prefix / search
  if (lower.length >= 2) {
    const startsWithCity = AIRPORTS_DATA.find(a => a.city.toLowerCase().startsWith(lower));
    if (startsWithCity) return startsWithCity.code;

    const matched = AIRPORTS_DATA.find(a => 
      a.city.toLowerCase().includes(lower) || 
      a.name.toLowerCase().includes(lower) ||
      (a.keywords && a.keywords.toLowerCase().includes(lower))
    );
    if (matched) return matched.code;
  }

  // 6. Look for standalone 3 uppercase letters
  const looseMatch = trimmed.match(/\b([A-Z]{3})\b/);
  if (looseMatch) return looseMatch[1];

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
  const [apiResults, setApiResults] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocusedRef = useRef<boolean>(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // Debounced API search whenever user types
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setApiResults([]);
      setIsLoading(false);
      return;
    }

    const trimmed = query.trim();
    // Skip remote search if it's already an exact confirmed display label like "Kathmandu (KTM)"
    if (/\([A-Za-z]{3}\)$/.test(trimmed)) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await flightService.searchAirports(trimmed, 20);
        if (Array.isArray(results) && results.length > 0) {
          setApiResults(results);
        }
      } catch {
        // Keep existing results
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Current matched airport display
  const currentAirport = useMemo(() => {
    const codeToSearch = selectedCode || resolveIataCode(query);
    if (codeToSearch) {
      const foundInApi = apiResults.find(a => a.code.toLowerCase() === codeToSearch.toLowerCase());
      if (foundInApi) return foundInApi;
      const foundInLocal = AIRPORTS_DATA.find(a => a.code.toLowerCase() === codeToSearch.toLowerCase());
      if (foundInLocal) return foundInLocal;
      return { code: codeToSearch, city: query.split('(')[0].trim() || codeToSearch, country: '', name: `${codeToSearch} Airport` };
    }
    return null;
  }, [selectedCode, query, apiResults]);

  // Filter airports based on query search term with smart relevance sorting
  const filteredAirports = useMemo(() => {
    if (!query || query.trim().length < 1) {
      // Prioritize top Canadian and international hubs on empty query
      return AIRPORTS_DATA.slice(0, 12);
    }

    const q = query.toLowerCase().trim();
    
    // Combine API results with local AIRPORTS_DATA without duplicates
    const combinedData: Airport[] = [...apiResults];
    AIRPORTS_DATA.forEach(localAirport => {
      if (!combinedData.some(a => a.code.toLowerCase() === localAirport.code.toLowerCase())) {
        combinedData.push(localAirport);
      }
    });

    // 1. Exact 3-letter IATA code match
    const exactCode = combinedData.filter(a => a.code.toLowerCase() === q);
    // 2. Code starts with query
    const startsWithCode = combinedData.filter(a => a.code.toLowerCase().startsWith(q) && a.code.toLowerCase() !== q);
    // 3. City starts with query
    const startsWithCity = combinedData.filter(a => 
      a.city.toLowerCase().startsWith(q) && 
      !startsWithCode.includes(a) && 
      !exactCode.includes(a)
    );
    // 4. Other matches (city contains, airport name contains, keywords contain)
    const others = combinedData.filter(a =>
      !exactCode.includes(a) &&
      !startsWithCode.includes(a) &&
      !startsWithCity.includes(a) &&
      (a.city.toLowerCase().includes(q) ||
       a.name.toLowerCase().includes(q) ||
       a.country.toLowerCase().includes(q) ||
       (a.keywords && a.keywords.toLowerCase().includes(q)))
    );

    const merged = [...exactCode, ...startsWithCode, ...startsWithCity, ...others];

    // If query is an exact 3-letter code and not in list, add as quick-select top option
    if (q.length === 3 && /^[a-z]{3}$/i.test(q) && !merged.some(a => a.code.toLowerCase() === q)) {
      merged.unshift({
        code: q.toUpperCase(),
        city: q.toUpperCase(),
        country: 'Airport Code',
        name: `${q.toUpperCase()} International Airport`,
      });
    }

    return merged.slice(0, 15);
  }, [query, apiResults]);

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

    if (onChange) {
      const resolved = resolveIataCode(val);
      const matched = resolved 
        ? (apiResults.find(a => a.code.toLowerCase() === resolved.toLowerCase()) || AIRPORTS_DATA.find(a => a.code.toLowerCase() === resolved.toLowerCase()))
        : undefined;
      onChange(val, matched);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    setIsOpen(true);
    e.target.select();
  };

  const handleBlur = () => {
    // Delay to allow clicking on dropdown options
    setTimeout(() => {
      isFocusedRef.current = false;
      setIsOpen(false);

      // If user typed something and blurred without clicking, resolve to best match
      if (query.trim() && !selectedCode) {
        const resolved = resolveIataCode(query);
        const matched = resolved 
          ? (apiResults.find(a => a.code.toLowerCase() === resolved.toLowerCase()) || AIRPORTS_DATA.find(a => a.code.toLowerCase() === resolved.toLowerCase()))
          : null;
        if (matched) {
          handleSelect(matched);
        } else if (query.trim().length === 3 && /^[A-Za-z]{3}$/.test(query.trim())) {
          setSelectedCode(query.trim().toUpperCase());
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

          {isLoading && (
            <div className="h-0.5 w-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse w-full"></div>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`${airport.code}_${idx}`}
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
