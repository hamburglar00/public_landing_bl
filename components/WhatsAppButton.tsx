'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getLandingPhone } from '@/lib/landing/getLandingPhone';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
  templateVariant?: 'default' | 'template1' | 'template2';
};

type FbqFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
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

function getQueryParam(name: string) {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

function getDeviceType() {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return 'tablet';
  if (/mobi|iphone|android/.test(ua)) return 'mobile';
  return 'desktop';
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!value) return '';
  const [, cookieValue] = value.split('=');
  return decodeURIComponent(cookieValue || '');
}

function getFbp() {
  if (typeof window === 'undefined') return '';

  try {
    const fromCookie = getCookie('_fbp');
    if (fromCookie) return fromCookie;
    return '';
  } catch {
    return '';
  }
}

function getFbc() {
  if (typeof window === 'undefined') return '';

  try {
    const fromCookie = getCookie('_fbc');
    if (fromCookie) return fromCookie;

    const stored = window.localStorage.getItem('_fbc');
    if (stored) return stored;

    const fbclid = getQueryParam('fbclid');
    if (!fbclid) return '';

    const ts = Date.now();
    const generated = `fb.1.${ts}.${fbclid}`;

    window.localStorage.setItem('_fbc', generated);
    if (typeof document !== 'undefined') {
      document.cookie = `_fbc=${encodeURIComponent(generated)}; path=/; max-age=63072000`;
    }

    return generated;
  } catch {
    return '';
  }
}

function normalizePhone(raw: string) {
  let value = String(raw || '').replace(/\D+/g, '');
  if (value.length === 10) value = `54${value}`;
  return value;
}

function generatePromoCode(tag: string) {
  const random = Math.random().toString(16).slice(2, 14);
  return `${tag}-${random}`;
}

function buildMessage(promoCode: string) {
  return `Hola! Vi este anuncio, me pasás info? ${promoCode}`.trim();
}

function getOrCreateExternalId() {
  if (typeof window === 'undefined') return '';

  const existing = window.localStorage.getItem('external_id');
  if (existing) return existing;

  const created = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem('external_id', created);
  return created;
}

function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function readMeta() {
  if (typeof window === 'undefined') return {};
  return window.__META || {};
}

