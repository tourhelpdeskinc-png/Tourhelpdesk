import React from 'react';
import FlightSearchingModal from './FlightSearchingModal';

/**
 * Single Realistic Flight Ticket Shimmer Skeleton
 * Matches exact geometry, layout, and height of real FlightResults cards to prevent any layout shift (CLS = 0)
 */
export const FlightTicketSkeleton: React.FC = React.memo(() => {
  return (
    <div className="animate-shimmer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 relative overflow-hidden shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        
        {/* === Left Content Skeleton === */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Airline row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-4 bg-slate-200 rounded-md w-28" />
              <div className="h-3 bg-slate-100 rounded-md w-16" />
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between gap-2 sm:gap-6 pt-1">
            <div className="min-w-[85px] space-y-1">
              <div className="h-7 bg-slate-200 rounded-md w-20" />
              <div className="h-3.5 bg-slate-100 rounded-md w-10" />
            </div>

            <div className="flex flex-col items-center flex-1 max-w-[200px] sm:max-w-[260px] px-2 space-y-2">
              <div className="h-3 bg-slate-100 rounded-md w-14" />
              <div className="w-full flex items-center justify-center relative">
                <div className="w-full h-px bg-slate-200" />
              </div>
              <div className="h-3 bg-slate-100 rounded-md w-16" />
            </div>

            <div className="min-w-[85px] space-y-1 text-right flex flex-col items-end">
              <div className="h-7 bg-slate-200 rounded-md w-20" />
              <div className="h-3.5 bg-slate-100 rounded-md w-10" />
            </div>
          </div>

          {/* Bottom meta row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-3 bg-slate-100 rounded-md w-20" />
              <div className="h-3 bg-slate-100 rounded-md w-24" />
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-20" />
          </div>
        </div>

        {/* Ticket Divider & Notches Skeleton */}
        <div className="hidden lg:flex flex-col items-center justify-between relative self-stretch py-0">
          <div className="w-5 h-5 -mt-5 rounded-full bg-slate-50 border-b border-slate-200 z-10" />
          <div className="w-px flex-1 border-r border-dashed border-slate-200 my-1" />
          <div className="w-5 h-5 -mb-5 rounded-full bg-slate-50 border-t border-slate-200 z-10" />
        </div>

        {/* Right Fare & Select Skeleton */}
        <div className="w-full lg:w-44 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-2 lg:pt-0">
          <div className="h-6 bg-slate-100 rounded-full w-20" />
          <div className="space-y-1 text-left lg:text-right">
            <div className="h-2.5 bg-slate-100 rounded-md w-10 ml-auto" />
            <div className="h-8 bg-slate-200 rounded-md w-24 ml-auto" />
          </div>
          <div className="h-10 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
});

FlightTicketSkeleton.displayName = 'FlightTicketSkeleton';

const STOPS_PLACEHOLDERS = [1, 2, 3];
const AIRLINES_PLACEHOLDERS = [1, 2, 3, 4];
const TICKETS_COUNT = [1, 2, 3, 4];

/**
 * Filter Sidebar Skeleton
 * Preserves left column layout for Zero Layout Shift
 */
export const FlightFilterSidebarSkeleton: React.FC = React.memo(() => {
  return (
    <div className="hidden lg:block w-72 shrink-0 animate-shimmer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-12" />
      </div>

      {/* Stops Filter Skeleton */}
      <div className="space-y-2.5">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-28 mb-3" />
        <div className="space-y-2">
          {STOPS_PLACEHOLDERS.map((idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-20" />
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800/40 rounded-md w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Slider Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
      </div>

      {/* Airlines Checklist Skeleton */}
      <div className="space-y-2.5 pt-2">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-24 mb-3" />
        <div className="space-y-2">
          {AIRLINES_PLACEHOLDERS.map((idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-24" />
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800/40 rounded-md w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FlightFilterSidebarSkeleton.displayName = 'FlightFilterSidebarSkeleton';

/**
 * Full Flight Search Skeleton View (Zero CLS layout)
 */
export const FlightSearchSkeleton: React.FC<{ from?: string; to?: string }> = React.memo(({
  from,
  to,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Route & Summary Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-2">
          {from && to ? (
            <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              <span className="text-blue-600 dark:text-blue-400">{from}</span>
              <span className="text-slate-300 dark:text-slate-600 mx-2">→</span>
              <span className="text-blue-600 dark:text-blue-400">{to}</span>
            </h2>
          ) : (
            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-64 animate-shimmer" />
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8A11A] animate-ping" />
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Scanning live airline fares and seat inventories...
            </p>
          </div>
        </div>

        {/* Sort Controls Skeleton */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start md:self-auto">
          <div className="h-7 w-20 bg-white dark:bg-slate-900 rounded-lg shadow-xs" />
          <div className="h-7 w-20 bg-transparent rounded-lg" />
          <div className="h-7 w-20 bg-transparent rounded-lg" />
        </div>
      </div>

      {/* 2-Column Exact Layout: Sidebar + Shimmer Flight Tickets */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        <FlightFilterSidebarSkeleton />

        <div className="flex-1 min-w-0 w-full space-y-4">
          {TICKETS_COUNT.map((key) => (
            <FlightTicketSkeleton key={key} />
          ))}
        </div>
      </div>
    </div>
  );
});

FlightSearchSkeleton.displayName = 'FlightSearchSkeleton';

export const SkeletonLoader: React.FC<{
  from?: string;
  to?: string;
  searchParams?: any;
  onClose?: () => void;
}> = React.memo(({ from, to, searchParams, onClose }) => {
  return (
    <>
      <FlightSearchingModal
        isOpen={true}
        searchParams={searchParams || (from && to ? { from, to } : null)}
        onClose={onClose}
      />
      <FlightSearchSkeleton from={from} to={to} />
    </>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
