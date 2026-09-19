export const formatToMMDDYYYY = (dateStr: string): string => {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[0]}`;
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
      }
      return dateStr;
    }
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateStr;
  }
};

export const formatTimeAMPM = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '12:00 PM';
  try {
    const spaceSplit = dateTimeStr.split(' ');
    if (spaceSplit.length >= 2) {
      const timePart = spaceSplit[1];
      const [hStr, mStr] = timePart.split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10) || 0;
      const isAM = h < 12;
      h = h % 12 || 12;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`;
    }
    return dateTimeStr;
  } catch (e) {
    return dateTimeStr;
  }
};

export const CITY_TO_IATA: Record<string, string> = {
  // India Hubs & Cities
  'delhi': 'DEL',
  'new delhi': 'DEL',
  'mumbai': 'BOM',
  'bombay': 'BOM',
  'bangalore': 'BLR',
  'bengaluru': 'BLR',
  'kolkata': 'CCU',
  'calcutta': 'CCU',
  'chennai': 'MAA',
  'madras': 'MAA',
  'hyderabad': 'HYD',
  'ahmedabad': 'AMD',
  'pune': 'PNQ',
  'goa': 'GOI',
  'dabolim': 'GOI',
  'mopa': 'GOX',
  'jaipur': 'JAI',
  'lucknow': 'LKO',
  'kochi': 'COK',
  'cochin': 'COK',
  'thiruvananthapuram': 'TRV',
  'trivandrum': 'TRV',
  'chandigarh': 'IXC',
  'varanasi': 'VNS',
  'amritsar': 'ATQ',
  'patna': 'PAT',
  'bhubaneswar': 'BBI',
  'guwahati': 'GAU',
  'srinagar': 'SXR',
  'indore': 'IDR',
  'nagpur': 'NAG',
  'coimbatore': 'CJB',
  'visakhapatnam': 'VTZ',

  // Middle East
  'dubai': 'DXB',
  'abu dhabi': 'AUH',
  'sharjah': 'SHJ',
  'doha': 'DOH',
  'riyadh': 'RUH',
  'jeddah': 'JED',
  'muscat': 'MCT',
  'bahrain': 'BAH',
  'kuwait': 'KWI',

  // Asia Pacific
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'phuket': 'HKT',
  'kuala lumpur': 'KUL',
  'bali': 'DPS',
  'denpasar': 'DPS',
  'hong kong': 'HKG',
  'tokyo': 'HND',
  'narita': 'NRT',
  'haneda': 'HND',
  'seoul': 'ICN',
  'sydney': 'SYD',
  'melbourne': 'MEL',
  'auckland': 'AKL',

  // Europe
  'london': 'LHR',
  'heathrow': 'LHR',
  'gatwick': 'LGW',
  'manchester': 'MAN',
  'paris': 'CDG',
  'frankfurt': 'FRA',
  'amsterdam': 'AMS',
  'schiphol': 'AMS',
  'rome': 'FCO',
  'milan': 'MXP',
  'madrid': 'MAD',
  'barcelona': 'BCN',
  'zurich': 'ZRH',
  'geneva': 'GVA',
  'vienna': 'VIE',
  'munich': 'MUC',
  'dublin': 'DUB',
  'istanbul': 'IST',

  // Americas
  'new york': 'JFK',
  'nyc': 'JFK',
  'newark': 'EWR',
  'chicago': 'ORD',
  'los angeles': 'LAX',
  'san francisco': 'SFO',
  'miami': 'MIA',
  'toronto': 'YYZ',
  'vancouver': 'YVR',
  'montreal': 'YUL',
  'calgary': 'YYC',
  'cancun': 'CUN',
  'mexico city': 'MEX',
};

const INDIAN_AIRPORTS = new Set([
  'DEL', 'BOM', 'BLR', 'CCU', 'MAA', 'HYD', 'AMD', 'GOI', 'GOX', 'COK',
  'PNQ', 'JAI', 'LKO', 'TRV', 'IXC', 'IXB', 'PAT', 'GAU', 'BBI', 'SXR',
  'IDR', 'NAG', 'VNS', 'ATQ', 'VTZ', 'CJB', 'IXR', 'BDQ', 'UDR', 'IXE',
  'TRZ', 'RPR', 'RJA', 'IMF', 'IXA', 'DIB', 'IXZ', 'STV', 'BHO', 'GAY',
  'IXJ', 'IXL', 'KNU', 'JDH', 'IXM', 'TIR', 'HJR', 'AGX', 'CNN', 'DMU',
  'DED', 'GWL', 'JLR', 'AJL', 'SHL', 'TEZ', 'ZER', 'BEK', 'BUP', 'IXG',
  'HBX', 'MYQ', 'IXU', 'KLH', 'NDC', 'NMB', 'ISK', 'SAG', 'TNI', 'IXW',
  'KQH', 'PGH', 'VGA', 'RUP', 'IXS', 'IXN', 'DHM', 'KUU'
]);

export const isIndianAirport = (code?: string | null): boolean => {
  if (!code) return false;
  return INDIAN_AIRPORTS.has(code.toUpperCase().trim());
};

export const isDomesticRoute = (origin: string, destination: string): boolean => {
  const o = extractCode(origin);
  const d = extractCode(destination);
  return isIndianAirport(o) && isIndianAirport(d);
};

export const extractCode = (str: string): string => {
  if (!str) return 'DEL';
  const match = str.match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = str.trim();
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const lower = trimmed.toLowerCase();
  if (CITY_TO_IATA[lower]) return CITY_TO_IATA[lower];

  for (const [city, code] of Object.entries(CITY_TO_IATA)) {
    if (lower.includes(city)) return code;
  }

  return trimmed.substring(0, 3).toUpperCase();
};

