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

    const origin = new URL(req.url).origin;
    const warmSlug = encodeURIComponent(name);

    const ts = Date.now();
    const warmConfigUrl = `${origin}/api/config?name=${warmSlug}&_ts=${ts}`;
    const warmPageUrl = `${origin}/${warmSlug}?warm=1&_ts=${ts}`;

    const warmFetch = async (url: string): Promise<boolean> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, max-age=0',
            Pragma: 'no-cache',
          },
          signal: controller.signal,
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        clearTimeout(timeout);
      }
    };

    const warmedConfig = await warmFetch(warmConfigUrl);

    let warmedPage = await warmFetch(warmPageUrl);
    let warmedPageRetry = false;
    if (!warmedPage) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      warmedPageRetry = true;
      warmedPage = await warmFetch(warmPageUrl);
    }

    return NextResponse.json(
      { revalidated: true, path, warmedConfig, warmedPage, warmedPageRetry },
      { headers: cors }
    );
  } catch (error: unknown) {
    const details =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Revalidate failed', details },
      { status: 500, headers: cors }
    );
  }
}
