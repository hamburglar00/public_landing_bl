// GENERATED SERVER-ONLY issuer from landing-builder. Run scripts/build-classic-preparation.mjs --write there. No environment values are embedded.
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/reyDeAses/classic-preparation-issue.server.ts
var classic_preparation_issue_server_exports = {};
__export(classic_preparation_issue_server_exports, {
  handleClassicTemplate7Prepare: () => handleClassicTemplate7Prepare
});
module.exports = __toCommonJS(classic_preparation_issue_server_exports);

// lib/reyDeAses/clientIdentity.server.ts
var CLIENT_ID_COOKIE_NAME = "lb_cid";
var CLIENT_ID_MAX_AGE_SECONDS = 63072e3;
var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isDeviceId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
function getOrCreateClientIdentity(request) {
  const matches = (request.headers.get("cookie") || "").split(";").map((part) => part.trim()).filter((part) => part.startsWith(`${CLIENT_ID_COOKIE_NAME}=`)).map((part) => part.slice(CLIENT_ID_COOKIE_NAME.length + 1));
  if (matches.length === 1 && isDeviceId(matches[0])) {
    return { deviceId: matches[0], needsCookie: false };
  }
  return { deviceId: crypto.randomUUID(), needsCookie: true };
}
function withClientIdentityCookie(response, identity, production = process.env.NODE_ENV === "production") {
  response.headers.set("Cache-Control", "no-store");
  if (identity.needsCookie) {
    const secure = production ? "; Secure" : "";
    response.headers.append(
      "Set-Cookie",
      `${CLIENT_ID_COOKIE_NAME}=${identity.deviceId}; Max-Age=${CLIENT_ID_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}; Priority=High`
    );
  }
  return response;
}

// lib/reyDeAses/preparation-issue.server.ts
var import_node_crypto = require("node:crypto");
var import_node_net = require("node:net");

// lib/multi-skin-origins.ts
var MULTI_SKIN_SUBDOMAINS = {
  ganamos_plus: "ganamosplus",
  jugamos: "jugamos",
  casino_zeus: "casinozeus",
  bet30: "bet30",
  gana_en_casa: "ganaencasa",
  celu_apuestas: "celuapuestas",
  casino_zeta: "casinozeta",
  oro_puro: "oropuro",
  fortu_bet: "fortubet",
  gran_poseidon: "granposeidon",
  kona_bet: "konabet",
  mega_faraon: "megafaraon",
  camel_bet: "camelbet",
  rhino_play: "rhinoplay"
};
function multiSkinBaseDomain(value) {
  if (!value?.trim()) return null;
  const domain = value.trim().toLowerCase();
  if (domain.length > 230 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/.test(domain))
    throw new Error("MULTI_SKIN_GATEWAY_BASE_DOMAIN debe ser un dominio sin protocolo ni ruta.");
  return domain;
}
function multiSkinGatewayOrigin(skin, domain) {
  const base = multiSkinBaseDomain(domain);
  return base && typeof skin === "string" && Object.hasOwn(MULTI_SKIN_SUBDOMAINS, skin) ? `https://${MULTI_SKIN_SUBDOMAINS[skin]}.${base}` : null;
}

// lib/reyDeAses/gatewayOrigins.ts
function gatewayOriginFor(provider, skinCode, env = process.env) {
  if (provider === "multi_skin") {
    const origin = multiSkinGatewayOrigin(skinCode, env.MULTI_SKIN_GATEWAY_BASE_DOMAIN);
    if (origin) return origin;
    return skinCode === "ganamos_plus" && env.GANAMOS_PLUS_GATEWAY_ORIGIN ? env.GANAMOS_PLUS_GATEWAY_ORIGIN : env.MULTI_SKIN_GATEWAY_ORIGIN;
  }
  if (provider === "ases_del_norte") return env.ASES_DEL_NORTE_GATEWAY_ORIGIN;
  if (provider === "ganamos_net") return env.GANAMOS_NET_GATEWAY_ORIGIN;
  return env.REY_GATEWAY_ORIGIN;
}

