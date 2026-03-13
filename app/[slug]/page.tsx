import { notFound } from 'next/navigation';
import Landing from '@/components/Landing';
import { getLandingConfig } from '@/lib/landing/getLandingConfig';

export const revalidate = 60;
export const dynamic = 'force-static';

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = await getLandingConfig(slug);

  if (!config) {
    notFound();
  }

  const firstBgImage = config.background?.images?.[0];

  return (
    <>
      {firstBgImage ? (
        <link rel="preload" as="image" href={firstBgImage} />
      ) : null}
      <Landing slug={slug} config={config} />
    </>
  );
}
