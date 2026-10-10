import assert from "node:assert/strict";
import test from "node:test";
import { getOrCreateDeviceId, DEVICE_ID_COOKIE, DEVICE_ID_STORAGE_KEY } from "../lib/reyDeAses/deviceId";
import { handleReyStart, type StartDependencies } from "../lib/reyDeAses/start.server";
import { createReyHandoff, resolveInternalChatPlayer } from "../lib/reyDeAses/integrations.server";

const landingId = "11111111-1111-4111-8111-111111111111";
const clientId = "22222222-2222-4222-8222-222222222222";
const advisorId = "33333333-3333-4333-8333-333333333333";
const deviceId = "44444444-4444-4444-8444-444444444444";
const playerId = "55555555-5555-4555-8555-555555555555";
const ownerId = "66666666-6666-4666-8666-666666666666";

const validPayload = {
  landing_id: landingId, landing_slug: "landing-7", name: "Martín", device_id: deviceId,
  atrio_client_id: clientId, advisor_id: advisorId, advisor_slug: "gera", promo_code: "LP-a1b2",
  attribution: { utm_campaign: "campana", fbp: "fb.1.123.abc" },
};

function request(payload: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://example.com/api/rey-de-ases/start", {
    method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(payload),
  });
}

function dependencies(status: ReturnType<StartDependencies["api2Status"]> = null) {
  const calls: string[] = [];
  const deps: StartDependencies = {
    db: {
      async landing(id) { calls.push("landing"); return id === landingId ? {
        id: landingId, name: "landing-7", user_id: ownerId, workspace_currency: "ARS",
        config: { template: "template7", ctaDestination: "atrio" }, landing_config: { layout: { template: 7 } },
      } : null; },
      async blocked() { calls.push("plan"); return false; },
      async assignment(id, selectedClient) { calls.push("assignment"); return id === landingId && selectedClient === clientId
        ? { landing_id: landingId, atrio_client_id: clientId, user_id: ownerId } : null; },
      async advisor(id) { calls.push("advisor"); return id === clientId
        ? { id: clientId, user_id: ownerId, workspace_currency: "ARS", slug: "gera", atrio_id: advisorId } : null; },
    },
    api2Status() { calls.push("api2-readiness"); return status; },
    async resolvePlayer(advisor, incomingDeviceId, name) {
      calls.push("internal-chat");
      assert.equal(advisor.advisorId, advisorId);
      assert.equal(incomingDeviceId, deviceId);
      assert.equal(name, "Martín");
      return { advisor_id: advisorId, advisor_slug: "gera", player_id: playerId, created: true };
    },
    async resolveAccount(accountRequest) {
      calls.push("api2");
      assert.deepEqual(accountRequest, { external_user_id: playerId, name: "Martín", advisor_id: advisorId });
      return { username: "secret-user", password: "secret-pass", platform: "rey_de_ases", created: true };
    },
    async createHandoff(advisor, incomingDeviceId, player, account) {
      calls.push("gateway");
      assert.equal(advisor.advisorSlug, "gera");
      assert.equal(incomingDeviceId, deviceId);
      assert.equal(player.player_id, playerId);
      assert.equal(account.password, "secret-pass");
      return { handoff_url: "https://gateway.example.com/start?t=token", expires_at: "2026-10-08T12:00:00Z", binding_created: true };
    },
  };
  return { deps, calls };
}

test("device_id se reutiliza entre clics y al recuperar la cookie", () => {
  const storage = new Map<string, string>();
  let cookie = "";
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (key: string) => storage.get(key) || null, setItem: (key: string, value: string) => storage.set(key, value) },
    location: { protocol: "https:" },
  } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    get cookie() { return cookie; }, set cookie(value: string) { cookie = value; },
  } });
  try {
    const first = getOrCreateDeviceId();
    assert.equal(getOrCreateDeviceId(), first);
    assert.equal(storage.get(DEVICE_ID_STORAGE_KEY), first);
    assert.match(cookie, new RegExp(`^${DEVICE_ID_COOKIE}=${first};.*Max-Age=31536000; SameSite=Lax; Secure$`));
    storage.delete(DEVICE_ID_STORAGE_KEY);
    assert.equal(getOrCreateDeviceId(), first);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow); else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument); else Reflect.deleteProperty(globalThis, "document");
  }
});

test("start rechaza formato, tipo y tamaño inválidos antes de consultar la base", async () => {
  const { deps, calls } = dependencies();
  for (const payload of [{ ...validPayload, name: " " }, { ...validPayload, device_id: "invalid" }, { ...validPayload, advisor_id: "invalid" }]) {
    const result = await handleReyStart(request(payload), deps);
    assert.equal(result.status, 400);
  }
  assert.equal((await handleReyStart(request(validPayload, { "Content-Type": "text/plain" }), deps)).status, 415);
  assert.equal((await handleReyStart(request(validPayload, { Origin: "https://evil.example" }), deps)).status, 403);
  assert.equal((await handleReyStart(request({ ...validPayload, promo_code: "x".repeat(5000) }), deps)).status, 413);
  assert.deepEqual(calls, []);
});

