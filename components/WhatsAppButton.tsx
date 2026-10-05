'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getLandingPhone } from '@/lib/landing/getLandingPhone';
import type { LandingConfig } from '@/lib/landing/types';
import { validInlineEmail } from '@/lib/tracking/inlineEmail';
import {
  buildTrackingStorageKey,
  buildTrackingStorageNamespace
} from '@/lib/tracking/clientStorage';
import {
  firstNonEmpty,
  getOrCreateExternalId,
  normalizeEmail,
  normalizeLandingPhone
} from '@/lib/tracking/identity';
import {
  collectMetaClientIpProof,
  getCachedMetaClientIpProof
} from '@/lib/tracking/metaIpCollector';

type Props = {
  slug: string;
  config: LandingConfig;
  templateVariant?:
    | 'default'
    | 'template1'
    | 'template2'
    | 'template3'
    | 'template4'
    | 'template5';
  autoStart?: boolean;
  hideButton?: boolean;
  externalTriggerEvent?: string;
};

type FbqFn = (command: string, ...args: unknown[]) => void;
type MetaParamBuilderModule = typeof import('meta-capi-param-builder-clientjs');
type MetaTrackingParams = {
  fbc: string;
  fbp: string;
  clientIpAddress: string;
  clientIpIssuedAt: number | null;
  clientIpProof: string;
};
type LeadCaptureValues = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};
type PreparedClickContext = {
  promoCode: string;
  message: string;
  eventId: string;
  sendContactPixel: boolean;
  identity: ReturnType<typeof resolveIdentity>;
  externalId: string;
  emailRaw: string;
  phoneRaw: string;
  utmCampaign: string;
  testEventCode: string;
  deviceType: string;
};
let metaParamBuilderModule: MetaParamBuilderModule | null = null;

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

function generatePromoCode(tag: string) {
  const random = Math.random().toString(16).slice(2, 14);
  return `${tag}-${random}`;
}

function buildMessage(promoCode: string, whatsappPrefillText?: string) {
  const baseMessage = `Hola! quiero mas informacion por favor! ${promoCode}\nMi nombre es:`.trim();
  const extraText = String(whatsappPrefillText || '').trim();
  return extraText ? `${baseMessage}\n\n${extraText}` : baseMessage;
}

function isAtrioDestination(config: LandingConfig) {
  return String(config.tracking.ctaDestination || 'whatsapp').toLowerCase() === 'atrio';
}

function buildAtrioRedirectUrl(
  rawUrl: string | undefined,
  promoCode: string,
  atrioId?: string
) {
  try {
    const value = String(rawUrl || '').trim();
    if (!value) return '';
    const url = new URL(value, typeof window !== 'undefined' ? window.location.href : undefined);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    url.searchParams.set('promo_code', promoCode);
    if (atrioId) url.searchParams.set('atrio_id', atrioId);
    return url.toString();
  } catch {
    return '';
  }
}

const WHATSAPP_GREEN_PATH =
  "M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Z";
const WHATSAPP_WHITE_PATH =
  "M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Zm0 23.58a10.66 10.66 0 0 1-5.43-1.49l-.39-.23-4.58 1.2 1.22-4.46-.25-.4a10.68 10.68 0 1 1 9.43 5.38Zm5.85-7.99c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.06-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z";

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#25D366" d={WHATSAPP_GREEN_PATH} />
      <path fill="#FFFFFF" d={WHATSAPP_WHITE_PATH} />
    </svg>
  );
}

function readMeta() {
  if (typeof window === 'undefined') return {};
  return window.__META || {};
}

function getLocalStorageValue(storageNamespace: string, key: string) {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(
      buildTrackingStorageKey(storageNamespace, key)
    ) || '';
  } catch {
    return '';
  }
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

const CONTACT_DEDUP_TTL_MS = 5 * 60 * 1000;

function getContactDedupKey(
  storageNamespace: string,
  slug: string,
  externalId: string
) {
  return buildTrackingStorageKey(
    storageNamespace,
    `contact_sent:${slug}:${externalId}`
  );
}

