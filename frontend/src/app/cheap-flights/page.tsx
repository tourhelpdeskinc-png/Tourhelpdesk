"use client";

import React, { Suspense } from 'react';
import Script from 'next/script';
import AppLayout from '../../components/layout/AppLayout';
import FlightsPage from '../../components/FlightsPage';

export default function CheapFlightsRoute() {
  return (
    <AppLayout activeView="cheap-flights">
      {/* Taboola Pixel */}
      <Script
        id="taboola-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window._tfa = window._tfa || [];
            window._tfa.push({notify: 'event', name: 'page_view', id: 2125726});
            !function (t, f, a, x) {
              if (!document.getElementById(x)) {
                t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
              }
            }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/unip/2125726/tfa.js',
            'tb_tfa_script');
          `,
        }}
      />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
        <FlightsPage isCheapFlights={true} />
      </Suspense>
    </AppLayout>
  );
}


