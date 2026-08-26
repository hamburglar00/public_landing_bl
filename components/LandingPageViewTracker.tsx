'use client';

import { useEffect } from 'react';
import { getLandingPhone } from '@/lib/landing/getLandingPhone';
import type { LandingConfig, LandingPhoneResponse } from '@/lib/landing/types';
import {
  buildTrackingStorageKey,
  buildTrackingStorageNamespace
} from '@/lib/tracking/clientStorage';
import {
  firstNonEmpty,
  getOrCreateExternalId,
  normalizeLandingPhone
} from '@/lib/tracking/identity';

type Props = {
  slug: string;
  config: LandingConfig;
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

const PAGEVIEW_DEDUP_TTL_MS = 5 * 60 * 1000;

function getQueryParamsSnapshot() {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function getDeviceType() {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return 'tablet';
  if (/mobi|iphone|android/.test(ua)) return 'mobile';
  return 'desktop';
}

function getCookieValue(key: string) {
  if (typeof document === 'undefined') return '';
  try {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

function safeEventSourceUrl() {
  if (typeof window === 'undefined') return '';
  try {
    return `${window.location.origin}${window.location.pathname}`;
  } catch {
    return '';
  }
}

function readLocalStorage(storageNamespace: string, key: string) {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(
      buildTrackingStorageKey(storageNamespace, key)
    ) || '';
  } catch {
    return '';
  }
}

function writeLocalStorage(storageNamespace: string, key: string, value: string) {
  if (typeof window === 'undefined' || !value) return;
  try {
    window.localStorage.setItem(
      buildTrackingStorageKey(storageNamespace, key),
      value
    );
  } catch {
    // localStorage puede estar bloqueado; no debe afectar la landing.
  }
}

function pageViewDedupKey(storageNamespace: string, slug: string, externalId: string) {
  return buildTrackingStorageKey(
    storageNamespace,
    `journey_start_sent:${slug}:${externalId}`
  );
}

function wasPageViewRecentlySent(storageNamespace: string, slug: string, externalId: string) {
  if (typeof window === 'undefined' || !slug || !externalId) return false;
  try {
    const key = pageViewDedupKey(storageNamespace, slug, externalId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return false;

    const sentAt = Number(raw);
    if (!Number.isFinite(sentAt)) {
      window.localStorage.removeItem(key);
      return false;
    }

    const isFresh = Date.now() - sentAt < PAGEVIEW_DEDUP_TTL_MS;
    if (!isFresh) window.localStorage.removeItem(key);
    return isFresh;
  } catch {
    return false;
  }
}

function markPageViewSent(storageNamespace: string, slug: string, externalId: string) {
  if (typeof window === 'undefined' || !slug || !externalId) return;
  try {
    window.localStorage.setItem(
      pageViewDedupKey(storageNamespace, slug, externalId),
      String(Date.now())
    );
  } catch {
    // no-op
  }
}

async function waitWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race([
      promise,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => resolve(null), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function sendPageViewBestEffort(body: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/api/journey-start', blob)) return Promise.resolve(true);
    } catch {
      // fetch fallback below
    }
  }

  return fetch('/api/journey-start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).then((response) => response.ok).catch(() => {
    // El PageView interno nunca debe bloquear la experiencia.
    return false;
  });
}

function resolveWorkspaceCurrency(config: LandingConfig) {
  const raw = String(
    config.workspaceCurrency ||
      config.tracking.workspaceCurrency ||
      config.tracking.currency ||
      ''
  )
    .trim()
    .toUpperCase();

  return raw === 'PYG' ? 'PYG' : 'ARS';
}

function isAtrioDestination(config: LandingConfig) {
  return String(config.tracking.ctaDestination || 'whatsapp').toLowerCase() === 'atrio';
}

function asFiniteNumber(value: unknown): number | null {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function extractAssignedGerenciaSnapshot(phoneData: LandingPhoneResponse | null) {
  if (!phoneData || typeof phoneData !== 'object') return {};
  const gerencia = (phoneData.gerencia || {}) as {
    id?: unknown;
    externalId?: unknown;
    external_id?: unknown;
    gerencia_id?: unknown;
    name?: unknown;
    nombre?: unknown;
  };
  const internalId = asFiniteNumber(gerencia.id);
  const externalId = firstNonEmpty(
    gerencia.externalId == null ? undefined : String(gerencia.externalId),
    gerencia.external_id == null ? undefined : String(gerencia.external_id),
    gerencia.gerencia_id == null ? undefined : String(gerencia.gerencia_id),
    internalId == null ? undefined : String(internalId)
  );
  const name = firstNonEmpty(
    gerencia.name == null ? undefined : String(gerencia.name),
    gerencia.nombre == null ? undefined : String(gerencia.nombre)
  );
  const label = name && externalId
    ? `${name} (ID ${externalId})`
    : name || (externalId ? `Gerencia ${externalId}` : '');

  return {
    assigned_gerencia_id:
      internalId && internalId > 0 ? internalId : undefined,
    assigned_gerencia_external_id: externalId || undefined,
    assigned_gerencia_name: name || undefined,
    assigned_gerencia_label: label || undefined
  };
}

export default function LandingPageViewTracker({ slug, config }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageNamespace = buildTrackingStorageNamespace(
      config.tracking.pixelId,
      slug
    );
    const params = getQueryParamsSnapshot();
    const meta = window.__META || {};
    const externalId = firstNonEmpty(
      meta.externalId || '',
      readLocalStorage(storageNamespace, 'external_id'),
      params.get('external_id') || '',
      params.get('eid') || ''
    ) || getOrCreateExternalId(storageNamespace);

    if (!externalId || wasPageViewRecentlySent(storageNamespace, slug, externalId)) {
      return;
    }

    writeLocalStorage(storageNamespace, 'external_id', externalId);
    const fbc = getCookieValue('_fbc');
    const payload = {
      event_name: 'PageView',
      slug,
      landing_id: config.id,
      landing_name: config.name,
      workspace_currency: resolveWorkspaceCurrency(config),
      external_id: externalId,
      event_source_url: safeEventSourceUrl(),
      utm_campaign: params.get('utm_campaign') || '',
      fbp: getCookieValue('_fbp'),
      fbc,
      from_meta_ads: Boolean(fbc || params.get('fbclid')),
      meta_pixel_id: String(config.tracking.pixelId || '').trim() || undefined,
      device_type: getDeviceType(),
      client_user_agent: navigator.userAgent || undefined
    };

    void sendPageViewBestEffort(JSON.stringify(payload))
      .then(async (sent) => {
        if (sent) markPageViewSent(storageNamespace, slug, externalId);
        if (isAtrioDestination(config)) return;

        const phoneData = await waitWithTimeout(
          getLandingPhone(slug).catch(() => null),
          1500
        );
        if (!phoneData?.phone) return;

        const assignedPhone = normalizeLandingPhone(
          phoneData.phone,
          config.tracking.phoneCountryCode || '54'
        );
        const enrichedSent = await sendPageViewBestEffort(JSON.stringify({
          ...payload,
          telefono_asignado: assignedPhone || undefined,
          ...extractAssignedGerenciaSnapshot(phoneData)
        }));
        if (enrichedSent) markPageViewSent(storageNamespace, slug, externalId);
      })
      .catch(() => {
        // El PageView interno nunca debe afectar la experiencia.
      });
  }, [
    slug,
    config.id,
    config.name,
    config.workspaceCurrency,
    config.tracking.pixelId,
    config.tracking.workspaceCurrency,
    config.tracking.currency
  ]);

  return null;
}
