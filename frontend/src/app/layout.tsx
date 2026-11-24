import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { CookieConsentProvider } from "../context/CookieConsentContext";
import CookieConsentBanner from "../components/common/CookieConsentBanner";
import CookiePreferencesModal from "../components/common/CookiePreferencesModal";
import GoogleAuthProvider from "./providers/GoogleAuthProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tourhelpdesk.com'),
  title: {
    default: "Tour Helpdesk - Flights, Hotels & Holiday Bookings",
    template: "%s | Tour Helpdesk",
  },
  description: "Book cheap domestic & international flights, luxury hotels, and intercity buses with 24/7 AI travel support and exclusive offline discounts.",
  keywords: [
    "flight booking",
    "cheap flights",
    "hotels",
    "bus tickets",
    "tour helpdesk",
    "travel deals",
    "vacation packages",
    "airline tickets",
    "last minute flights"
  ],
  authors: [{ name: "Tour Helpdesk", url: "https://tourhelpdesk.com" }],
  creator: "Tour Helpdesk",
  publisher: "Tour Helpdesk",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Tour Helpdesk - Instant Flights & Hotel Deals",
    description: "Compare live fares across 500+ airlines. Fast, secure online booking with 24/7 AI concierge.",
    url: "https://tourhelpdesk.com",
    siteName: "Tour Helpdesk",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Helpdesk - Flights & Hotel Deals",
    description: "Book cheap flights and stays with instant 24/7 AI assistance.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TravelAgency", "Organization"],
        "@id": "https://tourhelpdesk.com/#organization",
        "name": "Tour Helpdesk",
        "alternateName": ["TourHelpDesk", "Tour Help Desk Inc"],
        "url": "https://tourhelpdesk.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tourhelpdesk.com/tourhelpdesk.png",
          "caption": "Tour Helpdesk"
        },
        "image": "https://tourhelpdesk.com/tourhelpdesk.png",
        "description": "Enterprise travel booking engine and 24/7 travel concierge providing unpublished offline airline fares, luxury hotels, and intercity bus routes.",
        "telephone": "+1-888-791-8007",
        "email": "support@tourhelpdeskinc.com",
        "priceRange": "$$",
        "currenciesAccepted": "USD, CAD, INR, EUR, GBP, AED",
        "paymentAccepted": "Credit Card, Debit Card, Net Banking, UPI",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+1-888-791-8007",
            "contactType": "customer service",
            "contactOption": "TollFree",
            "areaServed": ["US", "CA", "IN", "GB", "AE"],
            "availableLanguage": ["English", "Hindi"],
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            }
          }
        ],
        "sameAs": [
          "https://facebook.com/tourhelpdesk",
          "https://twitter.com/tourhelpdesk",
          "https://instagram.com/tourhelpdesk"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://tourhelpdesk.com/#website",
        "url": "https://tourhelpdesk.com",
        "name": "Tour Helpdesk",
        "publisher": {
          "@id": "https://tourhelpdesk.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://tourhelpdesk.com/flights?from={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col`}>
        <ThemeProvider>
          <ToastProvider>
            <CookieConsentProvider>
              <GoogleAuthProvider>
                {children}
                <CookieConsentBanner />
                <CookiePreferencesModal />
              </GoogleAuthProvider>
            </CookieConsentProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
