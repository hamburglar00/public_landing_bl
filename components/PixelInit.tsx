import Script from 'next/script';

import { buildTrackingStorageNamespace } from '@/lib/tracking/clientStorage';
import { buildPhoneNormalizerScript } from '@/lib/tracking/identity';

type Props = {
  pixelId: string;
  slug: string;
  phoneCountryCode?: string;
};

declare global {
  interface Window {
    __META?: {
      PIXEL_ID?: string;
      userEmail?: string;
      userPhone?: string;
      userFn?: string;
      userLn?: string;
      externalId?: string;
      safeUUID?: () => string;
    };
  }
}

function escapeScriptJson(value: unknown) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
    switch (character) {
      case '<': return '\\u003c';
      case '>': return '\\u003e';
      case '&': return '\\u0026';
      case '\u2028': return '\\u2028';
      case '\u2029': return '\\u2029';
      default: return character;
    }
  });
}

export default function PixelInit({
  pixelId,
  slug,
  phoneCountryCode = '54'
}: Props) {
  const normalizedPixelId = String(pixelId || '').trim().replace(/\D+/g, '');
  if (!normalizedPixelId) return null;
  const storageNamespace = buildTrackingStorageNamespace(normalizedPixelId, slug);
  const storageNamespaceJson = escapeScriptJson(storageNamespace);

  return (
    <>
      <script
        id={`meta-bootstrap-${normalizedPixelId}`}
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var params = new URLSearchParams(window.location.search);
                var storageNamespace = ${storageNamespaceJson};

                function storageKey(key){
                  return storageNamespace + ':' + key;
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

                function readCookie(name){
                  var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
                  return match ? decodeURIComponent(match[1]) : '';
                }

                function writeCookie(name, value){
                  var maxAge = 90 * 24 * 60 * 60;
                  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
                }

                function firstNonEmpty(values){
                  for (var i = 0; i < values.length; i += 1) {
                    var value = values[i];
                    if (value != null) {
                      var text = String(value).trim();
                      if (text) return text;
                    }
                  }
                  return '';
                }

                function readLocalStorage(key){
                  try {
                    return localStorage.getItem(storageKey(key)) || '';
                  } catch (e) {
                    return '';
                  }
                }

                function writeLocalStorage(key, value){
                  try {
                    if (value) localStorage.setItem(storageKey(key), value);
                  } catch (e) {}
                }

                function sanitizeAddressBar(){
                  try {
                    var url = new URL(window.location.href);
                    var sensitiveKeys = ['email', 'em', 'phone', 'ph', 'fn', 'ln', 'external_id', 'eid', 'ct', 'st', 'zip', 'country'];
                    var changed = false;
                    sensitiveKeys.forEach(function(key){
                      if (url.searchParams.has(key)) {
                        url.searchParams.delete(key);
                        changed = true;
                      }
                    });
                    if (changed) {
                      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
                    }
                  } catch (e) {}
                }

                function normEmail(value){
                  value = String(value || '').trim().toLowerCase();
                  return value || '';
                }

                ${buildPhoneNormalizerScript('normPhone')}

                var now = Date.now();
                if (!readCookie('_fbp')) {
                  writeCookie('_fbp', 'fb.1.' + now + '.' + Math.floor(Math.random() * 10000000000));
                }

                var fbclid = params.get('fbclid') || '';
                if (fbclid && !readCookie('_fbc')) {
                  writeCookie('_fbc', 'fb.1.' + now + '.' + fbclid);
                }

                var externalId = firstNonEmpty([
                  readLocalStorage('external_id'),
                  params.get('external_id'),
                  params.get('eid')
                ]) || safeUUID();

                var userEmail = normEmail(firstNonEmpty([
                  params.get('email'),
                  params.get('em'),
                  readLocalStorage('em')
                ]));

                var userPhone = normPhone(firstNonEmpty([
                  params.get('phone'),
                  params.get('ph'),
                  readLocalStorage('ph')
                ]), ${escapeScriptJson(phoneCountryCode)});

                writeLocalStorage('external_id', externalId);
                writeLocalStorage('em', userEmail);
                writeLocalStorage('ph', userPhone);
                writeLocalStorage('ct', params.get('ct') || '');
                writeLocalStorage('st', params.get('st') || '');
                writeLocalStorage('zip', params.get('zip') || '');
                writeLocalStorage('country', params.get('country') || '');

                window.__META = Object.assign({}, window.__META || {}, {
                  PIXEL_ID: '${normalizedPixelId}',
                  userEmail: userEmail,
                  userPhone: userPhone,
                  userFn: firstNonEmpty([params.get('fn')]),
                  userLn: firstNonEmpty([params.get('ln')]),
                  externalId: externalId,
                  safeUUID: safeUUID
                });
                sanitizeAddressBar();
              } catch (e) {}
            })();
          `
        }}
      />
      <Script id={`meta-pixel-${normalizedPixelId}`} strategy="afterInteractive">
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
              var meta = window.__META || {};

              fbq('init', '${normalizedPixelId}', {
                em: meta.userEmail || undefined,
                ph: meta.userPhone || undefined,
                fn: meta.userFn || undefined,
                ln: meta.userLn || undefined,
                external_id: meta.externalId || undefined
              });

              fbq('track', 'PageView');
            } catch (e) {
              console.error('Meta Pixel init error', e);
            }
          })();
        `}
      </Script>
    </>
  );
}
