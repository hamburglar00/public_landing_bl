import { handleTemplate7Destination, productionDestinationBackend } from "@/lib/atrio/template7Destination.server";
import { isDeviceId } from "@/lib/reyDeAses/deviceId";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const raw = await request.clone().text();
    if (new TextEncoder().encode(raw).length > 1024) return Response.json({ error: "invalid_request" }, { status: 413 });
    const value = JSON.parse(raw);
    const deviceId = isDeviceId(value?.device_id) ? value.device_id : null;
    return handleTemplate7Destination(request, deviceId, productionDestinationBackend(), true);
  } catch { return Response.json({ error: "invalid_request" }, { status: 400 }); }
}
