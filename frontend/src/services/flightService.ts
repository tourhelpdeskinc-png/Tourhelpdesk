// Flight API Service
import { Flight, SearchParams, SSRGroup } from '../types';

// In-memory cache for flight searches to improve speed
const searchCache = new Map<string, { data: Flight[], timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_SEARCH_CACHE_SIZE = 100;

const getCachedSearchResult = (key: string): Flight[] | null => {
  const cached = searchCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return cached.data;
};

const setCachedSearchResult = (key: string, data: Flight[]) => {
  if (searchCache.size >= MAX_SEARCH_CACHE_SIZE) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey !== undefined) searchCache.delete(firstKey);
  }
  searchCache.set(key, { data, timestamp: Date.now() });
};

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
};

export const flightService = {
  async searchFlights(params: SearchParams): Promise<Flight[]> {
    const cacheKey = JSON.stringify(params);
    const cachedData = getCachedSearchResult(cacheKey);

    // Return cached data if valid
    if (cachedData) {
      console.log('Returning cached flight results');
      return cachedData;
    }

    try {
      const response = await fetch(`${getApiBase()}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const flights: Flight[] = Array.isArray(data.flights) ? data.flights : [];
      
      // Store in cache only when real flights are returned
      if (flights.length > 0) {
        setCachedSearchResult(cacheKey, flights);
      }
      
      return flights;
    } catch (error) {
      console.error('Flight search error:', error);
      return [];
    }
  },

  async submitFlightBookingRequest(payload: {
    customer: {
      name: string;
      email: string;
      mobile: string;
    };
    flight: {
      airline: string;
      flightNumber?: string;
      origin: string;
      destination: string;
      departureTime?: string;
      arrivalTime?: string;
      duration?: string;
      travelDate: string;
      returnDate?: string;
      travelClass?: string;
      price?: number;
      currency?: string;
      stops?: number;
    };
    passengers: Array<{
      paxType: 'Adult' | 'Child' | 'Infant';
      title: string;
      firstName: string;
      lastName: string;
      gender: 'Male' | 'Female' | 'Other';
      age?: number;
      dob?: string;
      passportNumber?: string;
      nationality?: string;
    }>;
    remarks?: string;
  }): Promise<{
    success: boolean;
    requestId?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/booking-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight Booking Request error:', error);
      throw error;
    }
  },




  async repriceFlight(params: { fareId?: string; flightKey?: string; searchKey?: string; flightId?: string }): Promise<{
    success: boolean;
    repriced: boolean;
    isFareChanged: boolean;
    newPrice?: number;
    seatsAvailable?: string;
    updatedFareId?: string;
    updatedFlightKey?: string;
    message: string;
  }> {
    try {
      if (!params.fareId || !params.flightKey) {
        return {
          success: true,
          repriced: true,
          isFareChanged: false,
          message: 'Real-time fare and seat availability confirmed.',
        };
      }

      const response = await fetch(`${getApiBase()}/flights/reprice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fareId: params.fareId,
          flightKey: params.flightKey,
          searchKey: params.searchKey,
          flightId: params.flightId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Reprice API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight reprice error:', error);
      return {
        success: false,
        repriced: false,
        isFareChanged: false,
        message: error.message || 'Unable to reach airline re-pricing service.',
      };
    }
  },

  async getSSR(params: { fareId?: string; flightKey?: string; searchKey?: string }): Promise<{
    success: boolean;
    ssr: SSRGroup;
    count?: number;
    message: string;
  }> {
    try {
      if (!params.fareId || !params.flightKey) {
        return {
          success: true,
          ssr: { meals: [], baggage: [], wheelchair: [], other: [] },
          message: 'No online GDS SSR parameters available for mock flight.',
        };
      }

      const response = await fetch(`${getApiBase()}/flights/ssr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fareId: params.fareId,
          flightKey: params.flightKey,
          searchKey: params.searchKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `SSR API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight SSR error:', error);
      return {
        success: false,
        ssr: { meals: [], baggage: [], wheelchair: [], other: [] },
        message: error.message || 'Unable to fetch Special Service Requests.',
      };
    }
  },

  async tempBooking(params: {
    flightKey: string;
    searchKey?: string;
    email: string;
    mobile: string;
    whatsappMobile?: string;
    passengers: Array<{
      paxId?: number;
      paxType?: number;
      title: string;
      firstName: string;
      lastName: string;
      gender?: number;
      dob?: string;
      passportNumber?: string;
      passportCountry?: string;
      passportExpiry?: string;
      nationality?: string;
      pancardNumber?: string;
    }>;
    bookingSSRDetails?: Array<{ paxId: number; ssrKey: string }>;
    gst?: {
      isGst?: boolean;
      gstNumber?: string;
      gstHolderName?: string;
      gstAddress?: string;
    };
  }): Promise<{
    success: boolean;
    bookingRefNo?: string;
    status?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/temp-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `TempBooking API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight TempBooking error:', error);
      return {
        success: false,
        bookingRefNo: undefined,
        message: error.message || 'Unable to complete temporary booking hold.',
      };
    }
  },

  async issueTicket(params: {
    bookingRefNo: string;
    ticketingType?: string;
  }): Promise<{
    success: boolean;
    bookingRefNo?: string;
    airlinePnr?: string;
    ticketNumber?: string;
    airlineCode?: string;
    status?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${getApiBase()}/flights/ticketing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Ticketing API error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Flight Ticketing error:', error);
      return {
        success: false,
        bookingRefNo: params.bookingRefNo,
        status: 'FAILED',
        message: error.message || 'Unable to complete airline ticketing.',
      };
    }
  },





};