// lib/landing/entryFunnel.ts
var ENTRY_FUNNEL_ORIGINS = ["https://landing.panelbotadmin.com", "https://mkt.panelbotadmin.com", "https://nexobet.fun"];
var uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var record = (value) => !!value && typeof value === "object" && !Array.isArray(value);
function entryFunnelProvenance(value) {
  if (value.engine !== void 0 && (typeof value.engine !== "string" || !["classic", "constructor", "nexobet"].includes(value.engine)) || value.release !== void 0 && (typeof value.release !== "string" || !/^[0-9a-f]{7,40}$/.test(value.release)) || value.environment !== void 0 && (typeof value.environment !== "string" || !["production", "preview", "development", "unknown"].includes(value.environment)) || value.source !== void 0 && (typeof value.source !== "string" || !["synthetic", "unknown"].includes(value.source)) || value.entry_strategy !== void 0 && (typeof value.entry_strategy !== "string" || !["sequential", "combined_login"].includes(value.entry_strategy))) return null;
  return {
    ...value.engine !== void 0 ? { engine: value.engine } : {},
    ...value.release !== void 0 ? { release: value.release } : {},
    ...value.environment !== void 0 ? { environment: value.environment } : {},
    ...value.source !== void 0 ? { source: value.source } : {},
    ...value.entry_strategy !== void 0 ? { entry_strategy: value.entry_strategy } : {}
  };
}
function validAttempt(value) {
  return (value.attempt_id === void 0 && value.attempt_number === void 0 || typeof value.attempt_id === "string" && uuid.test(value.attempt_id) && Number.isInteger(value.attempt_number) && Number(value.attempt_number) >= 1 && Number(value.attempt_number) <= 1e3) && (value.account_kind === void 0 || value.account_kind === "new" || value.account_kind === "existing");
}
function validateEntryFunnelContext(value, now = Date.now()) {
  if (!record(value) || !uuid.test(String(value.landing_id)) || !uuid.test(String(value.flow_id)) || ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(value.template)) || typeof value.template !== "number" || !ENTRY_FUNNEL_ORIGINS.includes(String(value.telemetry_origin)) || typeof value.started_at !== "number" || !Number.isSafeInteger(value.started_at) || value.started_at > now + 6e4 || value.started_at < now - 864e5 || !validAttempt(value) || !entryFunnelProvenance(value) || value.navigation_id !== void 0 && (typeof value.navigation_id !== "string" || !uuid.test(value.navigation_id))) return null;
  return {
    ...entryFunnelProvenance(value),
    landing_id: String(value.landing_id),
    flow_id: String(value.flow_id),
    template: value.template,
    telemetry_origin: String(value.telemetry_origin),
    started_at: value.started_at,
    ...value.attempt_id ? { attempt_id: String(value.attempt_id), attempt_number: Number(value.attempt_number) } : {},
    ...value.account_kind ? { account_kind: value.account_kind } : {},
    ...value.navigation_id ? { navigation_id: String(value.navigation_id) } : {}
  };
}