test("start verifica en servidor landing, plan y asignación exacta del asesor", async () => {
  const { deps, calls } = dependencies();
  const result = await handleReyStart(request({ ...validPayload, advisor_id: deviceId }), deps);
  assert.equal(result.status, 403);
  assert.deepEqual(calls, ["landing", "plan", "assignment", "advisor"]);
  assert.deepEqual(await result.json(), { error: "advisor_not_assigned" });
  const unassigned = dependencies();
  const unassignedResult = await handleReyStart(request({ ...validPayload, atrio_client_id: deviceId }), unassigned.deps);
  assert.equal(unassignedResult.status, 403);
  assert.deepEqual(unassigned.calls, ["landing", "plan", "assignment"]);
});

test("sin API2 devuelve error controlado, no llama al gateway y no expone secretos", async () => {
  const { deps, calls } = dependencies("api2_not_configured");
  const result = await handleReyStart(request(validPayload), deps);
  assert.equal(result.status, 503);
  assert.equal(result.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await result.json(), { error: "api2_not_configured" });
  assert.ok(!calls.includes("gateway"));
  assert.ok(!calls.includes("internal-chat"));
});

test("con toda la cadena disponible el navegador recibe solo handoff_url", async () => {
  const { deps, calls } = dependencies();
  const result = await handleReyStart(request(validPayload), deps);
  assert.equal(result.status, 200);
  const body = await result.text();
  assert.deepEqual(JSON.parse(body), { handoff_url: "https://gateway.example.com/start?t=token" });
  assert.deepEqual(calls, ["landing", "plan", "assignment", "advisor", "api2-readiness", "internal-chat", "api2", "gateway"]);
  assert.doesNotMatch(body, /secret-user|secret-pass|api_key/i);
});

test("adaptadores usan contrato servidor-servidor y no exponen credenciales", async () => {
  const originalFetch = globalThis.fetch;
  const oldChatOrigin = process.env.INTERNAL_CHAT_ORIGIN;
  const oldChatKey = process.env.INTERNAL_CHAT_GATEWAY_API_KEY;
  const oldGatewayOrigin = process.env.REY_GATEWAY_ORIGIN;
  const oldGatewayKey = process.env.REY_GATEWAY_HANDOFF_API_KEY;
  process.env.INTERNAL_CHAT_ORIGIN = "https://chat.example.com";
  process.env.INTERNAL_CHAT_GATEWAY_API_KEY = "test-chat-key";
  process.env.REY_GATEWAY_ORIGIN = "https://gateway.example.com";
  process.env.REY_GATEWAY_HANDOFF_API_KEY = "test-gateway-key";
  const advisor = { atrioClientId: clientId, advisorId, advisorSlug: "gera" };
  try {
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), "https://chat.example.com/api/gateway/players/resolve");
      assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer test-chat-key");
      assert.deepEqual(JSON.parse(String(init?.body)), { advisor_id: advisorId, advisor_slug: "gera", device_id: deviceId, name: "Martín" });
      return Response.json({ advisor_id: advisorId, advisor_slug: "gera", player_id: playerId, created: true });
    };
    const player = await resolveInternalChatPlayer(advisor, deviceId, "Martín");
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), "https://gateway.example.com/api/handoffs");
      assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer test-gateway-key");
      assert.deepEqual(JSON.parse(String(init?.body)), {
        advisor_id: advisorId, advisor_slug: "gera", device_id: deviceId,
        external_user_id: playerId, platform: "rey_de_ases",
        username: "test-user", password: "test-pass", target_path: "/casino/list/home",
      });
      return Response.json({ handoff_url: "https://gateway.example.com/start?t=token", expires_at: "2026-10-08T12:00:00Z", binding_created: true });
    };
    const handoff = await createReyHandoff(advisor, deviceId, player, { username: "test-user", password: "test-pass", platform: "rey_de_ases", created: true });
    assert.equal(handoff.handoff_url, "https://gateway.example.com/start?t=token");
  } finally {
    globalThis.fetch = originalFetch;
    if (oldChatOrigin === undefined) delete process.env.INTERNAL_CHAT_ORIGIN; else process.env.INTERNAL_CHAT_ORIGIN = oldChatOrigin;
    if (oldChatKey === undefined) delete process.env.INTERNAL_CHAT_GATEWAY_API_KEY; else process.env.INTERNAL_CHAT_GATEWAY_API_KEY = oldChatKey;
    if (oldGatewayOrigin === undefined) delete process.env.REY_GATEWAY_ORIGIN; else process.env.REY_GATEWAY_ORIGIN = oldGatewayOrigin;
    if (oldGatewayKey === undefined) delete process.env.REY_GATEWAY_HANDOFF_API_KEY; else process.env.REY_GATEWAY_HANDOFF_API_KEY = oldGatewayKey;
  }
});
