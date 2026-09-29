import { GLOBAL_AIRPORTS, AirportRecord } from '../constants/airports.data.js';

// Pre-indexed lookup maps for instant O(1) resolution
const codeMap = new Map<string, AirportRecord>();
const cityMap = new Map<string, AirportRecord>();

GLOBAL_AIRPORTS.forEach((airport) => {
  const codeLower = airport.code.toLowerCase();
  codeMap.set(codeLower, airport);

  // Index clean primary city name
  const primaryCity = airport.city.split('/')[0].split('(')[0].trim().toLowerCase();
  if (!cityMap.has(primaryCity)) {
    cityMap.set(primaryCity, airport);
  }

  // Also index full city string
  const fullCity = airport.city.toLowerCase().trim();
  if (!cityMap.has(fullCity)) {
    cityMap.set(fullCity, airport);
  }
});

/**
 * Searches the global airport database using multi-tier relevance ranking.
 * Supports:
 * - 3-letter IATA code (exact and prefix)
 * - City name (exact, prefix, and substring)
 * - Airport name (prefix and substring)
 * - Country & keywords
 */
export const searchAirportsService = (rawQuery: string, limit: number = 15): AirportRecord[] => {
  if (!rawQuery || typeof rawQuery !== 'string') {
    // Return top popular hubs if query is empty
    return GLOBAL_AIRPORTS.slice(0, limit);
  }

  const q = rawQuery.trim().toLowerCase();
  if (q.length === 0) {
    return GLOBAL_AIRPORTS.slice(0, limit);
  }

  // Tier 1: Exact 3-letter code match
  const exactCode = GLOBAL_AIRPORTS.filter((a) => a.code.toLowerCase() === q);

  // Tier 2: Code starts with query (and not exact)
  const startsWithCode = GLOBAL_AIRPORTS.filter(
    (a) => a.code.toLowerCase().startsWith(q) && a.code.toLowerCase() !== q
  );

  // Tier 3: City starts with query
  const startsWithCity = GLOBAL_AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().startsWith(q) &&
      !exactCode.includes(a) &&
      !startsWithCode.includes(a)
  );

  // Tier 4: City or name contains query
  const substringCityOrName = GLOBAL_AIRPORTS.filter(
    (a) =>
      !exactCode.includes(a) &&
      !startsWithCode.includes(a) &&
      !startsWithCity.includes(a) &&
      (a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
  );

  // Tier 5: Country or keywords match
  const countryOrKeywords = GLOBAL_AIRPORTS.filter(
    (a) =>
      !exactCode.includes(a) &&
      !startsWithCode.includes(a) &&
      !startsWithCity.includes(a) &&
      !substringCityOrName.includes(a) &&
      (a.country.toLowerCase().includes(q) || (a.keywords && a.keywords.toLowerCase().includes(q)))
  );

  const combined = [
    ...exactCode,
    ...startsWithCode,
    ...startsWithCity,
    ...substringCityOrName,
    ...countryOrKeywords,
  ];

  return combined.slice(0, limit);
};

/**
 * Robustly resolves any input string (city, code, label) to a 3-letter IATA code.
 */
export const resolveAirportCode = (inputStr?: string | null): string => {
  if (!inputStr) return 'DEL';
  const trimmed = inputStr.trim();
  if (!trimmed) return 'DEL';

  // 1. Check parenthesized format: "Kathmandu (KTM)" or "Delhi (DEL)"
  const parenMatch = trimmed.match(/\(([A-Za-z]{3})\)/);
  if (parenMatch) return parenMatch[1].toUpperCase();

  // 2. Direct 3-letter uppercase check
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const lower = trimmed.toLowerCase();

  // 3. Fast O(1) code map check
  const byCode = codeMap.get(lower);
  if (byCode) return byCode.code;

  // 4. Fast O(1) city map check
  const byCity = cityMap.get(lower);
  if (byCity) return byCity.code;

  // 5. Prefix match in global database
  const startsWith = GLOBAL_AIRPORTS.find((a) => a.city.toLowerCase().startsWith(lower));
  if (startsWith) return startsWith.code;

  // 6. Substring match in global database
  const matched = GLOBAL_AIRPORTS.find(
    (a) =>
      a.city.toLowerCase().includes(lower) ||
      a.name.toLowerCase().includes(lower) ||
      (a.keywords && a.keywords.toLowerCase().includes(lower))
  );
  if (matched) return matched.code;

  // 7. Last resort: if 3 letters return uppercase, otherwise fallback default
  if (trimmed.length === 3) return trimmed.toUpperCase();
  return 'DEL';
};

/**
 * Gets airport record by 3-letter IATA code.
 */
export const getAirportByCode = (code?: string | null): AirportRecord | null => {
  if (!code) return null;
  return codeMap.get(code.trim().toLowerCase()) || null;
};
