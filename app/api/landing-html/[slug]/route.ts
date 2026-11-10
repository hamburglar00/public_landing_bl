import { getLandingConfig } from '@/lib/landing/getLandingConfig';
import { renderClassicPublicLandingHtml } from '@/lib/template7/shared.cjs';
import { buildDeviceIdRuntimeScript } from '@/lib/reyDeAses/deviceId';
import analytics from '@/lib/landing/analytics.generated.json';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = await getLandingConfig(slug);
  if (!config) return new Response('Landing no encontrada', { status: 404, headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' } });
  const origin = process.env.PUBLIC_LANDING_ORIGIN || 'https://landing.panelbotadmin.com';
  const html=renderClassicPublicLandingHtml({
    slug, config, canonicalUrl: `${origin.replace(/\/$/, '')}/${encodeURIComponent(slug)}`,
  }, buildDeviceIdRuntimeScript());
  const measuredHtml = process.env.VERCEL
    ? html.replace('</body>', `<script defer src="/public-assets/template-entry/${analytics.name}"></script></body>`)
    : html;
  return new Response(measuredHtml, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=60',
    'X-Content-Type-Options': 'nosniff',
  } });
}
