import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Airline Tickets & Domestic Flight Deals',
  description: 'Search, compare, and book domestic and international flights across 500+ airlines. Fast e-ticketing and 24/7 travel desk phone support at +1 (888) 791-8007.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/flights',
  },
  openGraph: {
    title: 'Airline Tickets & Domestic Flight Deals | Tour Helpdesk',
    description: 'Compare live fares across 500+ global airlines with 24/7 travel concierge phone assistance.',
    url: 'https://tourhelpdesk.com/flights',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flight Deals | Tour Helpdesk',
    description: 'Book cheap domestic and international flights with instant 24/7 phone support.',
  },
};

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
