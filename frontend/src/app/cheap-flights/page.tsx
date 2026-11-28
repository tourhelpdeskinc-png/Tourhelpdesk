"use client";

import React, { Suspense } from 'react';
import Script from 'next/script';
import AppLayout from '../../components/layout/AppLayout';
import FlightsPage from '../../components/FlightsPage';
import ConsentGate from '../../components/common/ConsentGate';

export default function CheapFlightsRoute() {
  return (
    <AppLayout activeView="cheap-flights" showDisclaimer={true}>
      {/* Marketing Pixels (Respect Marketing Cookie Consent) */}
      <ConsentGate category="marketing">
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
        {/* Microsoft Advertising / Bing UET Tag */}
        <Script
          id="bing-uet-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d, t, u, o) {
                if (d.getElementById('bing-uet-script')) {
                  if (w[u] && typeof w[u].push === 'function') { w[u].push("pageLoad"); }
                  return;
                }
                w[u] = w[u] || [], o.ts = (new Date).getTime();
                var n = d.createElement(t);
                n.id = 'bing-uet-script';
                n.src = "https://bat.bing.net/bat.js?ti=" + o.ti + ("uetq" != u ? "&q=" + u : "");
                n.async = 1;
                n.onload = n.onreadystatechange = function() {
                  var s = this.readyState;
                  s && "loaded" !== s && "complete" !== s ||
                  (o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad"),
                  n.onload = n.onreadystatechange = null);
                };
                var i = d.getElementsByTagName(t)[0];
                i.parentNode.insertBefore(n, i);
              })(window, document, "script", "uetq", {
                ti: "97295839",
                enableAutoSpaTracking: true
              });
            `,
          }}
        />
      </ConsentGate>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
        <FlightsPage isCheapFlights={true} />
      </Suspense>
    </AppLayout>
  );
}


