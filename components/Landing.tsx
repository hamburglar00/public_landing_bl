import RotatingBackground from '@/components/RotatingBackground';
import Template2View from '@/components/Template2View';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';
import { resolveFontFamily } from '@/lib/landing/resolveFontFamily';

type Props = {
  slug: string;
  config: LandingConfig;
};

function buildMetaPixelInlineScript(pixelId: string) {
  const safePixelId = JSON.stringify(pixelId);
  return `
!function(f,b,e,v,n,t,s){
if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
(function() {
  var qs = new URLSearchParams(window.location.search);
  var email = (qs.get('email') || '').trim().toLowerCase();
  var phone = (qs.get('phone') || '').replace(/\\D+/g, '');
  if (phone && phone.length === 10) phone = '54' + phone;
  var externalId = '';
  try {
    externalId = localStorage.getItem('external_id') || '';
    if (!externalId) {
      externalId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + '-' + Math.random());
      localStorage.setItem('external_id', externalId);
    }
  } catch(_) {
    externalId = String(Date.now()) + '-' + Math.random();
  }
  var user = { external_id: externalId };
  if (email) user.em = email;
  if (phone) user.ph = phone;
  fbq('init', ${safePixelId}, user);
  fbq('track', 'PageView');
})();
`;
}

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
  const pixelId = config.tracking.pixelId;
  const pixelBlock = pixelId ? (
    <>
      <script dangerouslySetInnerHTML={{ __html: buildMetaPixelInlineScript(pixelId) }} />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
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
