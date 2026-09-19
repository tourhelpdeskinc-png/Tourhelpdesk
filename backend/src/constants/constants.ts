export const AIRLINE_CODE_MAP: Record<string, string> = {
  '6E': 'IndiGo',
  'AI': 'Air India',
  'UK': 'Vistara',
  'QP': 'Akasa Air',
  'SG': 'SpiceJet',
  'G8': 'Go First',
  'I5': 'AirAsia India',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'EY': 'Etihad Airways',
  'BA': 'British Airways',
  'AA': 'American Airlines',
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'SQ': 'Singapore Airlines',
  'TK': 'Turkish Airlines',
  'AC': 'Air Canada',
  'KL': 'KLM Royal Dutch Airlines',
  'CX': 'Cathay Pacific',
  'QF': 'Qantas',
  'FZ': 'flydubai',
  'GF': 'Gulf Air',
  'WY': 'Oman Air',
  'SV': 'Saudia',
  'KU': 'Kuwait Airways',
  'J9': 'Jazeera Airways',
  'MH': 'Malaysia Airlines',
  'TG': 'Thai Airways',
  'VN': 'Vietnam Airlines',
  'JL': 'Japan Airlines',
  'NH': 'ANA',
  'KE': 'Korean Air',
  'NZ': 'Air New Zealand',
  'AM': 'Aeroméxico',
  'TP': 'TAP Air Portugal',
  'NK': 'Spirit Airlines',
  'B6': 'JetBlue',
  'WN': 'Southwest Airlines',
  'AS': 'Alaska Airlines',
  'WS': 'WestJet',
};

export const getAirlineName = (code: string, rawName?: string): string => {
  if (rawName && rawName.trim().length > 0 && rawName !== 'Partner Airline') {
    return rawName.trim();
  }
  return AIRLINE_CODE_MAP[code] || `${code} Airlines`;
};

export const getAirlineCode = (nameOrCode?: string | null): string => {
  if (!nameOrCode) return '';
  const trimmed = nameOrCode.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const lower = trimmed.toLowerCase();
  for (const [code, name] of Object.entries(AIRLINE_CODE_MAP)) {
    if (name.toLowerCase() === lower || name.toLowerCase().includes(lower) || lower.includes(name.toLowerCase())) {
      return code;
    }
  }
  return trimmed.substring(0, 2).toUpperCase();
};