// lib/landing/argentinaWhatsapp.ts
function normalizeArgentinaWhatsapp(rawValue) {
  let digits = String(rawValue ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  let national = digits;
  if (digits.startsWith("54")) national = digits.slice(2);
  else if (digits.startsWith("9") && digits.length === 11) national = digits.slice(1);
  national = national.replace(/^0+/, "");
  if (national.startsWith("9") && national.length === 11) national = national.slice(1);
  if (national.length === 12) {
    for (const areaLength of [2, 3, 4]) {
      if (national.slice(areaLength, areaLength + 2) !== "15") continue;
      const withoutMobilePrefix = `${national.slice(0, areaLength)}${national.slice(areaLength + 2)}`;
      if (withoutMobilePrefix.length === 10) {
        national = withoutMobilePrefix;
        break;
      }
    }
  }
  return /^[1-9]\d{9}$/.test(national) ? `549${national}` : "";
}

// lib/reyDeAses/start-payload.server.ts
var UUID_PATTERN2 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,159}$/i;
var ADVISOR_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,80}$/i;
var ATTRIBUTION_KEYS = ["landing", "landing_resolution", "facebook", "portofolio", "cp", "campana", "conjunto", "anuncio", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbp", "fbc", "referrer", "target_provider", "skin_code", "card_index"];
function parseTemplate7StartPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value;
  const funnel = validateEntryFunnelContext(data.entry_funnel);
  if (data.card_index !== void 0 && (!Number.isInteger(data.card_index) || Number(data.card_index) < 1 || Number(data.card_index) > 6)) return null;
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  if (!UUID_PATTERN2.test(String(data.landing_id ?? "")) || !SLUG_PATTERN.test(String(data.landing_slug ?? "")) || !UUID_PATTERN2.test(String(data.atrio_client_id ?? "")) || !UUID_PATTERN2.test(String(data.advisor_id ?? "")) || !ADVISOR_SLUG_PATTERN.test(String(data.advisor_slug ?? "")) || !name || name.length > 80 || /[\x00-\x1f\x7f]/.test(name)) return null;
  const promo = typeof data.promo_code === "string" ? data.promo_code.trim() : "";
  if (!promo || promo.length > 128 || /[\x00-\x1f\x7f]/.test(promo)) return null;
  if (data.phone !== void 0 && (typeof data.phone !== "string" || data.phone.length > 32)) return null;
  const phone = typeof data.phone === "string" ? normalizeArgentinaWhatsapp(data.phone) : "";
  const rawAttribution = data.attribution;
  if (rawAttribution !== void 0 && (!rawAttribution || typeof rawAttribution !== "object" || Array.isArray(rawAttribution))) return null;
  const attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const field = rawAttribution?.[key];
    if (field !== void 0 && (typeof field !== "string" || field.length > 500 || /[\x00-\x1f\x7f]/.test(field))) return null;
    if (key === "landing_resolution" && field && !["url_parameter", "path", "automatic"].includes(String(field))) return null;
    if (field) attribution[key] = field;
  }
  return {
    ...funnel && funnel.landing_id === data.landing_id ? { entry_funnel: funnel } : {},
    ...data.card_index !== void 0 ? { card_index: Number(data.card_index) } : {},
    landing_id: String(data.landing_id),
    landing_slug: String(data.landing_slug),
    name,
    atrio_client_id: String(data.atrio_client_id),
    advisor_id: String(data.advisor_id),
    advisor_slug: String(data.advisor_slug),
    promo_code: promo,
    ...phone ? { phone } : {},
    attribution
  };
}

// lib/multi-skin-catalog.ts
var MULTI_SKIN_CATALOG = {
  ganamos_plus: { name: "Ganamos+", origin: "https://ganamosbet.plus" },
  jugamos: { name: "Jugamos", origin: "https://jugamos1.lat" },
  casino_zeus: { name: "Casino Zeus", origin: "https://casinozeus1.plus" },
  bet30: { name: "Bet30", origin: "https://bet30e.lat" },
  gana_en_casa: { name: "Gana En Casa", origin: "https://ganaencasabet.lat" },
  celu_apuestas: { name: "CeluApuestas", origin: "https://celuapuestas1.lat" },
  casino_zeta: { name: "CasinoZeta", origin: "https://casinozeta1.lat" },
  oro_puro: { name: "OroPuro", origin: "https://oropuro.bet" },
  fortu_bet: { name: "FortuBet", origin: "https://fortubet.cc" },
  gran_poseidon: { name: "Gran Poseidon", origin: "https://granposeidon.plus" },
  kona_bet: { name: "Konabet", origin: "https://konabet.plus" },
  mega_faraon: { name: "MegaFaraon", origin: "https://megafaraon.plus" },
  camel_bet: { name: "CamelBet", origin: "https://camelbet.icu" },
  rhino_play: { name: "RhinoPlay", origin: "https://rhinoplay.xyz" }
};
var MULTI_SKIN_CODES = Object.keys(MULTI_SKIN_CATALOG);
function isMultiSkinCode(value) {
  return typeof value === "string" && Object.hasOwn(MULTI_SKIN_CATALOG, value);
}

