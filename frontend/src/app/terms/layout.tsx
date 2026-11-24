import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Review the Terms & Conditions for booking domestic and international flights, hotel rooms, and bus tickets with TourHelpDesk.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/terms',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
