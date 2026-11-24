import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Hotel Bookings & Resort Deals',
  description: 'Search and book luxury hotels, boutique stays, and budget accommodations worldwide. Instant confirmation with zero hidden fees and 24/7 concierge support.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/hotels',
  },
  openGraph: {
    title: 'Luxury Hotel Bookings & Resort Deals | Tour Helpdesk',
    description: 'Find exclusive rates on top hotels and resorts worldwide with transparent pricing.',
    url: 'https://tourhelpdesk.com/hotels',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Hotel Deals | Tour Helpdesk',
    description: 'Instant hotel confirmations with 24/7 travel concierge support.',
  },
};

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
