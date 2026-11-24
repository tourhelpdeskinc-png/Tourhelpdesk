import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cheap Flights & Unpublished Airline Ticket Deals',
  description: 'Book cheap domestic and international flights starting from $49. Compare 500+ airlines, unlock secret unpublished offline deals, and get 24/7 ticket support at +1 (888) 791-8007.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/cheap-flights',
  },
  openGraph: {
    title: 'Cheap Flights & Unpublished Airline Ticket Deals | Tour Helpdesk',
    description: 'Save up to 40% on domestic & international flights with 24/7 travel concierge phone assistance.',
    url: 'https://tourhelpdesk.com/cheap-flights',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheap Flights & Unpublished Airline Deals | Tour Helpdesk',
    description: 'Compare 500+ airlines with instant 24/7 ticket concierge phone assistance.',
  },
};

export default function CheapFlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
