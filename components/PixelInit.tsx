'use client';

import { useEffect } from 'react';

type Props = {
  pixelId: string;
};

function getQueryParam(name: string) {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

function normPhone(raw: string) {
  const p = String(raw || '').replace(/\D+/g, '');
  if (p.length === 10) return `54${p}`;
  return p || '';
}

function getOrCreateExternalId() {
  if (typeof window === 'undefined') return '';
  const existing = window.localStorage.getItem('external_id');
  if (existing) return existing;
  const created = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem('external_id', created);
  return created;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function PixelInit({ pixelId }: Props) {
  useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return;

    const external_id = getOrCreateExternalId();
    const email = getQueryParam('email')?.trim().toLowerCase() || undefined;
    const phoneRaw = getQueryParam('phone');
    const ph = phoneRaw ? normPhone(phoneRaw) : undefined;

    const ensurePixelScript = () => {
      const hasScript = !!document.querySelector(
        'script[src="https://connect.facebook.net/en_US/fbevents.js"]'
      );
      if (hasScript) return;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
      else document.head.appendChild(script);
    };

    const ensureFbqBootstrap = () => {
      if (window.fbq) return;
      const fbqShim = (...args: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fbqShim as any).queue.push(args);
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fbqShim as any).queue = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fbqShim as any).loaded = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fbqShim as any).version = '2.0';
      window.fbq = fbqShim as unknown as typeof window.fbq;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._fbq = window.fbq;
    };

    const runInit = () => {
      if (!window.fbq || (window.fbq as unknown) === undefined) return false;
      window.fbq('init', pixelId, {
        external_id,
        em: email,
        ph,
        country: 'AR'
      });
      window.fbq('track', 'PageView');
      return true;
    };

    ensureFbqBootstrap();
    ensurePixelScript();

    if (runInit()) return;

    const id = setInterval(() => {
      if (runInit()) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [pixelId]);

  return null;
}
