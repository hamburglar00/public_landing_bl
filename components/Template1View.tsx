import CtaClickDispatcher from '@/components/CtaClickDispatcher';
import RotatingBackground from '@/components/RotatingBackground';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template1View({ slug, config }: Props) {
  const images = config.background?.images || [];
  const hasLogo = Boolean(config.content?.logoUrl);
  const titleLines = config.content?.title || [];
  const subtitleLines = config.content?.subtitle || [];
  const badgeText = config.content?.footerBadgeText || '';
  const sharedTriggerEvent = `lp:cta-trigger:${slug}`;

  const rawCtaPosition = config.layout?.ctaPosition ?? 'between_title_and_info';
  const normalizedCtaPosition = (() => {
    const value = rawCtaPosition === 'below_info' ? 'between_info_and_badge' : rawCtaPosition;
    const allowed = ['top', 'between_title_and_info', 'between_info_and_badge', 'bottom'] as const;
    return allowed.includes(value as (typeof allowed)[number]) ? value : 'between_title_and_info';
  })();

  return (
    <main className="landing-shell">
      <CtaClickDispatcher eventName={sharedTriggerEvent} />
      <section
        className={`container background-image${normalizedCtaPosition === 'bottom' ? ' template1-bottom-layout' : ''}`}
      >
        <RotatingBackground
          images={images}
          rotateEveryHours={config.background?.rotateEveryHours}
          overlay={false}
        />

        <div className="content">
          {hasLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.content?.logoUrl}
              className="logo"
              alt={config.name}
              decoding="async"
              fetchPriority="high"
              data-cta-trigger-event={sharedTriggerEvent}
              style={{ cursor: 'pointer' }}
            />
          ) : null}

          {normalizedCtaPosition === 'top' ? (
            <WhatsAppButton slug={slug} config={config} externalTriggerEvent={sharedTriggerEvent} />
          ) : null}

          <p
            className="title"
            data-cta-trigger-event={sharedTriggerEvent}
            style={{
              color: config.colors?.title ?? '#FFFFFF',
              fontSize: `${config.typography?.title?.sizePx ?? 26}px`,
              fontWeight: config.typography?.title?.weight ?? 700,
              cursor: 'pointer'
            }}
          >
            {titleLines.map((line, idx) => (
              <span key={`${slug}-title-${idx}`}>
                {line}
                {idx < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>

          {normalizedCtaPosition === 'between_title_and_info' ? (
            <WhatsAppButton slug={slug} config={config} externalTriggerEvent={sharedTriggerEvent} />
          ) : null}

          <p
            className="subtitle"
            data-cta-trigger-event={sharedTriggerEvent}
            style={{
              color: config.colors?.subtitle ?? '#FFFFFF',
              fontSize: `${config.typography?.subtitle?.sizePx ?? 16}px`,
              fontWeight: config.typography?.subtitle?.weight ?? 400,
              cursor: 'pointer'
            }}
          >
            {subtitleLines.map((line, idx) => (
              <span key={`${slug}-subtitle-${idx}`}>
                {line}
                {idx < subtitleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>

          {normalizedCtaPosition === 'between_info_and_badge' ? (
            <WhatsAppButton slug={slug} config={config} externalTriggerEvent={sharedTriggerEvent} />
          ) : null}

          {badgeText ? (
            <p
              className="description"
              style={{
                color: config.colors?.badge ?? '#FFD700',
                fontSize: `${config.typography?.badge?.sizePx ?? 16}px`,
                fontWeight: config.typography?.badge?.weight ?? 700,
                cursor: 'pointer'
              }}
              data-cta-trigger-event={sharedTriggerEvent}
            >
              -{badgeText}-
            </p>
          ) : null}

        </div>

        {normalizedCtaPosition === 'bottom' ? (
          <div className="template1-bottom-cta-slot">
            <WhatsAppButton
              slug={slug}
              config={config}
              externalTriggerEvent={sharedTriggerEvent}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
