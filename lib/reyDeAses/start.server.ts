import { createClient } from "@supabase/supabase-js";
import type { AssignedAdvisor, Api2ResolveAccountRequest, HandoffResult, ReyAccount, ResolvedPlayer, StartRequest } from "./contracts";
import { isDeviceId } from "./deviceId";
import { api2Readiness, createReyHandoff, resolveInternalChatPlayer, resolveReyAccount, ReyIntegrationError } from "./integrations.server";

type LandingRow = { id: string; name: string; user_id: string; workspace_currency: string; config: unknown; landing_config: unknown };
type AssignmentRow = { landing_id: string; atrio_client_id: string; user_id: string };
type AdvisorRow = { id: string; user_id: string; workspace_currency: string; slug: string; atrio_id: string };

export type StartDb = {
  landing(id: string): Promise<LandingRow | null>;
  assignment(landingId: string, atrioClientId: string): Promise<AssignmentRow | null>;
  advisor(atrioClientId: string): Promise<AdvisorRow | null>;
  blocked(userId: string): Promise<boolean>;
};

export type StartDependencies = {
  db: StartDb;
  api2Status(): "api2_not_configured" | "integration_pending" | null;
  resolvePlayer(advisor: AssignedAdvisor, deviceId: string, name: string): Promise<ResolvedPlayer>;
  resolveAccount(request: Api2ResolveAccountRequest): Promise<ReyAccount>;
  createHandoff(advisor: AssignedAdvisor, deviceId: string, player: ResolvedPlayer, account: ReyAccount): Promise<HandoffResult>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,159}$/i;
const ADVISOR_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,80}$/i;
const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbp", "fbc", "referrer"] as const;

function json(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function parsePayload(value: unknown): StartRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  if (!UUID_PATTERN.test(String(data.landing_id ?? "")) || !SLUG_PATTERN.test(String(data.landing_slug ?? "")) ||
      !UUID_PATTERN.test(String(data.atrio_client_id ?? "")) || !UUID_PATTERN.test(String(data.advisor_id ?? "")) ||
      !isDeviceId(data.device_id) || !ADVISOR_SLUG_PATTERN.test(String(data.advisor_slug ?? "")) ||
      !name || name.length > 80 || /[\x00-\x1f\x7f]/.test(name)) return null;
  const promo = typeof data.promo_code === "string" ? data.promo_code.trim() : "";
  if (!promo || promo.length > 128 || /[\x00-\x1f\x7f]/.test(promo)) return null;
  const rawAttribution = data.attribution;
  if (rawAttribution !== undefined && (!rawAttribution || typeof rawAttribution !== "object" || Array.isArray(rawAttribution))) return null;
  const attribution: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const field = (rawAttribution as Record<string, unknown> | undefined)?.[key];
    if (field !== undefined && (typeof field !== "string" || field.length > 500 || /[\x00-\x1f\x7f]/.test(field))) return null;
    if (field) attribution[key] = field;
  }
  return {
    landing_id: String(data.landing_id), landing_slug: String(data.landing_slug), name,
    device_id: String(data.device_id), atrio_client_id: String(data.atrio_client_id),
    advisor_id: String(data.advisor_id), advisor_slug: String(data.advisor_slug),
    promo_code: promo, attribution,
  };
}

function isTemplate7Landing(landing: LandingRow): boolean {
  const raw = landing.config && typeof landing.config === "object" ? landing.config as Record<string, unknown> : {};
  const published = landing.landing_config && typeof landing.landing_config === "object"
    ? landing.landing_config as Record<string, unknown> : {};
  const layout = published.layout && typeof published.layout === "object" ? published.layout as Record<string, unknown> : {};
  return (raw.template === "template7" || layout.template === 7) && raw.ctaDestination === "atrio";
}

async function bounded<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), 7000);
    })]);
  } finally { if (timer) clearTimeout(timer); }
}

export async function handleReyStart(request: Request, deps: StartDependencies): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) return json({ error: "invalid_request" }, 415);
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "invalid_request" }, 403);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return json({ error: "invalid_request" }, 413);
  let payload: StartRequest | null = null;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 4096) return json({ error: "invalid_request" }, 413);
    payload = parsePayload(JSON.parse(raw));
  } catch { return json({ error: "invalid_request" }, 400); }
  if (!payload) return json({ error: "invalid_request" }, 400);

  try {
    const landing = await bounded(deps.db.landing(payload.landing_id));
    if (!landing || landing.name !== payload.landing_slug || !isTemplate7Landing(landing)) return json({ error: "landing_not_found" }, 404);
    if (await bounded(deps.db.blocked(landing.user_id))) return json({ error: "landing_unavailable" }, 403);
    const assignment = await bounded(deps.db.assignment(landing.id, payload.atrio_client_id));
    const advisor = assignment ? await bounded(deps.db.advisor(assignment.atrio_client_id)) : null;
    if (!assignment || !advisor || assignment.user_id !== landing.user_id || advisor.user_id !== landing.user_id ||
        advisor.workspace_currency !== landing.workspace_currency || advisor.id !== payload.atrio_client_id ||
        advisor.atrio_id !== payload.advisor_id || advisor.slug !== payload.advisor_slug) {
      return json({ error: "advisor_not_assigned" }, 403);
    }
    const assigned: AssignedAdvisor = { atrioClientId: advisor.id, advisorId: advisor.atrio_id, advisorSlug: advisor.slug };
    const pending = deps.api2Status();
    if (pending) return json({ error: pending }, 503);
    const player = await deps.resolvePlayer(assigned, payload.device_id, payload.name);
    if (player.advisor_id !== assigned.advisorId || player.advisor_slug !== assigned.advisorSlug || !isDeviceId(player.player_id)) throw new ReyIntegrationError("upstream_unavailable");
    const account = await deps.resolveAccount({ external_user_id: player.player_id, name: payload.name, advisor_id: assigned.advisorId });
    if (!account.username || !account.password || account.platform !== "rey_de_ases") throw new ReyIntegrationError("upstream_unavailable");
    const handoff = await deps.createHandoff(assigned, payload.device_id, player, account);
    return json({ handoff_url: handoff.handoff_url }, 200);
  } catch (error) {
    if (error instanceof ReyIntegrationError) return json({ error: error.code }, 503);
    return json({ error: "service_unavailable" }, 503);
  }
}

function productionDb(): StartDb {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("server database unavailable");
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return {
    async landing(id) {
      const { data, error } = await supabase.from("landings").select("id,name,user_id,workspace_currency,config,landing_config").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as LandingRow | null;
    },
    async assignment(landingId, atrioClientId) {
      const { data, error } = await supabase.from("landings_atrio_clients").select("landing_id,atrio_client_id,user_id")
        .eq("landing_id", landingId).eq("atrio_client_id", atrioClientId).maybeSingle();
      if (error) throw error;
      return data as AssignmentRow | null;
    },
    async advisor(atrioClientId) {
      const { data, error } = await supabase.from("atrio_clients").select("id,user_id,workspace_currency,slug,atrio_id").eq("id", atrioClientId).maybeSingle();
      if (error) throw error;
      return data as AdvisorRow | null;
    },
    async blocked(userId) {
      const { data, error } = await supabase.rpc("is_client_access_blocked", { p_user_id: userId });
      if (error) throw error;
      return data === true;
    },
  };
}

export function productionDependencies(): StartDependencies {
  return {
    db: productionDb(),
    api2Status: api2Readiness,
    resolvePlayer: resolveInternalChatPlayer,
    resolveAccount: resolveReyAccount,
    createHandoff: createReyHandoff,
  };
}
