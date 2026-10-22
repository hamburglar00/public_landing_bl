import { notFound } from 'next/navigation';
import Landing from '@/components/Landing';
import Template7FastView from '@/components/Template7FastView';
import { getLandingConfig } from '@/lib/landing/getLandingConfig';
import { gatewayOriginFor } from '@/lib/reyDeAses/gatewayOrigins';

export const revalidate = 60;
export const dynamic = 'force-static';

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = await getLandingConfig(slug);

  if (!config) {
    notFound();
  }

  // Templates 1-6 keep their proven rendering/tracking path unchanged.
  // The T7 fragment includes prewarm, Pixel, journey and Contact exactly once.
  if (config.layout?.template === 7 || config.layout?.template === 8) {
    return <Template7FastView slug={slug} config={config} />;
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
  const atrioPrewarmScript = config.layout?.template === 7 && supabaseOrigin && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? `(function(){var slug=${JSON.stringify(slug)};var base=${JSON.stringify(supabaseOrigin)};var key=${JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)};window.__PUBLIC_LANDING_ATRIO_PROMISES=window.__PUBLIC_LANDING_ATRIO_PROMISES||{};if(window.__PUBLIC_LANDING_ATRIO_PROMISES[slug])return;var endpoint=base.replace(/\\\/+$/,"")+"/functions/v1/landing-atrio?name="+encodeURIComponent(slug);window.__PUBLIC_LANDING_ATRIO_PROMISES[slug]=fetch(endpoint,{headers:{apikey:key,Authorization:"Bearer "+key},cache:"no-store",keepalive:true}).then(function(response){if(!response.ok)return null;return response.json()}).then(function(value){if(!value||typeof value!=="object")return null;var atrioClientId=String(value.atrioClientId||value.atrio_client_id||"");var atrioId=String(value.atrioId||value.atrio_id||"");var atrioSlug=String(value.atrioSlug||value.atrio_slug||"");if(!atrioClientId||!atrioId||!atrioSlug)return null;return{atrioClientId:atrioClientId,atrioId:atrioId,atrioSlug:atrioSlug,atrioRedirectUrl:String(value.atrioRedirectUrl||value.atrio_redirect_url||"")}}).catch(function(){return null})})();`
    : '';
  const gatewayOrigin = (() => {
    if (config.layout?.template !== 7) return '';
    try {
      const rawOrigin = gatewayOriginFor(config.tracking?.target_provider, config.tracking?.skin_code);
      const url = new URL(rawOrigin || '');
      return url.protocol === 'https:' ? url.origin : '';
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
      {atrioPrewarmScript ? <script dangerouslySetInnerHTML={{ __html: atrioPrewarmScript }} /> : null}
      {gatewayOrigin ? (
        <>
          <link rel="preconnect" href={gatewayOrigin} />
          <link rel="dns-prefetch" href={gatewayOrigin} />
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
