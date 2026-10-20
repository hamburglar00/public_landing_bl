import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { createClient } from "@supabase/supabase-js";
import type {
  Api2ResolveAccountRequest,
  AssignedAdvisor,
  HandoffResult,
  LinkedProviderAccount,
  MultiSkinCode,
  PlayerResolveRequest,
  ResolvedPlayer,
  StartRequest,
  TargetAccount,
  TargetProvider,
} from "./contracts";
import { isDeviceId } from "./deviceId";
import {
  api2Readiness,
  createProviderHandoff,
  gatewayReadiness,
  linkInternalChatProviderAccount,
  resolveInternalChatPlayer,
  resolveTargetAccount,
  TargetIntegrationError,
} from "./integrations.server";
import { normalizeArgentinaWhatsapp } from "../landing/argentinaWhatsapp";

type LandingRow = { id: string; name: string; user_id: string; workspace_currency: string; config: unknown; landing_config: unknown };
type AssignmentRow = { landing_id: string; atrio_client_id: string; user_id: string };
type AdvisorRow = { id: string; user_id: string; workspace_currency: string; slug: string; atrio_id: string };
type ContextStatus = "ok" | "landing_not_found" | "integration_pending" | "landing_unavailable" | "rate_limited" | "advisor_not_assigned";
type ResolvedContext = { status: ContextStatus; landing?: LandingRow; provider?: TargetProvider; advisor?: AdvisorRow };

export type StartDb = {
  landing(id: string): Promise<LandingRow | null>;
  assignment(landingId: string, atrioClientId: string): Promise<AssignmentRow | null>;
  advisor(atrioClientId: string): Promise<AdvisorRow | null>;
  blocked(userId: string): Promise<boolean>;
  context?(request: Request, payload: StartRequest): Promise<ResolvedContext>;
};

export type StartDependencies = {
  db: StartDb;
  api2Status(): "api2_not_configured" | "integration_pending" | null;
  gatewayStatus?(provider: TargetProvider): "integration_pending" | null;
  resolvePlayer(input: PlayerResolveRequest): Promise<ResolvedPlayer>;
  resolveAccount(request: Api2ResolveAccountRequest): Promise<TargetAccount>;
  linkProviderAccount?(advisor: AssignedAdvisor, player: ResolvedPlayer, account: TargetAccount): Promise<LinkedProviderAccount>;
  createHandoff(provider: TargetProvider, advisor: AssignedAdvisor, deviceId: string, player: ResolvedPlayer, account: TargetAccount, skinCode: MultiSkinCode | null, promoCode?: string): Promise<HandoffResult>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,159}$/i;
const ADVISOR_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,80}$/i;
const ATTRIBUTION_KEYS = ["landing", "landing_resolution", "facebook", "portofolio", "cp", "campana", "conjunto", "anuncio", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbp", "fbc", "referrer"] as const;

function json(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: {
    "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
  } });
}

export function parsePayload(value: unknown): StartRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  if (!UUID_PATTERN.test(String(data.landing_id ?? "")) || !SLUG_PATTERN.test(String(data.landing_slug ?? "")) ||
      !UUID_PATTERN.test(String(data.atrio_client_id ?? "")) || !UUID_PATTERN.test(String(data.advisor_id ?? "")) ||
      !isDeviceId(data.device_id) || !ADVISOR_SLUG_PATTERN.test(String(data.advisor_slug ?? "")) ||
      !name || name.length > 80 || /[\x00-\x1f\x7f]/.test(name)) return null;
  const promo = typeof data.promo_code === "string" ? data.promo_code.trim() : "";
  if (!promo || promo.length > 128 || /[\x00-\x1f\x7f]/.test(promo)) return null;
  if (data.phone !== undefined && (typeof data.phone !== "string" || data.phone.length > 32)) return null;
  const phone = typeof data.phone === "string" ? normalizeArgentinaWhatsapp(data.phone) : "";
  if (data.attribution !== undefined && (!data.attribution || typeof data.attribution !== "object" || Array.isArray(data.attribution))) return null;
  const attribution: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const field = (data.attribution as Record<string, unknown> | undefined)?.[key];
    if (field !== undefined && (typeof field !== "string" || field.length > 500 || /[\x00-\x1f\x7f]/.test(field))) return null;
    if (key === "landing_resolution" && field && !["url_parameter", "path", "automatic"].includes(String(field))) return null;
    if (field) attribution[key] = field;
  }
  return {
    landing_id: String(data.landing_id), landing_slug: String(data.landing_slug), name,
    device_id: String(data.device_id), atrio_client_id: String(data.atrio_client_id),
    advisor_id: String(data.advisor_id), advisor_slug: String(data.advisor_slug), promo_code: promo,
    ...(phone ? { phone } : {}), attribution,
  };
}

