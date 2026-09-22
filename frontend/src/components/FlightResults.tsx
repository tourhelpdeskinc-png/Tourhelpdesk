import React, { useState, useEffect } from 'react';
import { Flight } from '../types';
import { useRouter } from 'next/navigation';
import { convertINR, getSavedCurrency, CURRENCIES, CurrencyOption } from '../lib/currency';

interface FlightResultsProps {
  flights: Flight[];
  onBook: (flight: Flight) => void;
  initialLimit?: number;
  searchParams?: any;
  verifyingFlightId?: string | null;
}

const FlightResults: React.FC<FlightResultsProps> = ({ 
  flights, 
  onBook, 
  initialLimit = 20,
  searchParams,
  verifyingFlightId = null,
}) => {
  const router = useRouter();
  const [displayCount, setDisplayCount] = useState<number>(initialLimit);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  useEffect(() => {
    const updateCurrency = () => {
      setCurrency(getSavedCurrency());
    };
    updateCurrency();
    window.addEventListener('currency_change', updateCurrency);
    return () => window.removeEventListener('currency_change', updateCurrency);
  }, []);

  if (!flights || flights.length === 0) return null;

  const minPrice = Math.min(...flights.map(f => f.price));
  const visibleFlights = flights.slice(0, displayCount);
  const hasMore = displayCount < flights.length;

  const handleViewMore = () => {
    setDisplayCount((prev: number) => Math.min(prev + 20, flights.length));
  };

  const handleNavigateToFlightsPage = () => {
    if (searchParams) {
      const query = new URLSearchParams({
        from: searchParams.from || '',
        to: searchParams.to || '',
        date: searchParams.date || '',
        class: searchParams.travelClass || 'Economy',
      }).toString();
      router.push(`/flights?${query}`);
    } else {
      router.push('/flights');
    }
  };

  const toggleExpand = (flightId: string) => {
    setExpandedFlightId((prev) => (prev === flightId ? null : flightId));
  };

  return (
    <div className="space-y-4">
      {/* Header Result Count Summary */}
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="text-blue-600 dark:text-blue-400 font-extrabold">{visibleFlights.length}</span> of <span className="text-slate-900 dark:text-white font-extrabold">{flights.length}</span> flights
        </p>
      </div>

      {/* Flight Cards List */}
      {visibleFlights.map((flight) => {
        const isLowestPrice = flight.price === minPrice;
        const isVerifying = verifyingFlightId === flight.id;
        const isExpanded = expandedFlightId === flight.id;
        const airlineCode = (flight.airlineCode || flight.flightNumber?.split('-')?.[0] || '6E').toUpperCase();
        const seatsLeftText = flight.seatsAvailable || '3 seats left';
        const checkInBaggage = flight.baggage ? (flight.baggage.toLowerCase().includes('check') ? flight.baggage : `${flight.baggage} check-in`) : '15kg check-in';

        return (
          <div
            key={flight.id}
            className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
              isLowestPrice
                ? 'border-blue-400 shadow-sm ring-1 ring-blue-400/20'
                : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            {isLowestPrice && (
              <div className="absolute top-0 left-6 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-0.5 rounded-b-md shadow-xs z-20">
                Cheapest Deal
              </div>
            )}

            <div className="p-4 sm:p-5">
              {/* Main Ticket Layout: Left Content & Right Pricing/CTA */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                
                {/* === LEFT COLUMN: Flight Information === */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Top Row: Airline Logo Badge & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#001b69] text-white flex items-center justify-center font-black text-xs sm:text-sm tracking-wider shrink-0 overflow-hidden shadow-xs relative">
                      <img
                        src={`https://images.kiwi.com/airlines/64x64/${airlineCode}.png`}
                        alt={flight.airline}
                        className="w-full h-full object-contain p-1 relative z-10"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute font-black text-xs uppercase tracking-wider select-none text-white">
                        {airlineCode.slice(0, 2)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-slate-900 tracking-tight truncate leading-tight">
                        {flight.airline}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono leading-tight mt-0.5">
                        {flight.flightNumber || `${airlineCode}-6789`}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Flight Schedule & Route Timeline */}
                  <div className="flex items-center justify-between gap-2 sm:gap-6 pt-1">
                    {/* Departure Info */}
                    <div className="text-left min-w-[85px] sm:min-w-[100px]">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none block">
                        {flight.departureTime}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider block mt-1">
                        {flight.origin}
                      </span>
                    </div>

                    {/* Flight Path / Duration & Airplane Line */}
                    <div className="flex flex-col items-center flex-1 max-w-[200px] sm:max-w-[260px] px-2">
                      <span className="text-xs font-semibold text-slate-500 leading-none">
                        {flight.duration}
                      </span>

                      {/* Route Line with Plane Icon */}
                      <div className="w-full flex items-center justify-center relative my-2">
                        <div className="w-full h-px bg-slate-300 absolute top-1/2 -translate-y-1/2" />
                        <div className="relative bg-white px-2.5 z-10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-slate-400 transform rotate-90"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                          </svg>
                        </div>
                      </div>

                      {/* Non-stop or Stops info */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold leading-none ${
                            flight.stops === 0 ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                        </span>
                        {flight.layovers && flight.layovers.length > 0 && (
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[90px] sm:max-w-[130px]">
                            via {flight.layovers.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrival Info */}
                    <div className="text-right min-w-[85px] sm:min-w-[100px]">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none block">
                        {flight.arrivalTime}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider block mt-1">
                        {flight.destination}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Meta Row: Seats Left, Baggage & Flight Details Toggle */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-slate-600">
                      {/* Urgency / Seats left */}
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                        </svg>
                        <span>{seatsLeftText}</span>
                      </div>

                      {/* Check-in baggage */}
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4V8h16v11z" />
                        </svg>
                        <span>{checkInBaggage}</span>
                      </div>

                      {/* Cabin baggage */}
                      <div className="hidden sm:flex items-center gap-1 text-slate-500 font-medium">
                        <span>7kg cabin</span>
                      </div>

                      {flight.refundable && (
                        <div className="hidden md:flex items-center gap-1 text-emerald-600 font-medium">
                          <span>✓ Refundable</span>
                        </div>
                      )}
                    </div>

                    {/* Flight Details Expand Toggle */}
                    <button
                      onClick={() => toggleExpand(flight.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'Flight Details'}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* === TICKET CUTOUT & VERTICAL DIVIDER (Desktop) === */}
                <div className="hidden lg:flex flex-col items-center justify-between relative self-stretch py-0">
                  {/* Top Ticket Inward Notch */}
                  <div className="w-5 h-5 -mt-5 rounded-full bg-slate-50 border-b border-slate-200 z-10" />
                  {/* Dashed Vertical Divider */}
                  <div className="w-px flex-1 border-r border-dashed border-slate-200 my-1" />
                  {/* Bottom Ticket Inward Notch */}
                  <div className="w-5 h-5 -mb-5 rounded-full bg-slate-50 border-t border-slate-200 z-10" />
                </div>

                {/* Mobile Horizontal Divider */}
                <div className="block lg:hidden border-t border-dashed border-slate-200 my-1" />

                {/* === RIGHT COLUMN: Pricing & Select CTA === */}
                <div className="w-full lg:w-44 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-between gap-3 pt-2 lg:pt-0">
                  {/* Cabin Class Pill Badge */}
                  <div className="order-1 lg:order-1">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                      {flight.class || 'Economy'}
                    </span>
                  </div>

                  {/* Currency & Price */}
                  <div className="order-2 lg:order-2 text-left lg:text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {currency.code}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none block mt-0.5">
                      {currency.symbol}{convertINR(flight.price, currency.code).toLocaleString()}
                    </span>
                  </div>

                  {/* Select CTA Button */}
                  <div className="order-3 lg:order-3 w-auto lg:w-full">
                    <button
                      disabled={isVerifying}
                      onClick={() => onBook(flight)}
                      className="bg-[#001b69] hover:bg-[#00144f] disabled:bg-slate-400 text-white font-bold px-6 py-2.5 text-sm rounded-xl transition-all shadow-md shadow-[#001b69]/20 hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-w-[110px] w-full"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Flight Segments & Details Accordion */}
              {isExpanded && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 bg-slate-50/90 rounded-xl p-3.5 sm:p-4 text-xs">
                  <h5 className="font-bold text-slate-900 mb-2.5">
                    Itinerary Segments & Layover Details
                  </h5>

                  {flight.segments && flight.segments.length > 0 ? (
                    <div className="space-y-2.5">
                      {flight.segments.map((seg, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600 font-mono">Segment {idx + 1}:</span>
                            <span className="font-bold text-slate-900">{seg.origin} → {seg.destination}</span>
                            <span className="text-slate-400">({seg.airline} {seg.flightNumber})</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
                            <span>Dep: <strong>{seg.departureTime}</strong></span>
                            <span>Arr: <strong>{seg.arrivalTime}</strong></span>
                            {seg.duration && <span className="text-slate-400 font-mono">({seg.duration})</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between shadow-xs">
                      <span>Direct flight from <strong>{flight.origin}</strong> to <strong>{flight.destination}</strong></span>
                      <span className="text-slate-500 font-mono">{flight.duration}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <div><strong>Baggage:</strong> {flight.baggage || '15 KG check-in included'}</div>
                    <div><strong>Refundable:</strong> {flight.refundable ? 'Yes (charges apply)' : 'No'}</div>
                    <div><strong>Travel Class:</strong> {flight.class}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* View More Flights */}
      {hasMore && (
        <div className="pt-4 pb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleViewMore}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <span>View More Flights ({flights.length - displayCount} Remaining)</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;

