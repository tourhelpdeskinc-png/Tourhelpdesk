import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Flight Offers & Promo Deals',
  description: 'Exclusive airline promo codes, seasonal travel discounts, and student flight deals. Save up to $500 on business and economy bookings with TourHelpDesk.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/special-offer',
  },
  openGraph: {
    title: 'Special Flight Offers & Promo Deals | Tour Helpdesk',
    description: 'Exclusive flight promo deals and seasonal savings across top global airlines.',
    url: 'https://tourhelpdesk.com/special-offer',
    siteName: 'Tour Helpdesk',
    type: 'website',
  },
};

export default function SpecialOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
