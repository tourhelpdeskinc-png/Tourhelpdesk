"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';
import { Ship, Plane, Hotel, Car, Train, Luggage, Ticket, ShieldCheck, Compass, Bus, Smartphone } from 'lucide-react';

export interface MobileServiceGridProps {
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const MobileServiceGrid: React.FC<MobileServiceGridProps> = ({
  onSelectCategory,
  className,
}) => {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  const handleItemClick = (id: string, action: () => void) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    }
    action();
  };

  // Shared Footer Navy (#0E255E) + Golden Ring/Icon (#E8A11A) styling (Original Brand)
  const brandIconStylePrimary = 'bg-[#0E255E] dark:bg-[#0b1a3e] text-[#E8A11A] border-2 border-[#E8A11A] shadow-md shadow-[#0E255E]/30 group-hover:scale-105 transition-all';
  const brandIconStyleSecondary = 'bg-[#0E255E] dark:bg-[#0b1a3e] text-[#E8A11A] border-2 border-[#E8A11A] shadow-md shadow-[#0E255E]/20 group-hover:scale-105 transition-all';

  // Row 1: Fixed 4 Equal Columns (Primary)
  const firstRowServices = [
    {
      id: 'cruises',
      name: 'Cruises',
      action: () => {
        const cruisesTab = document.querySelector('button[data-tab="cruises"]');
        if (cruisesTab instanceof HTMLElement) cruisesTab.click();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      },
      icon: <Ship className="w-6 h-6 text-[#E8A11A]" />
    },
    {
      id: 'flights',
      name: 'Flights',
      action: () => {
        const flightsTab = document.querySelector('button[data-tab="flights"]');
        if (flightsTab instanceof HTMLElement) {
          flightsTab.click();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        } else {
          router.push('/flights');
        }
      },
      icon: <Plane className="w-6 h-6 text-[#E8A11A]" />
    },
    {
      id: 'hotels',
      name: 'Hotels',
      action: () => router.push('/hotels'),
      icon: <Hotel className="w-6 h-6 text-[#E8A11A]" />
    },
    {
      id: 'cars',
      name: 'Car Rental',
      action: () => router.push('/car-rental'),
      icon: <Car className="w-6 h-6 text-[#E8A11A]" />
    }
  ];

  // Row 2: Exactly 4 Items Visible at Once in Viewport (Swipeable for remaining items)
  const secondRowServices = [
    {
      id: 'trains',
      name: 'Trains',
      action: () => router.push('/bus'),
      icon: <Train className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'holidays',
      name: 'Holidays',
      action: () => router.push('/offers'),
      icon: <Luggage className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'activities',
      name: 'Activities',
      action: () => {
        const el = document.getElementById('outdoor-activities');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else router.push('/offers');
      },
      icon: <Ticket className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'insurance',
      name: 'Insurance',
      action: () => router.push('/customer-service'),
      icon: <ShieldCheck className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'visa',
      name: 'Visa',
      action: () => router.push('/customer-service'),
      icon: <Compass className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'bus',
      name: 'Bus',
      action: () => router.push('/bus'),
      icon: <Bus className="w-5 h-5 text-[#E8A11A]" />
    },
    {
      id: 'app',
      name: 'App',
      action: () => router.push('/special-offer'),
      icon: <Smartphone className="w-5 h-5 text-[#E8A11A]" />
    }
  ];

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-slate-900 pt-3.5 pb-2 px-2 block md:hidden select-none',
        className
      )}
    >
      <div className="w-full max-w-md mx-auto">
        {/* ROW 1: 4 Fixed Equal Columns (Primary - 52px) */}
        <div className="grid grid-cols-4 gap-1 mb-3.5">
          {firstRowServices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.action)}
              className="flex flex-col items-center justify-start group cursor-pointer active:scale-95 transition-transform duration-150 outline-none w-full"
            >
              <div
                className={cn(
                  'w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                  brandIconStylePrimary
                )}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white mt-1.5 text-center leading-tight tracking-tight">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* ROW 2: Exactly 4 Columns Visible at a time (Auto 25% width), swipeable */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="grid grid-flow-col auto-cols-[25%] overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory scroll-smooth w-full"
        >
          {secondRowServices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.action)}
              className="flex flex-col items-center justify-start snap-start w-full group cursor-pointer active:scale-95 transition-transform duration-150 outline-none px-1"
            >
              <div
                className={cn(
                  'w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                  brandIconStyleSecondary
                )}
              >
                {item.icon}
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-900 dark:text-white mt-1 text-center leading-tight tracking-tight truncate w-full">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Swipe Indicator Dots (Hidden) */}
        <div className="hidden justify-center items-center gap-1.5 mt-2.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              scrollProgress < 0.5 ? 'w-4 bg-[#E8A11A]' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
            )}
          />
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              scrollProgress >= 0.5 ? 'w-4 bg-[#E8A11A]' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileServiceGrid;
