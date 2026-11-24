import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how TourHelpDesk safeguards your personal and booking data in compliance with global privacy regulations and PCI-DSS payment standards.',
  alternates: {
    canonical: 'https://tourhelpdesk.com/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
