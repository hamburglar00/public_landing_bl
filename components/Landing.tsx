import PixelInit from '@/components/PixelInit';
import LandingPageViewTracker from '@/components/LandingPageViewTracker';
import PrivacyFooter from '@/components/PrivacyFooter';
import Template1View from '@/components/Template1View';
import Template2View from '@/components/Template2View';
import Template3View from '@/components/Template3View';
import Template4View from '@/components/Template4View';
import Template5View from '@/components/Template5View';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Landing({ slug, config }: Props) {
  const isTemplate2 = config.layout?.template === 2;
  const isTemplate3 = config.layout?.template === 3;
  const isTemplate4 = config.layout?.template === 4;
  const isTemplate5 = config.layout?.template === 5;

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
        <LandingPageViewTracker slug={slug} config={config} />
        <Template3View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  if (isTemplate2) {
    return (
      <>
        {pixelBlock}
        <LandingPageViewTracker slug={slug} config={config} />
        <Template2View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  if (isTemplate4) {
    return (
      <>
        {pixelBlock}
        <LandingPageViewTracker slug={slug} config={config} />
        <Template4View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  if (isTemplate5) {
    return (
      <>
        {pixelBlock}
        <LandingPageViewTracker slug={slug} config={config} />
        <Template5View slug={slug} config={config} />
        <PrivacyFooter config={config} />
      </>
    );
  }

  return (
    <>
      {pixelBlock}
      <LandingPageViewTracker slug={slug} config={config} />
      <Template1View slug={slug} config={config} />
      <PrivacyFooter config={config} />
    </>
  );
}
