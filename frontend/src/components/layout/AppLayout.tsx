"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';
import { useTheme } from '../../context/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  showHotels?: boolean;
  footerBgClass?: string;
  showDisclaimer?: boolean;
  disclaimerText?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeView,
  showHotels = true,
  footerBgClass = 'bg-[#0E255E]',
  showDisclaimer,
  disclaimerText,
}) => {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthSuccess = (_user: any) => {
    // Navbar updates immediately via the auth_change event; keep current page state & search results intact
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300 relative">
      <Navbar
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoClick={() => router.push('/')}
        onSupportClick={() => router.push('/customer-service')}
        onOffersClick={() => router.push('/offers')}
        onHotelsClick={() => router.push('/hotels')}
        activeView={activeView}
        showHotels={showHotels}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex-grow w-full min-w-0">
        {children}
      </main>

      {/* Centered Native Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Footer
        bgClass={footerBgClass}
        showDisclaimer={showDisclaimer ?? activeView === 'cheap-flights'}
        disclaimerText={disclaimerText}
        onLegalClick={() => router.push('/terms')}
        onAboutClick={() => router.push('/about')}
        onPrivacyClick={() => router.push('/privacy')}
        onTermsClick={() => router.push('/terms-of-use')}
        onCreditCardVerificationClick={() => router.push('/credit-card-verification')}
        onContactClick={() => router.push('/contact')}
      />
    </div>
  );
};

export default AppLayout;
