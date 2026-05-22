import dynamic from 'next/dynamic';
import PixelInit from '@/components/PixelInit';
import type { LandingConfig } from '@/lib/landing/types';

const Template1View = dynamic(() => import('@/components/Template1View'));
const Template2View = dynamic(() => import('@/components/Template2View'));
const Template3View = dynamic(() => import('@/components/Template3View'));

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Landing({ slug, config }: Props) {
  const isTemplate2 = config.layout?.template === 2;
  const isTemplate3 = config.layout?.template === 3;

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

  if (isTemplate3) {
    return (
      <>
        {pixelBlock}
        <Template3View slug={slug} config={config} />
      </>
    );
  }

  if (isTemplate2) {
    return (
      <>
        {pixelBlock}
        <Template2View slug={slug} config={config} />
      </>
    );
  }

  return (
    <>
      {pixelBlock}
      <Template1View slug={slug} config={config} />
    </>
  );
}
