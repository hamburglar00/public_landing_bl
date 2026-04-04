import dynamic from 'next/dynamic';
import PixelInit from '@/components/PixelInit';
import RotatingBackground from '@/components/RotatingBackground';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';
import { resolveFontFamily } from '@/lib/landing/resolveFontFamily';

const Template2View = dynamic(() => import('@/components/Template2View'));

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Landing({ slug, config }: Props) {
  const images = config.background?.images || [];
  const hasLogo = Boolean(config.content.logoUrl);
  const titleLines = config.content.title || [];
  const subtitleLines = config.content.subtitle || [];
  const badgeText = config.content.footerBadgeText || '';

  const rawCtaPosition = config.layout?.ctaPosition ?? 'between_title_and_info';
  const normalizedCtaPosition = (() => {
    const value = rawCtaPosition === 'below_info' ? 'between_info_and_badge' : rawCtaPosition;
    const allowed = ['top', 'between_title_and_info', 'between_info_and_badge', 'bottom'] as const;
    return allowed.includes(value as (typeof allowed)[number]) ? value : 'between_title_and_info';
  })();

  const resolvedFontFamily = resolveFontFamily(config.typography?.fontFamily);
  const isTemplate2 = config.layout?.template === 2;
  const pixelBlock = config.tracking.pixelId ? (
    <>
      <PixelInit pixelId={config.tracking.pixelId} />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${config.tracking.pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  ) : null;

  if (isTemplate2) {
    return (
      <>
        {pixelBlock}
        <Template2View slug={slug} config={config} />
      </>
    );
  }

  return (
    <main className="landing-shell">
      {pixelBlock}

      <section className="container background-image">
        <RotatingBackground
          images={images}
          rotateEveryHours={config.background.rotateEveryHours}
          overlay={false}
        />

        <div className="content" style={{ fontFamily: resolvedFontFamily }}>
          {hasLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.content.logoUrl}
              className="logo"
              alt={config.name}
              decoding="async"
              fetchPriority="high"
            />
          ) : null}

          {normalizedCtaPosition === 'top' ? <WhatsAppButton slug={slug} config={config} /> : null}

          <p
            className="title"
            style={{
              color: config.colors.title,
              fontSize: `${config.typography.title.sizePx}px`,
              fontWeight: config.typography.title.weight
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
            <WhatsAppButton slug={slug} config={config} />
          ) : null}

          <p
            className="subtitle"
            style={{
              color: config.colors.subtitle,
              fontSize: `${config.typography.subtitle.sizePx}px`,
              fontWeight: config.typography.subtitle.weight
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
            <WhatsAppButton slug={slug} config={config} />
          ) : null}

          {badgeText ? (
            <p
              className="description"
              style={{
                color: config.colors.badge,
                fontSize: `${config.typography.badge.sizePx}px`,
                fontWeight: config.typography.badge.weight
              }}
            >
              -{badgeText}-
            </p>
          ) : null}

          {normalizedCtaPosition === 'bottom' ? <WhatsAppButton slug={slug} config={config} /> : null}
        </div>
      </section>
    </main>
  );
}