function rawConfig(landing: LandingRow) {
  return landing.config && typeof landing.config === "object" ? landing.config as Record<string, unknown> : {};
}

export function isTemplate7Landing(landing: LandingRow): boolean {
  const raw = rawConfig(landing);
  const published = landing.landing_config && typeof landing.landing_config === "object" ? landing.landing_config as Record<string, unknown> : {};
  const layout = published.layout && typeof published.layout === "object" ? published.layout as Record<string, unknown> : {};
  return (raw.template === "template7" || layout.template === 7) && raw.ctaDestination === "atrio";
}

export function configuredProvider(landing: LandingRow): TargetProvider | null {
  const provider = rawConfig(landing).targetProvider;
  if (provider === undefined || provider === null) return "rey_de_ases";
  return provider === "rey_de_ases" || provider === "multi_skin" || provider === "ases_del_norte" || provider === "ganamos_net" ? provider : null;
}

function configuredSkin(landing: LandingRow, provider: TargetProvider): MultiSkinCode | null {
  if (provider !== "multi_skin") return null;
  const skin = rawConfig(landing).multiSkinCode;
  return skin === undefined || skin === null || skin === "ganamos_plus" ? "ganamos_plus" : null;
}

async function bounded<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), 7000); })]);
  } finally { if (timer) clearTimeout(timer); }
}

export async function handleTemplate7Start(request: Request, deps: StartDependencies): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) return json({ error: "invalid_request" }, 415);
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "invalid_request" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 4096) return json({ error: "invalid_request" }, 413);
  let payload: StartRequest | null = null;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 4096) return json({ error: "invalid_request" }, 413);
    payload = parsePayload(JSON.parse(raw));
  } catch { return json({ error: "invalid_request" }, 400); }
  if (!payload) return json({ error: "invalid_request" }, 400);

  try {
    let landing: LandingRow;
    let provider: TargetProvider;
    let advisor: AdvisorRow;
    if (deps.db.context) {
      const context = await bounded(deps.db.context(request, payload));
      if (context.status !== "ok" || !context.landing || !context.provider || !context.advisor) {
        const status = context.status === "landing_not_found" ? 404
          : context.status === "landing_unavailable" || context.status === "advisor_not_assigned" ? 403
            : context.status === "rate_limited" ? 429 : 503;
        return json({ error: context.status }, status);
      }
      landing = context.landing;
      provider = context.provider;
      advisor = context.advisor;
    } else {
      const candidate = await bounded(deps.db.landing(payload.landing_id));
      if (!candidate || candidate.name !== payload.landing_slug || !isTemplate7Landing(candidate)) return json({ error: "landing_not_found" }, 404);
      const selectedProvider = configuredProvider(candidate);
      if (!selectedProvider) return json({ error: "integration_pending" }, 503);
      landing = candidate;
      provider = selectedProvider;
      if (await bounded(deps.db.blocked(landing.user_id))) return json({ error: "landing_unavailable" }, 403);
      const assignment = await bounded(deps.db.assignment(landing.id, payload.atrio_client_id));
      const selectedAdvisor = assignment ? await bounded(deps.db.advisor(assignment.atrio_client_id)) : null;
      if (!assignment || !selectedAdvisor || assignment.user_id !== landing.user_id || selectedAdvisor.user_id !== landing.user_id ||
          selectedAdvisor.workspace_currency !== landing.workspace_currency || selectedAdvisor.id !== payload.atrio_client_id ||
          selectedAdvisor.atrio_id !== payload.advisor_id || selectedAdvisor.slug !== payload.advisor_slug) {
        return json({ error: "advisor_not_assigned" }, 403);
      }
      advisor = selectedAdvisor;
    }

    const skinCode = configuredSkin(landing, provider);
    if (provider === "multi_skin" && !skinCode) return json({ error: "integration_pending" }, 503);
    if (deps.gatewayStatus?.(provider)) return json({ error: "integration_pending" }, 503);
    const assigned: AssignedAdvisor = { atrioClientId: advisor.id, advisorId: advisor.atrio_id, advisorSlug: advisor.slug };
    const pending = deps.api2Status();
    if (pending) return json({ error: pending }, 503);
    const effectiveDeviceId = payload.device_id;
    const playerInput: PlayerResolveRequest = {
      advisor: assigned, deviceId: effectiveDeviceId, name: payload.name, ...(payload.phone ? { phone: payload.phone } : {}),
      landingId: landing.id, landingSlug: landing.name, promoCode: payload.promo_code, targetProvider: provider,
    };
    const player = await deps.resolvePlayer(playerInput);
    if (player.target_provider !== provider || player.device_id !== effectiveDeviceId) throw new TargetIntegrationError("upstream_unavailable");
    const account = await deps.resolveAccount({
      external_user_id: player.player_id,
          manager_id: player.manager_id, agency_id:player.agency_id, name: payload.name, advisor_id: assigned.advisorId,
      advisor_slug: assigned.advisorSlug, target_provider: provider, ...(skinCode ? { skin_code: skinCode } : {}),
    });
    const [, handoff] = await Promise.all([
      deps.linkProviderAccount?.(assigned, player, account),
      deps.createHandoff(provider, assigned, effectiveDeviceId, player, account, skinCode, payload.promo_code),
    ]);
    return json({ handoff_url: handoff.handoff_url }, 200);
  } catch (error) {
    if (error instanceof TargetIntegrationError) return json({ error: error.code }, 503);
    return json({ error: "service_unavailable" }, 503);
  }
}

