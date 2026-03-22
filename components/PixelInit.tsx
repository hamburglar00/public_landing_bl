'use client';

import { useEffect } from 'react';

type Props = {
  pixelId: string;
};

type FbqFn = ((command: string, ...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: IArguments[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
    __metaPixelInitializedIds?: Set<string>;
    __metaPixelPageViewTrackedIds?: Set<string>;
  }
}

function getQueryParam(name: string): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get(name)?.trim() || '';
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `54${digits}`;
  return digits;
}

function getOrCreateExternalId(): string {
  if (typeof window === 'undefined') return '';

  try {
    const key = 'external_id';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const created =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function ensureFbqBootstrap(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (typeof window.fbq === 'function') return;

  const f = window;
  const n: FbqFn = function (this: unknown) {
    if (typeof n.callMethod === 'function') {
      n.callMethod(...Array.from(arguments));
    } else {
      n.queue?.push(arguments);
    }
  };

  n.push = n as unknown as (...args: unknown[]) => void;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  f.fbq = n;
  if (!f._fbq) {
    f._fbq = n;
  }
}

function ensurePixelScript(): void {
  if (typeof document === 'undefined') return;

  const src = 'https://connect.facebook.net/en_US/fbevents.js';
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

export default function PixelInit({ pixelId }: Props) {
  useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return;

    try {
      window.__metaPixelInitializedIds ??= new Set<string>();
      window.__metaPixelPageViewTrackedIds ??= new Set<string>();

      ensureFbqBootstrap();
      ensurePixelScript();

      const fbq = window.fbq;
      if (typeof fbq !== 'function') return;

      if (!window.__metaPixelInitializedIds.has(pixelId)) {
        const externalId = getOrCreateExternalId();
        const email = getQueryParam('email').toLowerCase();
        const ph = normalizePhone(getQueryParam('phone'));

        const advancedMatching: Record<string, string> = {
          external_id: externalId
        };

        if (email) advancedMatching.em = email;
        if (ph) advancedMatching.ph = ph;

        fbq('init', pixelId, advancedMatching);
        window.__metaPixelInitializedIds.add(pixelId);
      }

      if (!window.__metaPixelPageViewTrackedIds.has(pixelId)) {
        fbq('track', 'PageView');
        window.__metaPixelPageViewTrackedIds.add(pixelId);
      }
    } catch {
      // Nunca romper la landing por tracking
    }
  }, [pixelId]);

  return null;
}

