import { configuredProvider, isTemplate7Landing, parsePayload, productionDependencies } from '../../../../lib/reyDeAses/start.server';
import { allowTemplate7Warm } from '../../../../lib/reyDeAses/rateLimit.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body: object, status: number) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'invalid_request' }, 400);
  try {
    if (Number(request.headers.get('content-length')) > 2048) return json({ error: 'invalid_request' }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 2048) return json({ error: 'invalid_request' }, 413);
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !['device_id','landing_id','landing_slug','atrio_client_id','advisor_id','advisor_slug'].includes(key))) return json({ error: 'invalid_request' }, 400);
    const payload = parsePayload({ ...value, name: 'preparation', promo_code: 'preparation' });
    if (!payload) return json({ error: 'invalid_request' }, 400);
    if (!await allowTemplate7Warm(request, payload.device_id)) return json({ error: 'rate_limited' }, 429);
    const { db } = productionDependencies();
    const [landing, assignment, advisor] = await Promise.all([db.landing(payload.landing_id), db.assignment(payload.landing_id,payload.atrio_client_id), db.advisor(payload.atrio_client_id)]);
    if (!landing || landing.name !== payload.landing_slug || !isTemplate7Landing(landing) || !assignment || !advisor ||
      assignment.landing_id !== landing.id || assignment.atrio_client_id !== advisor.id || advisor.id !== payload.atrio_client_id ||
      assignment.user_id !== landing.user_id || advisor.user_id !== landing.user_id || advisor.workspace_currency !== landing.workspace_currency ||
      advisor.atrio_id !== payload.advisor_id || advisor.slug !== payload.advisor_slug || await db.blocked(landing.user_id)) return json({ error: 'unavailable' }, 403);
    const provider = configuredProvider(landing);
    if (!provider) return json({ error: 'unavailable' }, 503);
    const key = process.env.INTERNAL_CHAT_PLAYER_RESOLVE_KEY || process.env.INTERNAL_CHAT_GATEWAY_API_KEY;
    const origin = new URL(process.env.INTERNAL_CHAT_ORIGIN || '');
    if (!key || origin.protocol !== 'https:') return json({ error: 'unavailable' }, 503);
    const input = {advisor_id:advisor.atrio_id,advisor_slug:advisor.slug,device_id:payload.device_id,landing_id:landing.id,target_provider:provider};
    const existing = await fetch(new URL('/api/gateway/players/existing', origin), {
      method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
      cache:'no-store',redirect:'error',signal:AbortSignal.timeout(7000),body:JSON.stringify(input),
    });
    if (!existing.ok) return json({error:'preparation_unavailable'},503);
    const found = await existing.json();
    if (typeof found.existing_name === 'string' && typeof found.promo_code === 'string')
      return json({ready:true,existing_name:found.existing_name,promo_code:found.promo_code},200);
    const response = await fetch(new URL('/api/gateway/players/prepare',origin),{
      method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(7000),
      body:JSON.stringify(input),
    });
    if (!response.ok) return json({ error:'preparation_unavailable' },503);
    return json({ready:true},200);
  } catch { return json({error:'preparation_unavailable'},503); }
}
