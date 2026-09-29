"use client";

import React, { Suspense } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FlightsPage from '../../components/FlightsPage';

export default function CheapFlightsRoute() {
  return (
    <AppLayout activeView="cheap-flights">
      <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
        <FlightsPage isCheapFlights={true} />
      </Suspense>
    </AppLayout>
  );
}