function getLocalStorageValue(key: string) {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function resolveIdentity() {
  const meta = readMeta();

  const emailResolved = firstNonEmpty(
    getQueryParam('email'),
    getQueryParam('em'),
    getLocalStorageValue('em'),
    meta.userEmail || ''
  );

  const phoneResolved = firstNonEmpty(
    getQueryParam('phone'),
    getQueryParam('ph'),
    getLocalStorageValue('ph'),
    meta.userPhone || ''
  );

  const fnResolved = firstNonEmpty(getQueryParam('fn'), meta.userFn || '');
  const lnResolved = firstNonEmpty(getQueryParam('ln'), meta.userLn || '');

  const externalIdResolved = firstNonEmpty(
    meta.externalId || '',
    getLocalStorageValue('external_id')
  );

  const externalId = externalIdResolved || getOrCreateExternalId();
  const email = emailResolved ? normalizeEmail(emailResolved) : '';
  const ph = phoneResolved ? normalizePhone(phoneResolved) : '';

  return {
    emailRaw: emailResolved,
    phoneRaw: phoneResolved,
    email,
    ph,
    fn: fnResolved,
    ln: lnResolved,
    externalId
  };
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

export default function WhatsAppButton({ slug, config, templateVariant = 'default' }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const phonePromiseRef = useRef<Promise<Awaited<ReturnType<typeof getLandingPhone>> | null> | null>(null);

  // Asegura una única llamada a getLandingPhone por slug y la reutiliza entre prewarm y click
  function ensurePhonePromise() {
    if (!phonePromiseRef.current) {
      phonePromiseRef.current = getLandingPhone(slug)
        .then((data) => data)
        .catch(() => null);
    }
    return phonePromiseRef.current;
  }

  // Prewarm del teléfono apenas carga el botón / landing
  useEffect(() => {
    let cancelled = false;

    const prewarmWithRetry = async () => {
      const delays = [0, 400, 1200];
      for (let i = 0; i < delays.length; i += 1) {
        if (cancelled) return;
        if (delays[i] > 0) {
          await new Promise((resolve) => setTimeout(resolve, delays[i]));
          if (cancelled) return;
        }
        const data = await ensurePhonePromise();
        if (data?.phone) return;
        // Forzamos un nuevo intento real en lugar de reutilizar la promesa fallida.
        phonePromiseRef.current = null;
      }
    };

    phonePromiseRef.current = null;
    void prewarmWithRetry();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const ctaText = useMemo(() => config.content.ctaText || '¡Contactar ya!', [config]);

  function extractPhoneId(
    phoneData: Awaited<ReturnType<typeof getLandingPhone>> | null
  ): number | null {
    if (!phoneData) return null;
    if (typeof phoneData.phoneId === 'number') return phoneData.phoneId;
    const maybeId = (phoneData as { id?: unknown }).id;
    return typeof maybeId === 'number' ? maybeId : null;
  }

  async function handleClick() {
    if (isLoading || isDisabled) return;

    setIsLoading(true);
    const tapStartedAt = Date.now();

    try {
      const promoCode = generatePromoCode(config.tracking.landingTag || 'LP');
      const message = buildMessage(promoCode);
      const eventId = crypto?.randomUUID?.() || `${Date.now()}`;
      const identity = resolveIdentity();
      const externalId = identity.externalId;
      const emailRaw = identity.emailRaw;
      const email = identity.email;
      const phoneRaw = identity.phoneRaw;
      const ph = identity.ph;
      const fbp = getFbp();
      const fbc = getFbc();
      const utmCampaign = getQueryParam('utm_campaign');

      // Pixel Contact con eventID y parámetros (igual que landing vieja)
      try {
        if (typeof window !== 'undefined' && window.fbq) {
          const contactData: Record<string, unknown> = {
            source: 'main_button',
            external_id: externalId
          };

          if (email) {
            contactData.em = email;
          }
          if (ph) {
            contactData.ph = ph;
          }
          if (identity.fn) {
            contactData.fn = identity.fn;
          }
          if (identity.ln) {
            contactData.ln = identity.ln;
          }
          if (fbp) {
            contactData.fbp = fbp;
          }
          if (fbc) {
            contactData.fbc = fbc;
          }

          window.fbq(
            'track',
            'Contact',
            contactData,
            { eventID: eventId }
          );
        }
      } catch {
        // Ignorar errores de pixel para no afectar la UX
      }

      // Usa el número pre-cargado; si viene lento, hace un reintento corto.
      let phoneData = await waitWithTimeout(ensurePhonePromise(), 1500);
      if (!phoneData?.phone) {
        phonePromiseRef.current = null;
        phoneData = await waitWithTimeout(ensurePhonePromise(), 2500);
      }
      const effectivePhoneMode =
        phoneData?.phoneMode ?? phoneData?.phoneSelection?.mode ?? '';

      const phone = normalizePhone(phoneData?.phone || '');

      if (!phone) {
        setIsDisabled(true);
        return;
      }

      // Aviso de teléfono usado al servicio phone-click (no bloquea redirect)
      // Solo cuando el número se asignó en modo equitativo (según respuesta de landing-phone)
      if (effectivePhoneMode === 'fair') {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          const phoneId = extractPhoneId(phoneData);

          if (baseUrl && anonKey && phoneId != null) {
            const notifyUrl = `${baseUrl.replace(/\/+$/, '')}/functions/v1/phone-click`;
            const notifyBody = JSON.stringify({
              landingName: phoneData?.landingName || config.name,
              phoneId,
              phone
            });

            void fetch(notifyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: anonKey,
                Authorization: `Bearer ${anonKey}`
              },
              body: notifyBody,
              keepalive: true
            }).catch(() => {
              // Ignorar errores, no deben afectar la UX
            });
          }
        } catch {
          // Cualquier error en phone-click se ignora para no afectar al usuario
        }
      }

      const payload = {
        event_name: 'Contact',
        event_id: eventId,
        external_id: externalId,
        event_source_url: window.location.href,
        email: emailRaw,
        phone: phoneRaw,
        utm_campaign: utmCampaign,
        fbp,
        fbc,
        telefono_asignado: phone,
        promo_code: promoCode,
        source: 'main_button',
        brand: config.name,
        landing_id: config.id,
        landing_name: config.name,
        device_type: getDeviceType(),
        cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
        mode: config.background.mode,
        api_meta: null
      };

      try {
        const body = JSON.stringify({
          postUrl: config.tracking.postUrl,
          payload
        });

        if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon('/api/track', blob);
        } else {
          void fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true
          }).catch(() => {
            // Ignorar errores de tracking
          });
        }
      } catch {
        // El tracking nunca debe bloquear el redirect
      }

      await new Promise((resolve) => setTimeout(resolve, 180));
      window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    } finally {
      setIsLoading(false);
    }
  }

  const ctaStyle = {
    color: config.colors.ctaText,
    background: config.colors.ctaBackground,
    fontSize: `${config.typography.cta.sizePx}px`,
    fontWeight: config.typography.cta.weight
  };

  if (templateVariant === 'template1' || templateVariant === 'template2') {
    return (
      <a
        href="#"
        className="cta"
        aria-label="Enviar WhatsApp"
        onClick={(e) => {
          e.preventDefault();
          void handleClick();
        }}
        style={{
          ...ctaStyle,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1), 0 10px 24px rgba(0,0,0,.26)',
          pointerEvents: isLoading || isDisabled ? 'none' : undefined,
          opacity: isLoading || isDisabled ? 0.75 : undefined
        }}
      >
        <span className="cta__fill">
          {isDisabled ? 'Sin número disponible' : isLoading ? 'Abriendo...' : ctaText}
        </span>
        <img
          src="/imagenes/whatsapp.png"
          alt="WhatsApp"
          className="cta__icon"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <button
      type="button"
      className="whatsapp-button"
      onClick={() => void handleClick()}
      disabled={isLoading || isDisabled}
      style={{
        ...ctaStyle,
        boxShadow: `0 0 30px 8px ${config.colors.ctaGlow}`
      }}
      aria-label="Crear usuario por WhatsApp"
    >
      <span>{isDisabled ? 'Sin número disponible' : isLoading ? 'Abriendo...' : ctaText}</span>
      <img
        src="/imagenes/whatsapp.png"
        alt=""
        className="whatsapp-icon"
        aria-hidden="true"
      />
    </button>
  );
}
