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

    const runInit = () => {
      if (!window.fbq) return false;
      window.fbq('init', pixelId, {
        external_id,
        em: email,
        ph,
        country: 'AR'
      });
      window.fbq('track', 'PageView');
      return true;
    };

    if (runInit()) return;

    const id = setInterval(() => {
      if (runInit()) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [pixelId]);

  return null;
}
