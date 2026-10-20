import assert from "node:assert/strict";
import test from "node:test";
import { api2Readiness, resolveTargetAccount } from "../lib/reyDeAses/integrations.server";
import type { TargetProvider } from "../lib/reyDeAses/contracts";

test("classic account adapter uses API2 for every provider and preserves the external identity for inbox operations", async () => {
  const keys = ["TEMPLATE7_API2_PLAYER_CREATION_ENABLED", "API2_ORIGIN", "API2_API_KEY", "API2_API_SECRET"];
  const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { TEMPLATE7_API2_PLAYER_CREATION_ENABLED: "true", API2_ORIGIN: "https://api2.example.test", API2_API_KEY: "fixture-key", API2_API_SECRET: "fixture-secret" });
  const input = { manager_id:1035, agency_id:272, external_user_id: "player-id", name: "Prueba", advisor_id: "advisor/id", advisor_slug: "advisor" };
  try {
    assert.equal(api2Readiness(), null);
    for (const [provider, platform] of [["rey_de_ases", 5], ["ases_del_norte", 1], ["ganamos_net", 2], ["multi_skin", 2]] as [TargetProvider, number][]) {
      globalThis.fetch = async (url, init) => {
        assert.equal(String(url), "https://api2.example.test/api/v1/bot/managers/1035/players");
        assert.equal(new Headers(init?.headers).get("apikey"), "fixture-key");
        assert.deepEqual(JSON.parse(String(init?.body)), { external_user_id: "player-id", name: "Prueba", advisor_id:"advisor/id", agency_id:272 });
        return Response.json({ success: true, username: "test-user", password: "test-password", platform, is_new: true }, { status: 201 });
      };
      assert.deepEqual(await resolveTargetAccount({ ...input, target_provider: provider }), {
        username: "test-user", password: "test-password", platform: provider, created: true, externalAccountId: "player-id",
      });
    }
    globalThis.fetch = async () => Response.json({ success: true, username: "u", password: "p", platform: 1, is_new: true });
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /upstream_unavailable/);
    globalThis.fetch = async () => Response.json({ code: "access_denied" }, { status: 401 });
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /upstream_unavailable/);
    process.env.TEMPLATE7_API2_PLAYER_CREATION_ENABLED = "false";
    globalThis.fetch = async () => { throw new Error("No request is allowed while disabled"); };
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /integration_pending/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
