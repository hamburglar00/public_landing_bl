import { handleTemplate7Start, productionDependencies } from "../../../../lib/reyDeAses/start.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    return await handleTemplate7Start(request, productionDependencies());
  } catch {
    return new Response(JSON.stringify({ error: "service_unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
