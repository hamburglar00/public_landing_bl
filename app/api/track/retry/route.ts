import { NextRequest, NextResponse } from 'next/server';
import {
  claimPendingTrackEvents,
  markTrackEventDelivered,
  scheduleTrackEventRetry
} from '@/lib/tracking/queue';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { deliverToUpstream } from '@/lib/tracking/upstream';

async function getTrackingRetrySecret() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('cron_config')
      .select('value')
      .eq('key', 'tracking_retry_secret')
      .maybeSingle();

    if (error) return '';
    const value = typeof data?.value === 'string' ? data.value.trim() : '';
    if (!value || value.startsWith('REPLACE_')) return '';
    return value;
  } catch {
    return '';
  }
}

async function isAuthorized(req: NextRequest, bodySecret?: unknown) {
  const secret = (
    process.env.TRACK_RETRY_SECRET ||
    process.env.CRON_SECRET ||
    ''
  ).trim();

  const header = req.headers.get('x-retry-secret') || '';
  const auth = req.headers.get('authorization') || '';
  const bearer = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : '';
  const bodyCronSecret = typeof bodySecret === 'string' ? bodySecret.trim() : '';

  if (secret && (header === secret || bearer === secret || bodyCronSecret === secret)) {
    return true;
  }

  const cronConfigSecret = await getTrackingRetrySecret();
  if (!cronConfigSecret) return false;

  return (
    header === cronConfigSecret ||
    bearer === cronConfigSecret ||
    bodyCronSecret === cronConfigSecret
  );
}

async function processRetry(req: NextRequest, requestedLimit?: number, bodySecret?: unknown) {
  if (!(await isAuthorized(req, bodySecret))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const limit =
    typeof requestedLimit === 'number' &&
    requestedLimit > 0 &&
    requestedLimit <= 200
      ? requestedLimit
      : 50;

  const items = await claimPendingTrackEvents(limit);
  if (!items.length) {
    return NextResponse.json({ ok: true, processed: 0, delivered: 0, retry: 0 });
  }

  let delivered = 0;
  let retry = 0;

  for (const item of items) {
    const result = await deliverToUpstream(item.post_url, item.payload, 2);
    if (result.ok) {
      delivered += 1;
      await markTrackEventDelivered(item.id);
      continue;
    }

    retry += 1;
    await scheduleTrackEventRetry({
      id: item.id,
      attemptCount: item.attempt_count,
      reason: result.details,
      upstreamStatus: result.upstreamStatus
    });
  }

  return NextResponse.json({
    ok: true,
    processed: items.length,
    delivered,
    retry
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return processRetry(req, body?.limit, body?.cron_secret);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fromQuery = Number(url.searchParams.get('limit') || '');
  return processRetry(req, Number.isFinite(fromQuery) ? fromQuery : undefined);
}
