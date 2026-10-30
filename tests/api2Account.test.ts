import assert from "node:assert/strict";
import test from "node:test";
import { api2Readiness, resolveTargetAccount } from "../lib/reyDeAses/integrations.server";
import type { TargetProvider } from "../lib/reyDeAses/contracts";

test("classic account adapter uses supported PBAdmin providers and preserves external identity", async () => {
  const keys = ["API2_ORIGIN", "API2_API_KEY", "API2_API_SECRET"];
  const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { API2_ORIGIN: "https://api2.example.test", API2_API_KEY: "fixture-key", API2_API_SECRET: "fixture-secret" });
  const input = { manager_id:1035, agency_id:272, external_user_id: "player-id", name: "Prueba", advisor_id: "advisor/id", advisor_slug: "advisor" };
  try {
    assert.equal(api2Readiness(), null);
    for (const [provider, platform] of [["rey_de_ases", 5], ["ases_del_norte", 1], ["ganamos_net", 2], ["multi_skin", 7]] as [TargetProvider, number][]) {
      globalThis.fetch = async (url, init) => {
        assert.equal(String(url), "https://api2.example.test/api/v1/bot/managers/1035/players");
        assert.equal(new Headers(init?.headers).get("apikey"), "fixture-key");
        assert.deepEqual(JSON.parse(String(init?.body)), { external_user_id: "player-id", name: "Prueba", advisor_id:"advisor/id", agency_id:272,
          ...(["ganamos_net", "multi_skin"].includes(provider) ? { creation_mode: "create_only" } : {}) });
        return Response.json({ success: true, username: "test-user", password: "test-password", platform, is_new: true }, { status: 201 });
      };
      assert.deepEqual(await resolveTargetAccount({ ...input, target_provider: provider }), {
        username: "test-user", password: "test-password", platform: provider, created: true, externalAccountId: "player-id",
      });
    }
    globalThis.fetch = async () => Response.json({success:true,username:'wrong-provider',password:'secret',platform:2,is_new:true});
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "multi_skin" }), /upstream_unavailable/);
    globalThis.fetch = async () => Response.json({ success: true, username: "u", password: "p", platform: 1, is_new: true });
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /upstream_unavailable/);
    globalThis.fetch = async () => Response.json({ code: "access_denied" }, { status: 401 });
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /upstream_unavailable/);
    delete process.env.API2_API_KEY;
    globalThis.fetch = async () => { throw new Error("No request is allowed without credentials"); };
    await assert.rejects(resolveTargetAccount({ ...input, target_provider: "rey_de_ases" }), /api2_not_configured/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
