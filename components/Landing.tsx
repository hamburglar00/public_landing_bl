import PixelInit from '@/components/PixelInit';
import PrivacyFooter from '@/components/PrivacyFooter';
import Template1View from '@/components/Template1View';
import Template2View from '@/components/Template2View';
import Template3View from '@/components/Template3View';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Landing({ slug, config }: Props) {
  const isTemplate2 = config.layout?.template === 2;
  const isTemplate3 = config.layout?.template === 3;

  const pixelBlock = config.tracking.pixelId ? (
    <>
      <PixelInit
        pixelId={config.tracking.pixelId}
        slug={slug}
        phoneCountryCode={config.tracking.phoneCountryCode}
      />
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

  if (isTemplate3) {
    return (
      <>
        {pixelBlock}
        <Template3View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  if (isTemplate2) {
    return (
      <>
        {pixelBlock}
        <Template2View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  return (
    <>
      {pixelBlock}
      <Template1View slug={slug} config={config} />
      <PrivacyFooter config={config} />
    </>
  );
}
