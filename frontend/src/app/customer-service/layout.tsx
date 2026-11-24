import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '24/7 Customer Service & Booking Support Desk',
  description: 'Reach TourHelpDesk 24/7 Customer Service Desk. Call toll-free at +1 (888) 791-8007 or email support@tourhelpdeskinc.com for flight modifications, cancellations, and offline booking deals.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/customer-service',
  },
  openGraph: {
    title: '24/7 Customer Service & Booking Support Desk | Tour Helpdesk',
    description: 'Round-the-clock live phone and email support for flight, hotel, and travel bookings.',
    url: 'https://tourhelpdesk.com/customer-service',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
};

export default function CustomerServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
