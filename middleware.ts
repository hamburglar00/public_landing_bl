import { NextRequest, NextResponse } from 'next/server';
import { landingOverride } from './lib/landing/urlRouting';
import { getLandingConfig } from './lib/landing/getLandingConfig';
import { renderClassicTemplate7Html } from './lib/template7/shared.cjs';
import { buildDeviceIdRuntimeScript } from './lib/reyDeAses/deviceId';

export async function middleware(request: NextRequest) {
  const selection = landingOverride(request.nextUrl);
  if (selection === 'invalid') return new NextResponse('Landing no encontrada', { status: 404 });
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  let slug = selection?.slug || '';
  try { if (!slug && segments.length === 1) slug = decodeURIComponent(segments[0]); }
  catch { return new NextResponse('Landing no encontrada', { status: 404 }); }
  if (slug && !['api', '_next', '.well-known', 'favicon.ico', 'robots.txt', 'sitemap.xml'].includes(slug)
      && ['GET', 'HEAD'].includes(request.method) && request.headers.get('rsc') !== '1') {
    try {
      const landing = await getLandingConfig(slug);
      if (landing?.layout?.template === 7 || landing?.layout?.template === 8) {
        return new NextResponse(request.method === 'HEAD' ? null : renderClassicTemplate7Html({
          slug, config: landing, canonicalUrl: `${request.nextUrl.origin}/${encodeURIComponent(slug)}`,
        }, buildDeviceIdRuntimeScript()), { headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=60',
          'X-Content-Type-Options': 'nosniff',
        } });
      }
    } catch { /* The existing page handles unavailable/missing configurations. */ }
  }
  if (!selection) return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = selection.pathname;
  return NextResponse.rewrite(destination);
}

export const config = { runtime: 'nodejs', matcher: ['/', '/:slug'] };
