import { NextRequest, NextResponse } from 'next/server';
import { landingOverride } from './lib/landing/urlRouting';

export function middleware(request: NextRequest) {
  const selection = landingOverride(request.nextUrl);
  if (selection === 'invalid') return new NextResponse('Landing no encontrada', { status: 404 });
  if (!selection) return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.pathname = selection.pathname;
  return NextResponse.rewrite(destination);
}

export const config = { matcher: ['/', '/:slug'] };
