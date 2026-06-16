import CtaClickDispatcher from '@/components/CtaClickDispatcher';
import FrameBackgroundTemplate2 from '@/components/FrameBackgroundTemplate2';
import SocialProofRotator from '@/components/SocialProofRotator';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';
import { resolveFontFamily } from '@/lib/landing/resolveFontFamily';

type Props = {
  slug: string;
  config: LandingConfig;
};

const SOCIAL_PROOF_INTERVAL_MS = 5000;

const SOCIAL_PROOF_ITEMS = [
  { quote: 'Muy buena atencion. Me respondieron rapido y sin vueltas 🙌', name: 'Nico R.' },
  { quote: 'Excelente servicio, todo claro desde el primer mensaje ✅', name: 'Juan P.' },
  { quote: 'Siempre responden rapido y con muy buena predisposicion 💬', name: 'Mica F.' },
  { quote: 'Atencion super amable. Me resolvieron todo en minutos ⚡', name: 'Seba L.' },
  { quote: 'Me ayudaron en todo el proceso, muy claros y confiables 🤝', name: 'Romi D.' },
  { quote: 'Atencion impecable. Responden al toque por WhatsApp 📲', name: 'Lau T.' },
  { quote: 'Servicio muy confiable, siempre cumplen con lo que dicen ⭐', name: 'Dario C.' },
  { quote: 'Todo simple, rapido y bien explicado. Recomiendo 🙏', name: 'Cami V.' },
  { quote: 'Muy buena experiencia. La atencion fue rapida y cordial 😊', name: 'Pablo M.' },
  { quote: 'Excelente trato, buena onda y respuesta inmediata 🔥', name: 'Gise A.' }
];

export default function Template2View({ slug, config }: Props) {
  const images = config.background?.images || [];
  const hasLogo = Boolean(config.content?.logoUrl);
  const titleLines = config.content?.title || [];
  const subtitleLines = config.content?.subtitle || [];
  const badgeArray = config.content?.footerBadge || [];
  const badgeText =
    (badgeArray.find((line) => line && line.trim().length > 0) || config.content?.footerBadgeText || '').trim();
  const fontFamily = resolveFontFamily(config.typography?.fontFamily);
  const isSocialProofEnabled = config.socialProof?.enabled !== false;
  const sharedTriggerEvent = `lp:cta-trigger:${slug}`;

  return (
    <main className="lp">
      <CtaClickDispatcher eventName={sharedTriggerEvent} />
      <section className="phone-view">
        <div
          className="artboard"
          style={fontFamily ? { fontFamily } : undefined}
        >
          <div className="frame">
            <FrameBackgroundTemplate2
              images={images}
              rotateEveryHours={config.background?.rotateEveryHours}
            />
            {hasLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.content?.logoUrl}
                alt={config.name}
                className="frame__logo"
                decoding="async"
                fetchPriority="high"
                data-cta-trigger-event={sharedTriggerEvent}
                style={{ cursor: 'pointer' }}
              />
            ) : null}

            <div className="frame__copy">
              {badgeText ? (
                <p
                  className="eyebrow"
                  style={{
                    color: config.colors?.badge ?? '#FFD700',
                    fontSize: `${config.typography?.badge?.sizePx ?? 16}px`,
                    fontWeight: config.typography?.badge?.weight ?? 700,
                    cursor: 'pointer'
                  }}
                  data-cta-trigger-event={sharedTriggerEvent}
                >
                  {badgeText}
                </p>
              ) : null}
              <h1
                className="title"
                style={{
                  color: config.colors?.title ?? '#FFFFFF',
                  fontSize: `${config.typography?.title?.sizePx ?? 26}px`,
                  fontWeight: config.typography?.title?.weight ?? 700,
                  cursor: 'pointer'
                }}
                data-cta-trigger-event={sharedTriggerEvent}
              >
                {titleLines.map((line, idx) => (
                  <span key={`${slug}-t2-title-${idx}`}>
                    {line}
                    {idx < titleLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          <WhatsAppButton
            slug={slug}
            config={config}
            templateVariant="template2"
            externalTriggerEvent={sharedTriggerEvent}
          />

          {isSocialProofEnabled ? (
            <SocialProofRotator
              items={SOCIAL_PROOF_ITEMS}
              intervalMs={SOCIAL_PROOF_INTERVAL_MS}
              triggerEvent={sharedTriggerEvent}
            />
          ) : null}

          <div
            className="features"
            data-cta-trigger-event={sharedTriggerEvent}
            style={{ cursor: 'pointer' }}
          >
            {subtitleLines.map((line, idx) => (
              <p
                key={`${slug}-t2-sub-${idx}`}
                style={{
                  color: config.colors?.subtitle ?? '#FFFFFF',
                  fontSize: `${config.typography?.subtitle?.sizePx ?? 16}px`,
                  fontWeight: config.typography?.subtitle?.weight ?? 400
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
