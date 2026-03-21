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
  const secondBgImage = config.background?.images?.[1];
  const supabaseOrigin = (() => {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    try {
      return raw ? new URL(raw).origin : '';
    } catch {
      return '';
    }
  })();

  return (
    <>
      {supabaseOrigin ? (
        <>
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
          <link rel="dns-prefetch" href={supabaseOrigin} />
        </>
      ) : null}
      {firstBgImage ? (
        <link rel="preload" as="image" href={firstBgImage} fetchPriority="high" />
      ) : null}
      {secondBgImage ? (
        <link rel="preload" as="image" href={secondBgImage} />
      ) : null}
      <Landing slug={slug} config={config} />
    </>
  );
}
