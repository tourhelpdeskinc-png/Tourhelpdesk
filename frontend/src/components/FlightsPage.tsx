"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { resolveIataCode } from './AirportAutocomplete';
import { FlightSearchFormState } from './forms/FlightSearchForm';
import FlightHeroSection from './flights/FlightHeroSection';
import ExclusiveFlightOffers from './flights/ExclusiveFlightOffers';
import FlightTopDestinations from './flights/FlightTopDestinations';
import FlightSeoFaq from './flights/FlightSeoFaq';
import PromotionalPopup from './PromotionalPopup';
import ExploreFlightsByAirline from './ExploreFlightsByAirline';
import SkeletonLoader from './SkeletonLoader';
import OfflineHotlineBanner from './common/OfflineHotlineBanner';
import { SearchParams, Flight, FlightFilterState, SSRGroup } from '../types';
import { flightService } from '../services/flightService';
import { parseTimeToHour, getTimeSlot } from './flights/FlightFilterSidebar';

const FlightResults = dynamic(() => import('./FlightResults'));
const FlightFilterSidebar = dynamic(() => import('./flights/FlightFilterSidebar'));
const FlightBookingModal = dynamic(() => import('./FlightBookingModal'), { ssr: false });
const FlightDetails = React.lazy(() => import('./FlightDetails'));

interface FlightsPageProps {
  isCheapFlights?: boolean;
}

