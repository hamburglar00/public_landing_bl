'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getLandingPhone } from '@/lib/landing/getLandingPhone';
import type { LandingConfig } from '@/lib/landing/types';
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
  templateVariant?: 'default' | 'template1' | 'template2' | 'template3';
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
  const baseMessage = `Hola! quiero mas informacion por favor! Mi codigo es: ${promoCode} y mi nombre es:`.trim();
  const extraText = String(whatsappPrefillText || '').trim();
  return extraText ? `${baseMessage}\n\n${extraText}` : baseMessage;
}

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(-700 -360)">
        <path
          d="M723.993033,360 C710.762252,360 700,370.765287 700,383.999801 C700,389.248451 701.692661,394.116025 704.570026,398.066947 L701.579605,406.983798 L710.804449,404.035539 C714.598605,406.546975 719.126434,408 724.006967,408 C737.237748,408 748,397.234315 748,384.000199 C748,370.765685 737.237748,360.000398 724.006967,360.000398 L723.993033,360.000398 L723.993033,360 Z M717.29285,372.190836 C716.827488,371.07628 716.474784,371.034071 715.769774,371.005401 C715.529728,370.991464 715.262214,370.977527 714.96564,370.977527 C714.04845,370.977527 713.089462,371.245514 712.511043,371.838033 C711.806033,372.557577 710.056843,374.23638 710.056843,377.679202 C710.056843,381.122023 712.567571,384.451756 712.905944,384.917648 C713.258648,385.382743 717.800808,392.55031 724.853297,395.471492 C730.368379,397.757149 732.00491,397.545307 733.260074,397.27732 C735.093658,396.882308 737.393002,395.527239 737.971421,393.891043 C738.54984,392.25405 738.54984,390.857171 738.380255,390.560912 C738.211068,390.264652 737.745308,390.095816 737.040298,389.742615 C736.335288,389.389811 732.90737,387.696673 732.25849,387.470894 C731.623543,387.231179 731.017259,387.315995 730.537963,387.99333 C729.860819,388.938653 729.198006,389.89831 728.661785,390.476494 C728.238619,390.928051 727.547144,390.984595 726.969123,390.744481 C726.193254,390.420348 724.021298,389.657798 721.340985,387.273388 C719.267356,385.42535 717.856938,383.125756 717.448104,382.434484 C717.038871,381.729275 717.405907,381.319529 717.729948,380.938852 C718.082653,380.501232 718.421026,380.191036 718.77373,379.781688 C719.126434,379.372738 719.323884,379.160897 719.549599,378.681068 C719.789645,378.215575 719.62006,377.735746 719.450874,377.382942 C719.281687,377.030139 717.871269,373.587317 717.29285,372.190836 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
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
    getLocalStorageValue(storageNamespace, 'external_id')
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
  }, [slug]);

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
      const enrichedIdentity = applyLeadCaptureToIdentity(
        identity,
        leadCaptureValues,
        config.tracking.phoneCountryCode || '54'
      );
      const emailRaw = enrichedIdentity.emailRaw;
      const phoneRaw = enrichedIdentity.phoneRaw;
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

      // Usa el número pre-cargado; si viene lento, hace un reintento corto.
      let phoneData = await waitWithTimeout(ensurePhonePromise(), 1500);
      if (!phoneData?.phone) {
        phonePromiseRef.current = null;
        phoneData = await waitWithTimeout(ensurePhonePromise(), 2500);
      }
      const effectivePhoneMode =
        phoneData?.phoneMode ?? phoneData?.phoneSelection?.mode ?? '';

      const phone = normalizeLandingPhone(
        phoneData?.phone || '',
        config.tracking.phoneCountryCode || '54'
      );

      if (!phone) {
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
      if (effectivePhoneMode === 'fair' || effectivePhoneMode === 'random') {
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
        meta_pixel_id: String(config.tracking.pixelId || '').trim() || undefined,
        sendContactPixel,
        event_id: eventId,
        external_id: externalId,
        event_source_url: getSafeEventSourceUrl(),
        email: emailRaw,
        phone: phoneRaw,
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
        telefono_asignado: phone,
        promo_code: promoCode,
        source: 'main_button',
        source_platform: 'landing',
        brand: config.name,
        landing_id: config.id,
        landing_name: config.name,
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
      window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
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
          {config.leadCapture?.title || '¿Querés atención personalizada y desbloquear un código promocional?'}
        </h2>
        {(config.leadCapture?.description || '').trim() ? (
          <p className="public-lead-capture__description">
            {config.leadCapture?.description}
          </p>
        ) : null}
        <div className="public-lead-capture__grid">
          {leadCaptureFields.firstName === true ? (
            <label className="public-lead-capture__field">
              <span>Nombre</span>
              <input
                className="public-lead-capture__input"
                type="text"
                autoComplete="given-name"
                placeholder="Nombre"
                value={leadCaptureForm.firstName || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.lastName === true ? (
            <label className="public-lead-capture__field">
              <span>Apellido</span>
              <input
                className="public-lead-capture__input"
                type="text"
                autoComplete="family-name"
                placeholder="Apellido"
                value={leadCaptureForm.lastName || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.phone === true ? (
            <label className="public-lead-capture__field">
              <span>Teléfono</span>
              <input
                className="public-lead-capture__input"
                type="tel"
                autoComplete="tel"
                placeholder="Teléfono"
                value={leadCaptureForm.phone || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>
          ) : null}
          {leadCaptureFields.email === true ? (
            <label className="public-lead-capture__field">
              <span>Email</span>
              <input
                className="public-lead-capture__input"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={leadCaptureForm.email || ''}
                onChange={(event) => setLeadCaptureForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
          ) : null}
        </div>
        <div className="public-lead-capture__actions">
          <button type="submit" className="public-lead-capture__submit">
            Continuar a WhatsApp
          </button>
          <button
            type="button"
            className="public-lead-capture__skip"
            onClick={() => continueFromLeadCapture(null)}
          >
            Omitir e ir a WhatsApp
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

