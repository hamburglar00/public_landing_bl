import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/** Orígenes permitidos para CORS (constructor en local y prod). Separados por coma. Ej: http://localhost:3001,https://tu-constructor.vercel.app */
const ALLOWED_ORIGINS_KEY = 'ALLOWED_ORIGINS';

function getCorsHeaders(req: Request): Record<string, string> {
  const allowed = (process.env[ALLOWED_ORIGINS_KEY] || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const origin = req.headers.get('origin') || '';
  const allowOrigin =
    allowed.length > 0 && origin && allowed.includes(origin)
      ? origin
      : allowed[0] || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export async function POST(req: Request) {
  const cors = getCorsHeaders(req);
  try {
    const body = await req.json();

    const secretEnv = process.env.REVALIDATE_SECRET || '';
    const secretFromBody = String(body?.secret || '');

    if (!secretEnv || secretFromBody !== secretEnv) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401, headers: cors }
      );
    }

    const name = String(body?.name || '').trim();
    if (!name) {
      return NextResponse.json(
        { error: 'Missing name' },
        { status: 400, headers: cors }
      );
    }

    const path = `/${name}`;
    revalidatePath(path);
    revalidateTag(`landing-config:${name}`);

    return NextResponse.json({ revalidated: true, path }, { headers: cors });
  } catch (error: unknown) {
    const details =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Revalidate failed', details },
      { status: 500, headers: cors }
    );
  }
}

