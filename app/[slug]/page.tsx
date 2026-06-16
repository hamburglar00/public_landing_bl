import { notFound } from 'next/navigation';
import Landing from '@/components/Landing';
import { getLandingConfig } from '@/lib/landing/getLandingConfig';
import { getGoogleFontStylesheetHref } from '@/lib/landing/resolveFontFamily';

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
  const fontHref = getGoogleFontStylesheetHref(config.typography?.fontFamily);
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
      {fontHref ? (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontHref} />
        </>
      ) : null}
      {config.tracking.pixelId ? (
        <>
          <link rel="preconnect" href="https://connect.facebook.net" />
          <link rel="preconnect" href="https://www.facebook.com" />
          <link rel="dns-prefetch" href="https://wa.me" />
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
