"use client";

import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants/config';
import { Badge } from '@/components/ui/Badge';

interface PromotionalPopupProps {
  onClose: () => void;
  minPrice: number;
  route: string;
}

const PromotionalPopup: React.FC<PromotionalPopupProps> = ({ onClose, minPrice, route }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[100] animate-in slide-in-from-bottom duration-500">
        <div 
          onClick={() => setIsMinimized(false)}
          className="bg-white dark:bg-slate-900 rounded-full shadow-[0_10px_35px_-5px_rgba(14,37,94,0.3)] border-2 border-[#E8A11A] p-2 sm:p-2.5 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all group relative pr-10 sm:pr-14"
        >
          {/* Circular Glowing Navy + Gold Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#0E255E] text-[#E8A11A] border-2 border-[#E8A11A] rounded-full flex items-center justify-center shrink-0 shadow-md shadow-[#0E255E]/30 relative">
             <div className="absolute inset-0 border-2 border-[#E8A11A]/40 rounded-full animate-ping"></div>
             <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
             </svg>
          </div>
          
          {/* Banner Text (Hidden on very small screens, visible on sm and up) */}
          <div className="hidden sm:block">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Offline Promo</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{route || "Secret Deal"}</p>
          </div>
          <div className="block sm:hidden px-1">
             <p className="text-[10px] font-black uppercase text-[#E8A11A] tracking-wider">Sale</p>
          </div>

          {/* Close Widget Button */}
          <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                onClose();
            }}
            className="absolute right-2 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-[#0E255E] hover:text-[#E8A11A] transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(14,37,94,0.45)] w-full max-w-[320px] sm:max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-400 border border-[#E8A11A]/30 dark:border-[#E8A11A]/40">
        
        {/* Minimize Button in Top Right */}
        <button 
          onClick={() => setIsMinimized(true)}
          className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-sm active:scale-95"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col h-full">
          {/* Header in Brand Navy (#0E255E) with Golden Spark */}
          <div className="bg-gradient-to-br from-[#0E255E] via-[#091a42] to-[#0E255E] p-4 sm:p-5 text-center relative overflow-hidden text-white border-b border-[#E8A11A]/20">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8A11A]/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="w-11 h-11 bg-white/10 border border-[#E8A11A]/40 rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-[#E8A11A] shadow-inner shadow-white/10">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
               </svg>
            </div>
            
            <h2 className="text-white text-base sm:text-lg font-black mb-1.5 leading-tight tracking-tight">Unpublished Price Alert</h2>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8A11A] text-slate-950 shadow-md shadow-[#E8A11A]/30">
              ★ Flash Deal Available
            </span>
          </div>
          
          {/* Body Content (Text Preserved Exactly) */}
          <div className="p-4 sm:p-5 flex flex-col items-center">
            <div className="text-center mb-4 w-full">
              <div className="text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold leading-relaxed">
                <span className="block mb-1 text-slate-600 dark:text-slate-300">Route: <span className="font-black text-slate-900 dark:text-white">{route || "Premium Flights"}</span></span>
                <span className="text-slate-400 dark:text-slate-500">Online Fare: <span className="line-through font-bold">${minPrice.toLocaleString()}</span></span>
                <span className="block mt-1.5 text-xs sm:text-sm font-extrabold text-[#0E255E] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 py-1 px-2 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  21+ Unpublished Flights Available!
                </span>
                <span className="block mt-2 font-black text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Offline Offer: <span className="text-[#E8A11A] text-xl sm:text-2xl font-black ml-1">${Math.floor(minPrice * 0.85).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Direct Booking Hotline Card */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center mb-4 group hover:border-[#E8A11A]/50 transition-all">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Direct Booking Hotline</span>
              <div className="flex items-center gap-2">
                 <div className="w-7 h-7 bg-[#0E255E] text-[#E8A11A] border border-[#E8A11A]/40 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <a href={CONTACT_INFO.HOTLINE_TEL} className="text-lg sm:text-xl font-black text-[#0E255E] dark:text-[#E8A11A] hover:text-[#E8A11A] dark:hover:text-[#f4b63a] transition-colors whitespace-nowrap tracking-tight">{CONTACT_INFO.HOTLINE_DISPLAY}</a>
              </div>
            </div>

            {/* Action Buttons - Golden Color like Home Button */}
            <div className="grid grid-cols-1 gap-2.5 w-full">
              <a 
                href={CONTACT_INFO.HOTLINE_TEL} 
                className="bg-[#E8A11A] hover:bg-[#d69013] text-slate-950 text-xs sm:text-sm font-black py-3 rounded-xl shadow-lg shadow-[#E8A11A]/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                Call Now
              </a>
              <button 
                onClick={() => setIsMinimized(true)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[11px] sm:text-xs py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                No Thanks, Continue Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;