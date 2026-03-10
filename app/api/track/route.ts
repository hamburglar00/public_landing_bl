import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ error: 'postUrl inválida' }, { status: 400 });
    }
    if (!payloadFromClient) {
      return NextResponse.json({ error: 'payload inválido' }, { status: 400 });
    }

    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const userAgent = req.headers.get('user-agent') || '';

    const payload = {
      ...payloadFromClient,
      clientIP: forwardedFor.split(',')[0]?.trim() || '',
      agentuser: userAgent,
      timestamp:
        payloadFromClient.timestamp ?? new Date().toISOString(),
      event_time:
        payloadFromClient.event_time ?? Math.floor(Date.now() / 1000)
    };

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'tracking_upstream_error', details: text },
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
