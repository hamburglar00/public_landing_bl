import { NextRequest, NextResponse } from 'next/server';
import { landingOverride } from './lib/landing/urlRouting';

// Routing only: the ISR route owns configuration/rendering and their cache.
export function middleware(request: NextRequest) {
  const selection = landingOverride(request.nextUrl);
  if (selection === 'invalid') return new NextResponse('Landing no encontrada', { status: 404 });
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  let slug = selection?.slug || '';
  try { if (!slug && segments.length === 1) slug = decodeURIComponent(segments[0]); }
  catch { return new NextResponse('Landing no encontrada', { status: 404 }); }
  if (!slug || ['api', '_next', '.well-known', 'favicon.ico', 'robots.txt', 'sitemap.xml'].includes(slug)) return NextResponse.next();
  if (!['GET', 'HEAD'].includes(request.method)) return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = `/api/landing-html/${encodeURIComponent(slug)}`;
  return NextResponse.rewrite(destination);
}

export const config = { matcher: ['/', '/:slug'] };
