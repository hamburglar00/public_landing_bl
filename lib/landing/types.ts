export type LandingConfig = {
  schemaVersion: number;
  updatedAt: string;
  id: string;
  name: string;
  comment: string;
  workspaceCurrency?: 'ARS' | 'PYG' | string;
  tracking: {
    pixelId: string;
    postUrl: string;
    landingTag: string;
    sendContactPixel?: boolean;
    ctaDestination?: 'whatsapp' | 'atrio' | string;
    atrioRedirectUrl?: string;
    atrioClientId?: string;
    atrioId?: string;
    atrioSlug?: string;
    phoneCountryCode?: string;
    currency?: 'ARS' | 'PYG' | string;
    workspaceCurrency?: 'ARS' | 'PYG' | string;
  };
  phoneSelection?: {
    mode: 'random' | 'fixed' | 'fair' | string;
  };
  background?: {
    mode: 'single' | 'rotating';
    images: string[];
    rotateEveryHours: number;
  };
  content?: {
    logoUrl: string;
    title: string[];
    subtitle: string[];
    /** Texto de badge simple (plantilla 1 / compatibilidad) */
    footerBadgeText?: string;
    /** Badge por líneas (plantilla 2) */
    footerBadge?: string[];
    ctaText: string;
    template4?: {
      profileImageUrl?: string;
      backgroundImageUrl?: string;
      bubble1Text?: string;
      bubble2Intro?: string;
      bubble2Items?: string[];
      bubble3Text?: string;
    };
    template5?: {
      titleText?: string;
      subtitleText?: string;
      profileImageUrl?: string;
      backgroundImageUrl?: string;
    };
  };
  typography?: {
    fontFamily: 'system' | string;
    title: {
      sizePx: number;
      weight: number;
    };
    subtitle: {
      sizePx: number;
      weight: number;
    };
    cta: {
      sizePx: number;
      weight: number;
    };
    badge: {
      sizePx: number;
      weight: number;
    };
  };
  colors?: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
    ctaBackground: string;
    ctaGlow: string;
  };
  socialProof?: {
    enabled?: boolean;
  };
  interactions?: {
    enabled?: boolean;
    whatsappPrefillText?: string;
  };
  leadCapture?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    fields?: {
      firstName?: boolean;
      lastName?: boolean;
      phone?: boolean;
      email?: boolean;
    };
  };
  layout: {
    ctaPosition:
      | 'top'
      | 'between_title_and_info'
      | 'between_info_and_badge'
      | 'bottom'
      | 'below_info'
      | string;
    /** 2 = plantilla 2; 3 = redirección directa; ausente u otro = plantilla base */
    template?: number;
  };
};

export type LandingPhoneResponse = {
  phone: string;
  landingId: string;
  landingName: string;
  phoneId?: number;
  phoneMode: string;
  fairCriterion?: string;
  phoneKind: string;
  phoneSelection?: {
    mode?: string;
    criterion?: string;
  };
  gerenciaSelection?: {
    mode?: string;
    criterion?: string;
  };
  gerencia?: {
    id: number;
    externalId: number;
    weight: number;
  };
};
