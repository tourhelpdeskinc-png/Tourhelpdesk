import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intercity Bus Tickets & Coach Booking',
  description: 'Book intercity bus tickets online with live seat selection, sleeper coach options, and instant booking confirmation. Reliable 24/7 travel desk support.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/bus',
  },
  openGraph: {
    title: 'Intercity Bus Tickets & Coach Booking | Tour Helpdesk',
    description: 'Easy online bus reservations with real-time seat tracking and verified operators.',
    url: 'https://tourhelpdesk.com/bus',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
};

export default function BusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