// lib/reyDeAses/preparation-issue.server.ts
var TOKEN_VERSION = "p1";
var TOKEN_AAD = "landing-builder:template7-preparation:v1";
var TOKEN_TTL_SECONDS = 5 * 60;
var MAX_REQUEST_BYTES = 4096;
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}
function validJsonRequest(request) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
    return json({ error: "invalid_request" }, 415);
  }
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "invalid_request" }, 403);
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  return contentLength > MAX_REQUEST_BYTES ? json({ error: "invalid_request" }, 413) : null;
}
async function readJson(request, maxBytes = MAX_REQUEST_BYTES) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > maxBytes) throw new Error("request_too_large");
  return JSON.parse(raw);
}
function requireSecret(name, env) {
  const value = env[name] || "";
  if (Buffer.byteLength(value) < 32) throw new Error(`${name} unavailable`);
  return value;
}
function encryptionKey(env) {
  return (0, import_node_crypto.createHash)("sha256").update(requireSecret("TEMPLATE7_PREPARATION_TOKEN_KEY", env), "utf8").digest();
}
function clientIp(request) {
  for (const header of ["x-vercel-forwarded-for", "cf-connecting-ip", "x-real-ip", "x-forwarded-for"]) {
    const first = (request.headers.get(header) || "").split(",")[0]?.trim() || "";
    if ((0, import_node_net.isIP)(first)) return first;
  }
  return null;
}
function encryptClaims(claims, env) {
  const iv = (0, import_node_crypto.randomBytes)(12);
  const cipher = (0, import_node_crypto.createCipheriv)("aes-256-gcm", encryptionKey(env), iv);
  cipher.setAAD(Buffer.from(TOKEN_AAD));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(claims), "utf8"),
    cipher.final()
  ]);
  return [TOKEN_VERSION, iv.toString("base64url"), ciphertext.toString("base64url"), cipher.getAuthTag().toString("base64url")].join(".");
}
function gatewayOrigin(payload, env) {
  const raw = gatewayOriginFor(payload.attribution?.target_provider, payload.attribution?.skin_code, env) || "";
  const url = new URL(raw);
  const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  if (!local && url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("gateway unavailable");
  }
  return url.origin;
}
async function handleTemplate7Prepare(request, env = process.env, now = Date.now()) {
  const invalid = validJsonRequest(request);
  if (invalid) return invalid;
  const identity = getOrCreateClientIdentity(request);
  try {
    const payload = parseTemplate7StartPayload(await readJson(request));
    if (!payload) return withClientIdentityCookie(json({ error: "invalid_request" }, 400), identity);
    const issuedAt = Math.floor(now / 1e3);
    const token = encryptClaims({
      version: 1,
      issued_at: issuedAt,
      expires_at: issuedAt + TOKEN_TTL_SECONDS,
      payload,
      identity,
      client_ip: clientIp(request)
    }, env);
    const destination = new URL("/prepare", gatewayOrigin(payload, env));
    destination.searchParams.set("t", token);
    const skin = payload.attribution?.skin_code;
    if (payload.attribution?.target_provider === "multi_skin" && isMultiSkinCode(skin) && skin !== "ganamos_plus")
      destination.searchParams.set("skin", skin);
    return withClientIdentityCookie(json({ handoff_url: destination.toString() }, 200), identity);
  } catch {
    return withClientIdentityCookie(json({ error: "service_unavailable" }, 503), identity);
  }
}

// lib/reyDeAses/classic-preparation-issue.server.ts
async function handleClassicTemplate7Prepare(request, env = process.env, now = Date.now()) {
  const invalid = validJsonRequest(request);
  if (invalid) return invalid;
  let body;
  try {
    body = await readJson(request);
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const deviceId = body && typeof body === "object" && !Array.isArray(body) ? Reflect.get(body, "device_id") : null;
  if (!isDeviceId(deviceId)) return json({ error: "invalid_request" }, 400);
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.set("cookie", `${CLIENT_ID_COOKIE_NAME}=${deviceId}`);
  return handleTemplate7Prepare(new Request(request.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  }), env, now);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleClassicTemplate7Prepare
});
