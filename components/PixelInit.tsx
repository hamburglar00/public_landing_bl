'use client';

import Script from 'next/script';

type Props = {
  pixelId: string;
};

export default function PixelInit({ pixelId }: Props) {
  if (!pixelId) return null;

  return (
    <Script id={`meta-pixel-${pixelId}`} strategy="afterInteractive">
      {`
        (function () {
          try {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
            t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            window.__metaPixelInitDone = window.__metaPixelInitDone || {};
            if (window.__metaPixelInitDone['${pixelId}']) return;

            var params = new URLSearchParams(window.location.search);
            var email = (params.get('email') || '').trim().toLowerCase();
            var phoneRaw = params.get('phone') || '';
            var phone = phoneRaw.replace(/\\D+/g, '');
            if (phone.length === 10) phone = '54' + phone;

            var externalId = '';
            try {
              externalId = localStorage.getItem('external_id') || '';
              if (!externalId) {
                externalId =
                  (window.crypto && typeof window.crypto.randomUUID === 'function')
                    ? window.crypto.randomUUID()
                    : (Date.now() + '-' + Math.random().toString(36).slice(2));
                localStorage.setItem('external_id', externalId);
              }
            } catch (e) {
              externalId = Date.now() + '-' + Math.random().toString(36).slice(2);
            }

            var advancedMatching = { external_id: externalId };
            if (email) advancedMatching.em = email;
            if (phone) advancedMatching.ph = phone;

            fbq('init', '${pixelId}', advancedMatching);
            fbq('track', 'PageView');

            window.__metaPixelInitDone['${pixelId}'] = true;
          } catch (e) {
            console.error('Meta Pixel init error', e);
          }
        })();
      `}
    </Script>
  );
}