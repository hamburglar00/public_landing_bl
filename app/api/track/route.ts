import { NextRequest, NextResponse } from 'next/server';

const MAX_UPSTREAM_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 250, 700];

async function sleep(ms: number) {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const postUrl =
      typeof body?.postUrl === 'string' ? body.postUrl.trim() : '';
    const payloadFromClient =
      body?.payload &&
      typeof body.payload === 'object' &&
      !Array.isArray(body.payload)
        ? body.payload
        : null;

    if (!postUrl || !/^https?:\/\//i.test(postUrl)) {
      return NextResponse.json({ error: 'postUrl invÃ¡lida' }, { status: 400 });
    }
    if (!payloadFromClient) {
      return NextResponse.json({ error: 'payload invÃ¡lido' }, { status: 400 });
    }

    const allowedHosts = (process.env.TRACK_ALLOWED_HOSTS || '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    let postHost = '';
    try {
      postHost = new URL(postUrl).host.trim().toLowerCase();
    } catch {
      return NextResponse.json({ error: 'postUrl invÃ¡lida' }, { status: 400 });
    }

    if (allowedHosts.length > 0 && !allowedHosts.includes(postHost)) {
      return NextResponse.json(
        { error: `Host no permitido para tracking: ${postHost}` },
        { status: 403 }
      );
    }


    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const requestIp = forwardedFor.split(',')[0]?.trim() || '';

    const payload = {
      ...payloadFromClient,
      clientIP: payloadFromClient.clientIP ?? requestIp,
      agentuser: payloadFromClient.agentuser ?? userAgent,
      client_ip_address:
        payloadFromClient.client_ip_address ?? requestIp,
      client_user_agent:
        payloadFromClient.client_user_agent ?? userAgent,
      timestamp:
        payloadFromClient.timestamp ?? new Date().toISOString(),
      event_time:
        payloadFromClient.event_time ?? Math.floor(Date.now() / 1000)
    };

    let response: Response | null = null;
    let text = '';
    let lastError: unknown = null;

    for (let attempt = 0; attempt < MAX_UPSTREAM_ATTEMPTS; attempt += 1) {
      await sleep(RETRY_DELAYS_MS[attempt] ?? 0);
      try {
        response = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store'
        });
        text = await response.text();

        // Corta reintentos solo cuando el constructor devuelve 200.
        if (response.status === 200) {
          break;
        }
      } catch (error) {
        lastError = error;
        response = null;
        text = '';
      }
    }

    if (!response || response.status !== 200) {
      return NextResponse.json(
        {
          error: 'tracking_upstream_error',
          details: text || (lastError instanceof Error ? lastError.message : 'upstream_no_response')
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, details: text });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'tracking_internal_error',
        details: error instanceof Error ? error.message : 'unknown_error'
      },
      { status: 500 }
    );
  }
}