export default function FlightsPage({ isCheapFlights = false }: FlightsPageProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  const [showPromo, setShowPromo] = useState(false);

  // Search & Result states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [view, setView] = useState<'results' | 'details'>('results');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedBookingFlight, setSelectedBookingFlight] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'fastest' | 'nonstop'>('price');

  // Dynamic Filter State
  const [filters, setFilters] = useState<FlightFilterState>({
    selectedAirlines: [],
    selectedStops: [],
    departureTimeSlots: [],
    arrivalTimeSlots: [],
    maxPrice: Infinity,
    maxDurationMinutes: Infinity,
    selectedLayovers: [],
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // On-Select Reprice & SSR State
  const [verifyingFlightId, setVerifyingFlightId] = useState<string | null>(null);
  const [ssrData, setSsrData] = useState<SSRGroup | null>(null);
  const [isFareChanged, setIsFareChanged] = useState<boolean>(false);
  const [originalFarePrice, setOriginalFarePrice] = useState<number | undefined>(undefined);

  // Search Form State
  const [searchForm, setSearchForm] = useState<FlightSearchFormState>({
    from: "",
    to: "",
    departDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    tripType: "round-trip",
    travelClass: "Economy",
    adults: 1,
    children: 0,
    infants: 0,
  });

  // Lowest price from flight results
  const lowestPrice = useMemo(() => {
    if (searchResults.length === 0) return 499;
    return Math.min(...searchResults.map((f) => f.price));
  }, [searchResults]);

  // Promotional popup for cheap flights: Show ONLY AFTER flights are displayed
  useEffect(() => {
    if (isCheapFlights && searchResults.length > 0 && !isSearching) {
      const timer = window.setTimeout(() => {
        setShowPromo(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCheapFlights, searchResults.length, isSearching]);

  const handleSwap = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  // Perform search in-page
  const handleSearch = useCallback(async (params: SearchParams) => {
    setShowPromo(false);
    setIsSearching(true);
    setSearchResults([]);
    setSearchParams(params);
    setView('results');

    try {
      const flights = await flightService.searchFlights(params);
      setSearchResults(flights);

      // Initialize dynamic filter boundaries
      if (flights.length > 0) {
        const prices = flights.map((f) => f.price);
        const durations = flights.map((f) => f.durationMinutes || 120);
        const matchingAirline = (params.airline || params.airlineCode)
          ? flights.find(f => 
              (params.airline && f.airline.toLowerCase().includes(params.airline.toLowerCase())) ||
              (params.airlineCode && f.airlineCode?.toUpperCase() === params.airlineCode.toUpperCase())
            )?.airline
          : null;

        setFilters({
          selectedAirlines: matchingAirline ? [matchingAirline] : [],
          selectedStops: [],
          departureTimeSlots: [],
          arrivalTimeSlots: [],
          maxPrice: Math.max(...prices),
          maxDurationMinutes: Math.max(...durations),
          selectedLayovers: [],
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Sync with URL query parameters on initial page load or parameter changes
  useEffect(() => {
    const fromParam = searchParamsHook.get('from');
    const toParam = searchParamsHook.get('to');
    const dateParam = searchParamsHook.get('date');
    const returnDateParam = searchParamsHook.get('returnDate');
    const classParam = searchParamsHook.get('class') || 'Economy';
    const tripParam = searchParamsHook.get('trip') || (returnDateParam ? 'round-trip' : 'one-way');
    const airlineParam = searchParamsHook.get('airline');
    const airlineNameParam = searchParamsHook.get('airlineName');

    if (fromParam && toParam && dateParam) {
      const resolvedFrom = resolveIataCode(fromParam) || (fromParam.length === 3 ? fromParam.toUpperCase() : fromParam);
      const resolvedTo = resolveIataCode(toParam) || (toParam.length === 3 ? toParam.toUpperCase() : toParam);

      setSearchForm(prev => ({
        ...prev,
        from: resolvedFrom,
        to: resolvedTo,
        departDate: dateParam,
        returnDate: returnDateParam || prev.returnDate,
        travelClass: (classParam as any) || 'Economy',
        tripType: (tripParam as any) || 'round-trip',
      }));

      handleSearch({
        from: resolvedFrom,
        to: resolvedTo,
        date: dateParam,
        returnDate: returnDateParam || undefined,
        passengers: 1,
        travelClass: classParam,
        airline: airlineNameParam || airlineParam || undefined,
        airlineCode: airlineParam || undefined,
      });
    }
  }, [searchParamsHook, handleSearch]);

  // Form submit handler - stays on the current page and updates URL
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = resolveIataCode(searchForm.from) || (searchForm.from.length === 3 ? searchForm.from.toUpperCase() : searchForm.from);
    const toCode = resolveIataCode(searchForm.to) || (searchForm.to.length === 3 ? searchForm.to.toUpperCase() : searchForm.to);
    
    if (!fromCode || !toCode) {
      alert("Please select both Departure and Arrival cities");
      return;
    }

    const queryParams: Record<string, string> = {
      from: fromCode,
      to: toCode,
      date: searchForm.departDate,
      class: searchForm.travelClass,
      trip: searchForm.tripType,
    };

    if (searchForm.tripType === 'round-trip' && searchForm.returnDate) {
      queryParams.returnDate = searchForm.returnDate;
    }

    const query = new URLSearchParams(queryParams).toString();
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `${pathname}?${query}`);
    }

    handleSearch({
      from: fromCode,
      to: toCode,
      date: searchForm.departDate,
      returnDate: searchForm.tripType === 'round-trip' ? searchForm.returnDate : undefined,
      passengers: (searchForm.adults || 1) + (searchForm.children || 0) + (searchForm.infants || 0),
      travelClass: searchForm.travelClass,
    });
  };

  const handleResetFilters = () => {
    if (searchResults.length > 0) {
      const prices = searchResults.map((f) => f.price);
      const durations = searchResults.map((f) => f.durationMinutes || 120);
      setFilters({
        selectedAirlines: [],
        selectedStops: [],
        departureTimeSlots: [],
        arrivalTimeSlots: [],
        maxPrice: Math.max(...prices),
        maxDurationMinutes: Math.max(...durations),
        selectedLayovers: [],
      });
    }
  };

  // Auto-scroll to results / loader
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        document.getElementById('flights-search-loading')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isSearching]);

  useEffect(() => {
    if (searchParams && !isSearching) {
      setTimeout(() => {
        if (searchResults.length === 0) {
          document.getElementById('flights-no-results')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          document.getElementById('flights-results-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams, searchResults, isSearching]);

  // ON-SELECT: Air_Reprice -> Air_GetSSR -> Open Flight Details
  const handleBookClick = async (flight: Flight) => {
    setVerifyingFlightId(flight.id);
    const originalPrice = flight.price;
    let currentFlight = { ...flight };

    try {
      // 1. Trigger Air_Reprice to verify real-time fare & seat availability
      const repriceResult = await flightService.repriceFlight({
        fareId: flight.fareId,
        flightKey: flight.flightKey,
        searchKey: flight.searchKey,
        flightId: flight.id,
      });

      if (repriceResult.isFareChanged && repriceResult.newPrice) {
        setIsFareChanged(true);
        setOriginalFarePrice(originalPrice);
        currentFlight = {
          ...currentFlight,
          price: repriceResult.newPrice,
          fareId: repriceResult.updatedFareId || currentFlight.fareId,
          flightKey: repriceResult.updatedFlightKey || currentFlight.flightKey,
          seatsAvailable: repriceResult.seatsAvailable || currentFlight.seatsAvailable,
          repriced: true,
        };
      } else {
        setIsFareChanged(false);
        setOriginalFarePrice(undefined);
      }

      // 2. Trigger Air_GetSSR for Baggage, Meals, Seats, and other SSR
      const ssrResult = await flightService.getSSR({
        fareId: currentFlight.fareId,
        flightKey: currentFlight.flightKey,
        searchKey: currentFlight.searchKey,
      });

      if (ssrResult.success && ssrResult.ssr) {
        setSsrData(ssrResult.ssr);
      } else {
        setSsrData(null);
      }
    } catch (e) {
      console.warn('Reprice/SSR warning:', e);
      setIsFareChanged(false);
      setSsrData(null);
    } finally {
      setVerifyingFlightId(null);
      setSelectedFlight(currentFlight);
      setView('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Filtering
  const filteredFlights = useMemo(() => {
    return searchResults.filter((f) => {
      if (filters.selectedAirlines.length > 0 && !filters.selectedAirlines.includes(f.airline)) {
        return false;
      }
      if (filters.selectedStops.length > 0) {
        const normalizedStop = (f.stops ?? 0) >= 2 ? 2 : (f.stops ?? 0);
        if (!filters.selectedStops.includes(normalizedStop)) return false;
      }
      if (filters.departureTimeSlots.length > 0) {
        const hour = parseTimeToHour(f.departureTime);
        const slot = getTimeSlot(hour);
        if (!filters.departureTimeSlots.includes(slot)) return false;
      }
      if (filters.arrivalTimeSlots.length > 0) {
        const hour = parseTimeToHour(f.arrivalTime);
        const slot = getTimeSlot(hour);
        if (!filters.arrivalTimeSlots.includes(slot)) return false;
      }
      if (f.price > filters.maxPrice) {
        return false;
      }
      if ((f.durationMinutes || 120) > filters.maxDurationMinutes) {
        return false;
      }
      if (filters.selectedLayovers.length > 0) {
        const flightLayovers = f.layovers || [];
        const hasMatchingLayover = filters.selectedLayovers.some((layover) => flightLayovers.includes(layover));
        if (!hasMatchingLayover) return false;
      }
      return true;
    });
  }, [searchResults, filters]);

  // Sorting
  const sortedFlights = useMemo(() => {
    const flights = [...filteredFlights];
    if (sortBy === 'price') {
      return flights.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      return flights.sort((a, b) => (a.durationMinutes || 120) - (b.durationMinutes || 120));
    } else if (sortBy === 'nonstop') {
      return flights.sort((a, b) => a.stops - b.stops);
    }
    return flights;
  }, [filteredFlights, sortBy]);

  const handleSelectDestination = (destinationName: string) => {
    setSearchForm(prev => ({
      ...prev,
      to: destinationName,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If details view is active, render FlightDetails component
  if (view === 'details' && selectedFlight) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <React.Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading details...</div>}>
          <FlightDetails
            flight={selectedFlight}
            searchParams={searchParams}
            ssrData={ssrData}
            isFareChanged={isFareChanged}
            originalPrice={originalFarePrice}
            onBack={() => {
              setView('results');
              setSelectedFlight(null);
              setSsrData(null);
              setIsFareChanged(false);
            }}
          />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Hero Banner & Flight Search Engine */}
      <FlightHeroSection
        isCheapFlights={isCheapFlights}
        searchForm={searchForm}
        onSearchFormChange={setSearchForm}
        onSearchSubmit={handleSearchSubmit}
        onSwap={handleSwap}
      />

      {/* 2. Searching Loader */}
      {isSearching && (
        <div id="flights-search-loading" className="py-8">
          <SkeletonLoader
            from={searchParams?.from}
            to={searchParams?.to}
            searchParams={searchParams}
            onClose={() => setIsSearching(false)}
          />
        </div>
      )}

      {/* 3. In-Page Flight Search Results */}
      {searchParams && searchResults.length > 0 && !isSearching && (
        <div id="flights-results-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Route & Summary Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="max-w-full md:max-w-2xl">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-1">
                <span className="text-blue-600 dark:text-blue-400">{searchParams?.from}</span>
                <span className="text-slate-300 dark:text-slate-600 mx-2">→</span>
                <span className="text-blue-600 dark:text-blue-400">{searchParams?.to}</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold">
                {filteredFlights.length} of {searchResults.length} flights available • <span className="text-slate-700 dark:text-slate-300 font-bold">{searchParams?.date}</span>
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSortBy('price')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sortBy === 'price'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                Cheapest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('fastest')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sortBy === 'fastest'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                Fastest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('nonstop')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sortBy === 'nonstop'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                Non-stop
              </button>
            </div>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between font-bold text-xs text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>⚙️</span> Filter Flights
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                Tap to adjust filters →
              </span>
            </button>
          </div>

          {/* 2-Column Layout: Left Filter Sidebar + Right Flight Results */}
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            <FlightFilterSidebar
              flights={searchResults}
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />

            {/* Right Content Area: Results List */}
            <div className="flex-1 min-w-0 w-full">
              {sortedFlights.length > 0 ? (
                <FlightResults 
                  flights={sortedFlights} 
                  onBook={handleBookClick} 
                  initialLimit={20}
                  searchParams={searchParams}
                  verifyingFlightId={verifyingFlightId}
                />
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-xl text-slate-400">
                    🔍
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    No flights match your filter selection
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try adjusting your price range, flight duration, stops, or airline selections.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Empty Results Card */}
      {searchParams && searchResults.length === 0 && !isSearching && (
        <div id="flights-no-results" className="max-w-[90%] md:max-w-2xl mx-auto px-2 sm:px-6 py-10 md:py-16">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 md:mb-5 relative z-10">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-5 relative z-10">
              <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-white text-center">{searchParams.from?.split(',')[0]}</span>
              <div className="hidden md:block w-8 md:w-12 h-[2px] bg-slate-200 dark:bg-slate-700 relative rounded-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-1">
                  <svg className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </div>
              </div>
              <div className="md:hidden">
                <svg className="w-4 h-4 text-slate-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-white text-center">{searchParams.to?.split(',')[0]}</span>
            </div>

            <OfflineHotlineBanner />
          </div>
        </div>
      )}

      {/* 5. Exclusive Flight Offers & Coupon Codes Slider */}
      <ExclusiveFlightOffers />

      {/* 6. Explore Flights by Airline */}
      <ExploreFlightsByAirline />

      {/* 7. Top Destinations Grid */}
      <FlightTopDestinations onSelectDestination={handleSelectDestination} />

      {/* 8. SEO Content & FAQ Section */}
      <FlightSeoFaq isCheapFlights={isCheapFlights} />

      {/* 9. Promotional Lowest Flight Popup - Exclusively displayed on Cheap Flights page AFTER flights show */}
      {isCheapFlights && showPromo && searchResults.length > 0 && !isSearching && (
        <PromotionalPopup
          route={searchParams ? `${searchParams.from} to ${searchParams.to}` : "Exclusive Flight Deal"}
          minPrice={lowestPrice}
          onClose={() => setShowPromo(false)}
        />
      )}

      {/* 10. Booking Modal Overlay */}
      {selectedBookingFlight && (
        <FlightBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedBookingFlight(null);
          }}
          flight={selectedBookingFlight}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
