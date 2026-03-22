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
            !function(f,b,e,v,n,t,s){
              if(f.fbq) return;
              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n, arguments)
                  : n.queue.push(arguments);
              };
              if(!f._fbq) f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);
            }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

            try {
              var params = new URLSearchParams(window.location.search);

              function normEmail(v){
                v = (v || '').trim().toLowerCase();
                return v || undefined;
              }

              function normPhone(v){
                var d = String(v || '').replace(/\\D+/g, '');
                if (!d) return undefined;
                if (d.indexOf('54') === 0) return d;
                d = d.replace(/^0+/, '').replace(/^15/, '');
                if (d.length === 10) return '54' + d;
                return d || undefined;
              }

              function safeUUID(){
                if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                  return window.crypto.randomUUID();
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
                  var r = Math.random() * 16 | 0;
                  var v = c === 'x' ? r : (r & 0x3 | 0x8);
                  return v.toString(16);
                });
              }

              function getOrCreateExternalId(){
                try {
                  var existing = localStorage.getItem('external_id');
                  if (existing) return existing;
                  var created = safeUUID();
                  localStorage.setItem('external_id', created);
                  return created;
                } catch (e) {
                  return safeUUID();
                }
              }

              var userEmail = normEmail(params.get('em') || params.get('email') || '');
              var userPhone = normPhone(params.get('ph') || params.get('phone') || '');
              var userFn = (params.get('fn') || '').trim() || undefined;
              var userLn = (params.get('ln') || '').trim() || undefined;
              var externalId = getOrCreateExternalId();

              try {
                if (params.get('em') || params.get('email')) {
                  localStorage.setItem('em', userEmail || '');
                }
                if (params.get('ph') || params.get('phone')) {
                  localStorage.setItem('ph', userPhone || '');
                }
              } catch (e) {}

              fbq('init', '${pixelId}', {
                em: userEmail,
                ph: userPhone,
                fn: userFn,
                ln: userLn,
                external_id: externalId
              });

              try {
                fbq('set', 'userData', {
                  em: userEmail,
                  ph: userPhone,
                  fn: userFn,
                  ln: userLn,
                  external_id: externalId
                });
              } catch (e) {}

              fbq('track', 'PageView');

              window.__META = {
                PIXEL_ID: '${pixelId}',
                userEmail: userEmail,
                userPhone: userPhone,
                userFn: userFn,
                userLn: userLn,
                externalId: externalId,
                safeUUID: safeUUID
              };
            } catch (e) {
              console.error('Meta Pixel init error', e);
            }
          })();
        `}
    </Script>
  );
}
