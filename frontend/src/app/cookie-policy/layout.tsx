import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how TourHelpDesk uses essential, functional, performance, and analytics cookies to deliver a safe, personalized flight and hotel booking experience.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy | Tour Helpdesk',
    description: 'Learn about our cookie usage, data privacy practices, and how to manage your cookie preferences.',
    url: 'https://tourhelpdesk.com/cookie-policy',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
};

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