function wasContactRecentlySent(
  storageNamespace: string,
  slug: string,
  externalId: string
) {
  if (typeof window === 'undefined') return false;
  if (!slug || !externalId) return false;

  try {
    const key = getContactDedupKey(storageNamespace, slug, externalId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return false;

    const sentAt = Number(raw);
    if (!Number.isFinite(sentAt)) {
      window.localStorage.removeItem(key);
      return false;
    }

    const isFresh = Date.now() - sentAt < CONTACT_DEDUP_TTL_MS;
    if (!isFresh) {
      window.localStorage.removeItem(key);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function markContactSent(
  storageNamespace: string,
  slug: string,
  externalId: string
) {
  if (typeof window === 'undefined') return;
  if (!slug || !externalId) return;

  try {
    const key = getContactDedupKey(storageNamespace, slug, externalId);
    window.localStorage.setItem(key, String(Date.now()));
  } catch {
    // Ignorar errores de storage
  }
}

function resolveIdentity(
  storageNamespace: string,
  phoneCountryCode: string,
  params: URLSearchParams = getQueryParamsSnapshot()
) {
  const meta = readMeta();
  const getParam = (name: string) => params.get(name) || '';

  const emailResolved = firstNonEmpty(
    getParam('email'),
    getParam('em'),
    getLocalStorageValue(storageNamespace, 'em'),
    meta.userEmail || ''
  );

  const phoneResolved = firstNonEmpty(
    getParam('phone'),
    getParam('ph'),
    getLocalStorageValue(storageNamespace, 'ph'),
    meta.userPhone || ''
  );

  const cityResolved = firstNonEmpty(
    getParam('ct'),
    getLocalStorageValue(storageNamespace, 'ct')
  );
  const stateResolved = firstNonEmpty(
    getParam('st'),
    getLocalStorageValue(storageNamespace, 'st')
  );
  const zipResolved = firstNonEmpty(
    getParam('zip'),
    getLocalStorageValue(storageNamespace, 'zip')
  );
  const countryResolved = firstNonEmpty(
    getParam('country'),
    getLocalStorageValue(storageNamespace, 'country')
  );

  const fnResolved = firstNonEmpty(getParam('fn'), meta.userFn || '');
  const lnResolved = firstNonEmpty(getParam('ln'), meta.userLn || '');

  const externalIdResolved = firstNonEmpty(
    meta.externalId || '',
    getLocalStorageValue(storageNamespace, 'external_id'),
    getParam('external_id'),
    getParam('eid')
  );

  const externalId =
    externalIdResolved || getOrCreateExternalId(storageNamespace);
  const email = emailResolved ? normalizeEmail(emailResolved) : '';
  const ph = phoneResolved
    ? normalizeLandingPhone(phoneResolved, phoneCountryCode)
    : '';

  return {
    emailRaw: emailResolved,
    phoneRaw: phoneResolved,
    ct: cityResolved,
    st: stateResolved,
    zip: zipResolved,
    country: countryResolved,
    email,
    ph,
    fn: fnResolved,
    ln: lnResolved,
    externalId
  };
}

function applyLeadCaptureToIdentity(
  identity: ReturnType<typeof resolveIdentity>,
  capture: LeadCaptureValues | null | undefined,
  phoneCountryCode: string
) {
  if (!capture) return identity;

  const emailRaw = String(capture.email || '').trim();
  const phoneRaw = String(capture.phone || '').trim();
  const firstName = String(capture.firstName || '').trim();
  const lastName = String(capture.lastName || '').trim();

  return {
    ...identity,
    emailRaw: emailRaw || identity.emailRaw,
    phoneRaw: phoneRaw || identity.phoneRaw,
    email: emailRaw ? normalizeEmail(emailRaw) : identity.email,
    ph: phoneRaw ? normalizeLandingPhone(phoneRaw, phoneCountryCode) : identity.ph,
    fn: firstName || identity.fn,
    ln: lastName || identity.ln
  };
}

function getSafeEventSourceUrl() {
  if (typeof window === 'undefined') return '';
  try {
    return `${window.location.origin}${window.location.pathname}`;
  } catch {
    return '';
  }
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

function sanitizeSensitiveQueryParams() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const sensitiveKeys = [
      'email',
      'em',
      'phone',
      'ph',
      'fn',
      'ln',
      'external_id',
      'eid',
      'ct',
      'st',
      'zip',
      'country'
    ];
    let changed = false;

    for (const key of sensitiveKeys) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }

    if (changed) {
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  } catch {
    // La limpieza de la URL nunca debe afectar la experiencia.
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

async function sendTrackBestEffort(body: string) {
  const fetchFallback = () =>
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    });

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon('/api/track', blob);
      if (queued) return;
    } catch {
      // Ignorar y seguir con fetch fallback
    }
  }

  await fetchFallback();
}

async function collectMetaTrackingParams() {
  if (typeof window === 'undefined') {
    return {
      fbc: '',
      fbp: '',
      clientIpAddress: '',
      clientIpIssuedAt: null,
      clientIpProof: ''
    };
  }

  const cachedIpProof = getCachedMetaClientIpProof();
  try {
    const sdk = await loadMetaParamBuilder();
    await waitWithTimeout(
      sdk.processAndCollectAllParams(
        window.location.href,
        async () => cachedIpProof.clientIpAddress
      ),
      400
    );
  } catch {
    try {
      const sdk = await loadMetaParamBuilder();
      sdk.processAndCollectParams(window.location.href);
    } catch {
      // Ignorar errores de la libreria para no afectar la UX
    }
  }

  try {
    const sdk = await loadMetaParamBuilder();
    const latestIpProof = getCachedMetaClientIpProof();
    return {
      fbc: sdk.getFbc() || getCookieValue('_fbc'),
      fbp: sdk.getFbp() || getCookieValue('_fbp'),
      clientIpAddress: latestIpProof.clientIpAddress || sdk.getClientIpAddress() || '',
      clientIpIssuedAt: latestIpProof.clientIpIssuedAt,
      clientIpProof: latestIpProof.clientIpProof
    };
  } catch {
    const latestIpProof = getCachedMetaClientIpProof();
    return {
      fbc: getCookieValue('_fbc'),
      fbp: getCookieValue('_fbp'),
      ...latestIpProof
    };
  }
}

async function loadMetaParamBuilder(): Promise<MetaParamBuilderModule> {
  if (metaParamBuilderModule) return metaParamBuilderModule;
  const sdk = await import('meta-capi-param-builder-clientjs');
  metaParamBuilderModule = sdk;
  return sdk;
}

export default function WhatsAppButton({
  slug,
  config,
  templateVariant = 'default',
  autoStart = false,
  hideButton = false,
  externalTriggerEvent
}: Props) {
  const storageNamespace = buildTrackingStorageNamespace(
    config.tracking.pixelId,
    slug
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);
  const [leadCaptureForm, setLeadCaptureForm] = useState<LeadCaptureValues>({});
  const phonePromiseRef = useRef<Promise<Awaited<ReturnType<typeof getLandingPhone>> | null> | null>(null);
  const metaTrackingRef = useRef<MetaTrackingParams>({
    fbc: '',
    fbp: '',
    clientIpAddress: '',
    clientIpIssuedAt: null,
    clientIpProof: ''
  });
  const metaTrackingPromiseRef = useRef<Promise<MetaTrackingParams> | null>(null);
  const preparedClickRef = useRef<PreparedClickContext | null>(null);
  const clickLockRef = useRef(false);
  const noPhoneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStartOnceRef = useRef(false);
  const handleClickRef = useRef<(leadCaptureValues?: LeadCaptureValues | null) => Promise<void>>(async () => {});

  // Asegura una única llamada a getLandingPhone por slug y la reutiliza entre prewarm y click
  function ensurePhonePromise() {
    if (isAtrioDestination(config)) return Promise.resolve(null);
    if (!phonePromiseRef.current) {
      phonePromiseRef.current = getLandingPhone(slug)
        .then((data) => data)
        .catch(() => null);
    }
    return phonePromiseRef.current;
  }

  function createPreparedClickContext(): PreparedClickContext {
    const params = getQueryParamsSnapshot();
    const promoCode = generatePromoCode(config.tracking.landingTag || 'LP');
    const whatsappPrefillText =
      config.interactions?.enabled && config.interactions.whatsappPrefillText
        ? config.interactions.whatsappPrefillText
        : '';
    const identity = resolveIdentity(
      storageNamespace,
      config.tracking.phoneCountryCode || '54',
      params
    );
    const utmCampaign = params.get('utm_campaign') || '';
    const testEventCode = params.get('test_event_code') || '';
    sanitizeSensitiveQueryParams();

    return {
      promoCode,
      message: buildMessage(promoCode, whatsappPrefillText),
      eventId: crypto?.randomUUID?.() || `${Date.now()}`,
      sendContactPixel: config.tracking.sendContactPixel !== false,
      identity,
      externalId: identity.externalId,
      emailRaw: identity.emailRaw,
      phoneRaw: identity.phoneRaw,
      utmCampaign,
      testEventCode,
      deviceType: getDeviceType()
    };
  }

  function ensurePreparedClickContext() {
    if (!preparedClickRef.current) {
      preparedClickRef.current = createPreparedClickContext();
    }
    return preparedClickRef.current;
  }

  function collectMetaTrackingParamsOnce() {
    if (!metaTrackingPromiseRef.current) {
      metaTrackingPromiseRef.current = collectMetaTrackingParams()
        .then((value) => {
          metaTrackingRef.current = value;
          return value;
        })
        .finally(() => {
          metaTrackingPromiseRef.current = null;
        });
    }
    return metaTrackingPromiseRef.current;
  }

  // Prewarm del teléfono apenas carga el botón / landing
  useEffect(() => {
    let cancelled = false;

    if (isAtrioDestination(config)) {
      phonePromiseRef.current = null;
      return () => {
        cancelled = true;
      };
    }

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
      if (noPhoneTimeoutRef.current) {
        clearTimeout(noPhoneTimeoutRef.current);
        noPhoneTimeoutRef.current = null;
      }
    };
  }, [slug, config.tracking.ctaDestination]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    preparedClickRef.current = createPreparedClickContext();
    const refreshId = window.setTimeout(() => {
      preparedClickRef.current = createPreparedClickContext();
    }, 300);

    return () => window.clearTimeout(refreshId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    slug,
    config.tracking.pixelId,
    config.tracking.phoneCountryCode,
    config.tracking.landingTag,
    config.tracking.sendContactPixel,
    config.tracking.ctaDestination,
    config.tracking.atrioRedirectUrl,
    config.tracking.atrioClientId,
    config.tracking.atrioId,
    config.tracking.atrioSlug,
    config.interactions?.enabled,
    config.interactions?.whatsappPrefillText
  ]);

  // Inicializa _fbc/_fbp y parametros del SDK oficial de Meta en cuanto carga la landing.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | null = null;
    let fallbackTimerId: number | null = null;

    const collectIpInBackground = () => {
      void collectMetaClientIpProof().then(async (ipProof) => {
        if (cancelled || !ipProof.clientIpAddress) return;
        try {
          const sdk = await loadMetaParamBuilder();
          await sdk.processAndCollectAllParams(
            window.location.href,
            async () => ipProof.clientIpAddress
          );
          if (cancelled) return;
          metaTrackingRef.current = {
            fbc: sdk.getFbc() || metaTrackingRef.current.fbc || getCookieValue('_fbc'),
            fbp: sdk.getFbp() || metaTrackingRef.current.fbp || getCookieValue('_fbp'),
            ...ipProof
          };
        } catch {
          if (!cancelled) {
            metaTrackingRef.current = {
              ...metaTrackingRef.current,
              ...ipProof
            };
          }
        }
      });
    };

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(collectIpInBackground, { timeout: 800 });
    } else {
      fallbackTimerId = window.setTimeout(collectIpInBackground, 0);
    }

    const runWithRetries = async () => {
      const delays = [0, 300, 1200, 3000];
      for (const delay of delays) {
        if (cancelled) return;
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          if (cancelled) return;
        }
        const value = await collectMetaTrackingParamsOnce();
        if (cancelled) return;
        metaTrackingRef.current = value;
        if (value.fbp && value.fbc) return;
      }
    };

    void runWithRetries();
    return () => {
      cancelled = true;
      if (idleId !== null) idleWindow.cancelIdleCallback?.(idleId);
      if (fallbackTimerId !== null) window.clearTimeout(fallbackTimerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Permite reutilizar toda la lógica de tracking/redirect para flujos automáticos (template 3).
  useEffect(() => {
    if (!autoStart || autoStartOnceRef.current) return;
    autoStartOnceRef.current = true;
    void handleClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const ctaText = useMemo(() => config.content?.ctaText || '¡Contactar ya!', [config.content?.ctaText]);

  const template4CtaText =
    templateVariant === 'template4' && (!ctaText.trim() || ctaText === 'Acceder')
      ? 'ABRIR WHATSAPP'
      : ctaText;

  function extractPhoneId(
    phoneData: Awaited<ReturnType<typeof getLandingPhone>> | null
  ): number | null {
    if (!phoneData) return null;
    if (typeof phoneData.phoneId === 'number') return phoneData.phoneId;
    const maybeId = (phoneData as { id?: unknown }).id;
    return typeof maybeId === 'number' ? maybeId : null;
  }

  const leadCaptureFields = config.leadCapture?.fields ?? {};
  const leadCaptureEnabled =
    config.leadCapture?.enabled === true &&
    !autoStart &&
    (leadCaptureFields.firstName === true ||
      leadCaptureFields.lastName === true ||
      leadCaptureFields.phone === true ||
      leadCaptureFields.email === true);

  function readInlineEmail() {
    if (config.emailCapture?.enabled !== true || typeof document === 'undefined') return '';
    const input = document.querySelector<HTMLInputElement>('[data-inline-email-input]');
    if (!input) return '';
    const value = input.value.trim();
    const validEmail = validInlineEmail(value);
    const error = document.querySelector<HTMLElement>('[data-inline-email-error]');
    if (error) error.textContent = value && !validEmail
      ? 'Email inválido. Podés seguir a WhatsApp.' : '';
    return validEmail;
  }

  function closeLeadCaptureModal() {
    setLeadCaptureOpen(false);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('public-lead-capture-open');
    }
  }

  function continueFromLeadCapture(capture: LeadCaptureValues | null) {
    closeLeadCaptureModal();
    void handleClick(capture);
  }

  function handlePrimaryClick() {
    if (leadCaptureEnabled && !clickLockRef.current && !isLoading && !isDisabled) {
      const inlineEmail = readInlineEmail();
      if (leadCaptureFields.email === true && config.emailCapture?.enabled === true) {
        setLeadCaptureForm((prev) => ({ ...prev, email: inlineEmail }));
      }
      setLeadCaptureOpen(true);
      return;
    }
    void handleClick();
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (leadCaptureOpen) {
      document.body.classList.add('public-lead-capture-open');
    } else {
      document.body.classList.remove('public-lead-capture-open');
    }
    return () => document.body.classList.remove('public-lead-capture-open');
  }, [leadCaptureOpen]);

  async function handleClick(leadCaptureValues?: LeadCaptureValues | null) {
    if (clickLockRef.current || isLoading || isDisabled) return;

    clickLockRef.current = true;
    setIsLoading(true);
    const tapStartedAt = Date.now();

    try {
      // Permite un paint rápido del estado "Abriendo..." antes del trabajo de click.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const prepared = ensurePreparedClickContext();
      const {
        promoCode,
        message,
        eventId,
        sendContactPixel,
        identity,
        externalId,
        utmCampaign,
        testEventCode,
        deviceType
      } = prepared;
      const inlineEmail = readInlineEmail();
      const safeCaptureValues = leadCaptureValues && config.emailCapture?.enabled === true
        ? { ...leadCaptureValues, email: validInlineEmail(String(leadCaptureValues.email || '')) }
        : leadCaptureValues;
      const enrichedIdentity = applyLeadCaptureToIdentity(
        inlineEmail ? { ...identity, emailRaw: inlineEmail, email: normalizeEmail(inlineEmail) } : identity,
        safeCaptureValues,
        config.tracking.phoneCountryCode || '54'
      );
      const emailRaw = enrichedIdentity.emailRaw;
      const phoneRaw = enrichedIdentity.phoneRaw;
      const captureFields = config.leadCapture?.fields ?? {};
      const hasLeadCaptureForm = Boolean(leadCaptureValues);
      const formFn =
        hasLeadCaptureForm && captureFields.firstName
          ? String(leadCaptureValues?.firstName || '').trim()
          : '';
      const formLn =
        hasLeadCaptureForm && captureFields.lastName
          ? String(leadCaptureValues?.lastName || '').trim()
          : '';
      const formEmail =
        hasLeadCaptureForm && captureFields.email
          ? normalizeEmail(safeCaptureValues?.email || '')
          : '';
      const formPhoneRaw =
        hasLeadCaptureForm && captureFields.phone
          ? String(leadCaptureValues?.phone || '').trim()
          : '';
      const formPhone = formPhoneRaw
        ? normalizeLandingPhone(formPhoneRaw, config.tracking.phoneCountryCode || '54')
        : '';
      let metaTracking = metaTrackingRef.current;
      if (!metaTracking.fbp || !metaTracking.fbc) {
        metaTracking = await collectMetaTrackingParamsOnce();
      } else {
        void collectMetaTrackingParamsOnce().then((value) => {
          metaTrackingRef.current = value;
        });
      }
      const fbp = metaTracking.fbp;
      const fbc = metaTracking.fbc;
      const clientIpAddress = metaTracking.clientIpAddress;
      const clientIpIssuedAt = metaTracking.clientIpIssuedAt;
      const clientIpProof = metaTracking.clientIpProof;
      const shouldSkipContact = testEventCode
        ? false
        : wasContactRecentlySent(storageNamespace, slug, externalId);
      const atrioMode = isAtrioDestination(config);

      // Usa el número pre-cargado; si viene lento, hace un reintento corto.
      let phoneData = atrioMode ? null : await waitWithTimeout(ensurePhonePromise(), 1500);
      if (!atrioMode && !phoneData?.phone) {
        phonePromiseRef.current = null;
        phoneData = await waitWithTimeout(ensurePhonePromise(), 2500);
      }
      const effectivePhoneMode =
        phoneData?.phoneMode ?? phoneData?.phoneSelection?.mode ?? '';

      const phone = atrioMode ? '' : normalizeLandingPhone(
        phoneData?.phone || '',
        config.tracking.phoneCountryCode || '54'
      );
      const redirectUrl = atrioMode
        ? buildAtrioRedirectUrl(
          config.tracking.atrioRedirectUrl,
          promoCode,
          config.tracking.atrioId
        )
        : `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      const workspaceCurrency = resolveWorkspaceCurrency(config);

      if ((!atrioMode && !phone) || (atrioMode && !redirectUrl)) {
        setIsDisabled(true);
        if (noPhoneTimeoutRef.current) {
          clearTimeout(noPhoneTimeoutRef.current);
        }
        noPhoneTimeoutRef.current = setTimeout(() => {
          setIsDisabled(false);
          noPhoneTimeoutRef.current = null;
        }, 2000);
        clickLockRef.current = false;
        return;
      }

      // Pixel Contact con eventID y parámetros, solo cuando hay teléfono válido.
      try {
        if (
          sendContactPixel &&
          !shouldSkipContact &&
          typeof window !== 'undefined' &&
          window.fbq
        ) {
          window.fbq(
            'track',
            'Contact',
            { source: 'main_button' },
            { eventID: eventId }
          );
        }
      } catch {
        // Ignorar errores de pixel para no afectar la UX
      }

      // Aviso de teléfono usado al servicio phone-click (no bloquea redirect)
      // Se envía para los modos de asignación soportados.
      if (!atrioMode && (effectivePhoneMode === 'fair' || effectivePhoneMode === 'random')) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          const phoneId = extractPhoneId(phoneData);

          if (baseUrl && anonKey && phoneId != null) {
            const notifyUrl = `${baseUrl.replace(/\/+$/, '')}/functions/v1/phone-click`;
            const notifyBody = JSON.stringify({
              landingName: phoneData?.landingName || config.name,
              phoneId,
              phone,
              reservationId: phoneData?.assignmentReservationId || undefined
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
        meta_pixel_id: String(config.tracking.pixelId || '').trim() || undefined,
        sendContactPixel,
        event_id: eventId,
        external_id: externalId,
        event_source_url: getSafeEventSourceUrl(),
        email: emailRaw,
        phone: enrichedIdentity.ph || phoneRaw,
        phone_country_code: config.tracking.phoneCountryCode || undefined,
        lead_capture_form: hasLeadCaptureForm || undefined,
        form_fn: formFn || undefined,
        form_ln: formLn || undefined,
        form_email: formEmail || undefined,
        form_phone: formPhone || undefined,
        fn: enrichedIdentity.fn || undefined,
        ln: enrichedIdentity.ln || undefined,
        ct: enrichedIdentity.ct || undefined,
        st: enrichedIdentity.st || undefined,
        zip: enrichedIdentity.zip || undefined,
        country: enrichedIdentity.country || undefined,
        utm_campaign: utmCampaign,
        test_event_code: testEventCode || undefined,
        fbp,
        fbc,
        client_ip_address: clientIpAddress || undefined,
        client_ip_issued_at: clientIpIssuedAt || undefined,
        client_ip_proof: clientIpProof || undefined,
        client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        telefono_asignado: atrioMode ? '' : phone,
        promo_code: promoCode,
        source: 'main_button',
        source_platform: 'landing',
        cta_destination: atrioMode ? 'atrio' : 'whatsapp',
        redirect_channel: atrioMode ? 'atrio' : 'whatsapp',
        atrio_redirect_url: atrioMode ? String(config.tracking.atrioRedirectUrl || '').trim() : undefined,
        atrio_client_id: atrioMode ? String(config.tracking.atrioClientId || '').trim() : undefined,
        atrio_id: atrioMode ? String(config.tracking.atrioId || '').trim() : undefined,
        atrio_slug: atrioMode ? String(config.tracking.atrioSlug || '').trim() : undefined,
        brand: config.name,
        landing_id: config.id,
        landing_name: config.name,
        currency: workspaceCurrency,
        workspace_currency: workspaceCurrency,
        device_type: deviceType,
        cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
        mode: config.background?.mode,
        api_meta: null
      };

      try {
        if (!shouldSkipContact) {
          const body = JSON.stringify({
            postUrl: config.tracking.postUrl,
            payload
          });
          void sendTrackBestEffort(body).catch(() => {
            // Ignorar errores de tracking
          });
        }
      } catch {
        // El tracking nunca debe bloquear el redirect
      }

      if (!shouldSkipContact) {
        markContactSent(storageNamespace, slug, externalId);
      }

      await new Promise((resolve) => setTimeout(resolve, 180));
      window.location.assign(redirectUrl);
    } catch {
      clickLockRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleClickRef.current = handleClick;
  });

  useEffect(() => {
    if (!externalTriggerEvent || typeof window === 'undefined') return;
    const listener = () => {
      void handleClickRef.current();
    };
    window.addEventListener(externalTriggerEvent, listener);
    return () => window.removeEventListener(externalTriggerEvent, listener);
  }, [externalTriggerEvent]);

  const ctaStyle = useMemo(
    () => ({
      color: config.colors?.ctaText ?? '#FFFFFF',
      background: config.colors?.ctaBackground ?? '#25D366',
      fontSize: `${config.typography?.cta?.sizePx ?? 18}px`,
      fontWeight: config.typography?.cta?.weight ?? 700
    }),
    [config.colors?.ctaBackground, config.colors?.ctaText, config.typography?.cta?.sizePx, config.typography?.cta?.weight]
  );
  const template4CtaStyle = useMemo(
    () => ({
      ...ctaStyle,
      color: !config.colors?.ctaText || config.colors.ctaText === '#000000' ? '#FFFFFF' : config.colors.ctaText,
      background:
        !config.colors?.ctaBackground || config.colors.ctaBackground === '#FFD700'
          ? '#25D366'
          : config.colors.ctaBackground
    }),
    [config.colors?.ctaBackground, config.colors?.ctaText, ctaStyle]
  );
  const leadCaptureDescription =
    config.leadCapture?.description || 'Completá tus datos o seguí directo a WhatsApp.';

  const leadCaptureModal = leadCaptureOpen && leadCaptureEnabled ? (
    <div
      className="public-lead-capture"
      role="dialog"
      aria-modal="true"
      aria-labelledby="public-lead-capture-title"
      onClick={(event) => {
        if (event.currentTarget === event.target) continueFromLeadCapture(null);
      }}
    >
      <form
        className="public-lead-capture__card"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          continueFromLeadCapture(leadCaptureForm);
        }}
      >
        <button
          type="button"
          className="public-lead-capture__close"
          aria-label="Omitir formulario e ir a WhatsApp"
          onClick={() => continueFromLeadCapture(null)}
        >
          ×
        </button>
        <h2 id="public-lead-capture-title">
          {config.leadCapture?.title || 'Desbloqueá atención personalizada'}
        </h2>
        {leadCaptureDescription.trim() ? (
          <p className="public-lead-capture__description">
            {leadCaptureDescription}
          </p>
        ) : null}
        <div className="public-lead-capture__grid">
          {leadCaptureFields.firstName === true ? (
            <label className="public-lead-capture__field">
              <input
                className="public-lead-capture__input"
                type="text"
                autoComplete="given-name"
                aria-label="Nombre"
                placeholder="Nombre"
                value={leadCaptureForm.firstName || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.lastName === true ? (
            <label className="public-lead-capture__field">
              <input
                className="public-lead-capture__input"
                type="text"
                autoComplete="family-name"
                aria-label="Apellido"
                placeholder="Apellido"
                value={leadCaptureForm.lastName || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.phone === true ? (
            <label className="public-lead-capture__field">
              <input
                className="public-lead-capture__input"
                type="tel"
                autoComplete="tel"
                aria-label="Teléfono"
                placeholder="Teléfono"
                value={leadCaptureForm.phone || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.email === true ? (
            <label className="public-lead-capture__field">
              <input
                className="public-lead-capture__input"
                type="email"
                autoComplete="email"
                aria-label="Email"
                placeholder="Email"
                value={leadCaptureForm.email || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
          ) : null}
        </div>
        <div className="public-lead-capture__actions">
          <button type="submit" className="public-lead-capture__submit">
            CONTINUAR A WHATSAPP →
          </button>
          <button
            type="button"
            className="public-lead-capture__skip"
            onClick={() => continueFromLeadCapture(null)}
          >
            OMITIR E IR A WHATSAPP
          </button>
        </div>
      </form>
    </div>
  ) : null;

  if (hideButton) return null;

  if (templateVariant === 'template3') {
    return (
      <button
        type="button"
        className="template3__retry"
        onClick={() => void handleClick()}
        disabled={isLoading || isDisabled}
        aria-label="Reintentar redirección a WhatsApp"
        aria-busy={isLoading}
      >
        {isDisabled ? 'reintenta en un momento' : isLoading ? 'conectando...' : 'haz clic aquí.'}
      </button>
    );
  }

  if (templateVariant === 'template4') {
    return (
      <>
        <button
          type="button"
          className="template4__cta"
          style={template4CtaStyle}
          onClick={handlePrimaryClick}
          disabled={isLoading || isDisabled}
          aria-label={template4CtaText}
          aria-busy={isLoading}
        >
          {isDisabled || isLoading ? null : <WhatsAppIcon className="template4__cta-icon" />}
          <span>{isDisabled ? 'Sin numero disponible' : isLoading ? 'Abriendo...' : template4CtaText}</span>
        </button>
        {leadCaptureModal}
      </>
    );
  }

  if (templateVariant === 'template5') {
    return (
      <>
        <button
          type="button"
          className="template5__cta"
          onClick={handlePrimaryClick}
          disabled={isLoading || isDisabled}
          aria-label="ENTRAR POR WHATSAPP"
          aria-busy={isLoading}
        >
          <WhatsAppIcon className="template5__cta-icon" />
          <span>{isDisabled ? 'Sin numero disponible' : isLoading ? 'Abriendo...' : 'ENTRAR POR WHATSAPP'}</span>
        </button>
        {leadCaptureModal}
      </>
    );
  }

  if (templateVariant === 'template1' || templateVariant === 'template2') {
    return (
      <>
      <a
        href="#"
        className="cta"
        aria-label="Enviar WhatsApp"
        onClick={(e) => {
          e.preventDefault();
          handlePrimaryClick();
        }}
        style={{
          ...ctaStyle,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1), 0 10px 24px rgba(0,0,0,.26)',
          pointerEvents: isLoading || isDisabled ? 'none' : undefined,
          opacity: isLoading || isDisabled ? 0.75 : undefined,
          transform: isLoading ? 'scale(0.97)' : undefined,
          transition: 'transform 120ms ease, opacity 120ms ease'
        }}
        aria-busy={isLoading}
      >
        <span className="cta__fill">
          {isDisabled ? 'Sin número disponible' : isLoading ? 'Abriendo...' : ctaText}
        </span>
        <WhatsAppIcon className="cta__icon" />
      </a>
      {leadCaptureModal}
      </>
    );
  }

  return (
    <>
    <button
      type="button"
      className="whatsapp-button"
      onClick={handlePrimaryClick}
      disabled={isLoading || isDisabled}
      style={{
        ...ctaStyle,
        boxShadow: `0 0 30px 8px ${config.colors?.ctaGlow ?? '#FFD700'}`,
        transform: isLoading ? 'scale(0.97)' : undefined,
        transition: 'transform 120ms ease, opacity 120ms ease'
      }}
      aria-label="Crear usuario por WhatsApp"
      aria-busy={isLoading}
    >
      <span>{isDisabled ? 'Sin número disponible' : isLoading ? 'Abriendo...' : ctaText}</span>
      <WhatsAppIcon className="whatsapp-icon" />
    </button>
    {leadCaptureModal}
    </>
  );
}

