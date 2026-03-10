'use client';

import FrameBackgroundTemplate2 from '@/components/FrameBackgroundTemplate2';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';
import { resolveFontFamily } from '@/lib/landing/resolveFontFamily';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template2View({ slug, config }: Props) {
  const images = config.background?.images || [];
  const hasLogo = Boolean(config.content.logoUrl);
  const titleLines = config.content.title || [];
  const subtitleLines = config.content.subtitle || [];
  const badgeArray = config.content.footerBadge || [];
  const badgeText =
    (badgeArray.find((line) => line && line.trim().length > 0) || config.content.footerBadgeText || '').trim();
  const fontFamily = resolveFontFamily(config.typography?.fontFamily);

  return (
    <main className="lp">
      <section className="phone-view">
        <div
          className="artboard"
          style={fontFamily ? { fontFamily } : undefined}
        >
          <div className="frame">
            <FrameBackgroundTemplate2
              images={images}
              rotateEveryHours={config.background.rotateEveryHours}
            />
            {hasLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.content.logoUrl}
                alt={config.name}
                className="frame__logo"
                decoding="async"
                fetchPriority="high"
              />
            ) : null}

            <div className="frame__copy">
              {badgeText ? (
                <p
                  className="eyebrow"
                  style={{
                    color: config.colors.badge,
                    fontSize: `${config.typography.badge.sizePx}px`,
                    fontWeight: config.typography.badge.weight
                  }}
                >
                  {badgeText}
                </p>
              ) : null}
              <h1
                className="title"
                style={{
                  color: config.colors.title,
                  fontSize: `${config.typography.title.sizePx}px`,
                  fontWeight: config.typography.title.weight
                }}
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

          <WhatsAppButton slug={slug} config={config} templateVariant="template2" />

          <div className="features">
            {subtitleLines.map((line, idx) => (
              <p
                key={`${slug}-t2-sub-${idx}`}
                style={{
                  color: config.colors.subtitle,
                  fontSize: `${config.typography.subtitle.sizePx}px`,
                  fontWeight: config.typography.subtitle.weight
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
