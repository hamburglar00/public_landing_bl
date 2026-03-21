'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getLandingPhone } from '@/lib/landing/getLandingPhone';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
  templateVariant?: 'default' | 'template1' | 'template2';
};

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

    const stored = window.localStorage.getItem('_fbp');
    if (stored) return stored;

    const ts = Date.now();
    const rand = Math.floor(Math.random() * 10_000_000_000);
    const generated = `fb.1.${ts}.${rand}`;

    window.localStorage.setItem('_fbp', generated);
    if (typeof document !== 'undefined') {
      document.cookie = `_fbp=${encodeURIComponent(generated)}; path=/; max-age=63072000`;
    }

    return generated;
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
    phonePromiseRef.current = null;
    void ensurePhonePromise();
  }, [slug]);

  const ctaText = useMemo(() => config.content.ctaText || '¡Contactar ya!', [config]);

  async function handleClick() {
    if (isLoading || isDisabled) return;

    setIsLoading(true);

    try {
      const promoCode = generatePromoCode(config.tracking.landingTag || 'LP');
      const message = buildMessage(promoCode);
      const eventId = crypto?.randomUUID?.() || `${Date.now()}`;
      const externalId = getOrCreateExternalId();
      const emailRaw = getQueryParam('email');
      const email = emailRaw ? emailRaw.trim().toLowerCase() : '';
      const phoneRaw = getQueryParam('phone');
      const ph = phoneRaw ? normalizePhone(phoneRaw) : '';
      const fbp = getFbp();
      const fbc = getFbc();
      const fbclid = getQueryParam('fbclid');

      // Pixel Contact con eventID y parámetros (igual que landing vieja)
      try {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          const contactData: Record<string, unknown> = {
            content_name: 'Botón WhatsApp',
            content_category: 'LeadGen',
            event_source: 'LandingPage',
            source: 'main_button',
            event_id: eventId,
            external_id: externalId,
            fbp,
            fbc,
            fbclid,
            fbclic: fbclid
          };

          if (email) {
            contactData.em = email;
          }
          if (ph) {
            contactData.ph = ph;
          }

          (window as any).fbq(
            'track',
            'Contact',
            contactData,
            { eventID: eventId }
          );
        }
      } catch {
        // Ignorar errores de pixel para no afectar la UX
      }

      // Usa el número pre-cargado; si aún no se pidió, lo solicita ahora
      const phoneData = await ensurePhonePromise();
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
          const phoneId = (phoneData as any)?.phoneId ?? (phoneData as any)?.id;

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
        external_id: getOrCreateExternalId(),
        event_source_url: window.location.href,
        email: getQueryParam('email'),
        phone: getQueryParam('phone'),
        utm_campaign: getQueryParam('utm_campaign'),
        fbp: getFbp(),
        fbc: getFbc(),
        telefono_asignado: phone,
        promo_code: promoCode,
        source: 'main_button',
        brand: config.name,
        landing_id: config.id,
        landing_name: config.name,
        device_type: getDeviceType(),
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
