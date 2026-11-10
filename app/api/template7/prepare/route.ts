import { handleClassicTemplate7Prepare } from "../../../../lib/template7/preparation.cjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

/** Rollout is explicit. Both issuers must share the existing preparation key.
 * Turning this flag off preserves the legacy path for cached/new public assets. */
export async function POST(request: Request): Promise<Response> {
  if (process.env.TEMPLATE7_CLASSIC_TWO_PHASE_ENABLED !== "1") {
    const { POST: start } = await import("../start/route");
    const response = await start(request);
    response.headers.set("X-Entry-Protocol", "classic-start");
    return response;
  }
  const response = await handleClassicTemplate7Prepare(request);
  response.headers.set("X-Entry-Protocol", "opaque-prepare");
  return response;
}