export const handleReyStart = handleTemplate7Start;

function clientIp(request: Request) {
  for (const header of ["x-vercel-forwarded-for", "cf-connecting-ip", "x-real-ip", "x-forwarded-for"]) {
    const first = request.headers.get(header)?.split(",")[0]?.trim() ?? "";
    if (isIP(first)) return first;
  }
  return "unknown";
}

function productionDb(): StartDb {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("server database unavailable");
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const bucket = (value: string) => createHmac("sha256", process.env.TEMPLATE7_RATE_LIMIT_HMAC_KEY || key).update(value).digest("hex");
  return {
    async landing(id) { const { data, error } = await supabase.from("landings").select("id,name,user_id,workspace_currency,config,landing_config").eq("id", id).maybeSingle(); if (error) throw error; return data as LandingRow | null; },
    async assignment(landingId, atrioClientId) { const { data, error } = await supabase.from("landings_atrio_clients").select("landing_id,atrio_client_id,user_id").eq("landing_id", landingId).eq("atrio_client_id", atrioClientId).maybeSingle(); if (error) throw error; return data as AssignmentRow | null; },
    async advisor(atrioClientId) { const { data, error } = await supabase.from("atrio_clients").select("id,user_id,workspace_currency,slug,atrio_id").eq("id", atrioClientId).maybeSingle(); if (error) throw error; return data as AdvisorRow | null; },
    async blocked(userId) { const { data, error } = await supabase.rpc("is_client_access_blocked", { p_user_id: userId }); if (error) throw error; return data === true; },
    async context(request, payload) {
      const ip = clientIp(request);
      const { data, error } = await supabase.rpc("resolve_template7_start_context", {
        p_landing_id: payload.landing_id, p_landing_slug: payload.landing_slug,
        p_atrio_client_id: payload.atrio_client_id, p_advisor_id: payload.advisor_id, p_advisor_slug: payload.advisor_slug,
        p_global_bucket_key: bucket(`global-ip:${ip}`), p_start_bucket_key: bucket(`start:${payload.landing_id}:${payload.device_id}`),
        p_unbound_bucket_key: null,
      });
      if (error || !Array.isArray(data) || data.length !== 1) throw error || new Error("invalid start context");
      const row = data[0] as Record<string, unknown>;
      const status = String(row.status) as ContextStatus;
      if (status !== "ok") return { status };
      const selectedProvider = row.target_provider;
      if (selectedProvider !== "rey_de_ases" && selectedProvider !== "multi_skin" && selectedProvider !== "ases_del_norte" && selectedProvider !== "ganamos_net") throw new Error("invalid provider");
      return {
        status: "ok" as const, provider: selectedProvider,
        landing: { id: String(row.landing_id), name: String(row.landing_name), user_id: String(row.owner_user_id), workspace_currency: String(row.workspace_currency), config: row.landing_config_raw, landing_config: row.landing_config_published },
        advisor: { id: String(row.atrio_client_id), user_id: String(row.owner_user_id), workspace_currency: String(row.workspace_currency), slug: String(row.advisor_slug), atrio_id: String(row.advisor_id) },
      };
    },
  };
}

export function productionDependencies(): StartDependencies {
  return {
    db: productionDb(), api2Status: api2Readiness, gatewayStatus: gatewayReadiness,
    resolvePlayer: resolveInternalChatPlayer, resolveAccount: resolveTargetAccount,
    linkProviderAccount: linkInternalChatProviderAccount, createHandoff: createProviderHandoff,
  };
}
