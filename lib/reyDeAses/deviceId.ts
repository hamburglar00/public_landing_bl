export const DEVICE_ID_STORAGE_KEY = "internal-chat:device-id";
export const DEVICE_ID_COOKIE = "internal_chat_device_id";
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isDeviceId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("device_id requiere un navegador");
  }

  let stored = "";
  try { stored = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY) || ""; } catch { /* storage privado */ }
  const cookie = document.cookie.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${DEVICE_ID_COOKIE}=`));
  let fromCookie = "";
  try { fromCookie = cookie ? decodeURIComponent(cookie.slice(DEVICE_ID_COOKIE.length + 1)) : ""; } catch { /* cookie inválida */ }

  const id = isDeviceId(stored) ? stored : isDeviceId(fromCookie) ? fromCookie : crypto.randomUUID();
  if (!isDeviceId(id)) throw new Error("No se pudo crear device_id");

  try { window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, id); } catch { /* cookie queda como respaldo */ }
  document.cookie = `${DEVICE_ID_COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  return id;
}

/** Misma política para el HTML público estático, que no usa el bundle React. */
export function buildDeviceIdRuntimeScript(): string {
  return `
    function getOrCreateDeviceId() {
      var storageKey = ${JSON.stringify(DEVICE_ID_STORAGE_KEY)};
      var cookieName = ${JSON.stringify(DEVICE_ID_COOKIE)};
      var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      var stored = "";
      try { stored = window.localStorage.getItem(storageKey) || ""; } catch (e) {}
      var cookie = document.cookie.split(";").map(function (part) { return part.trim(); })
        .find(function (part) { return part.indexOf(cookieName + "=") === 0; });
      var fromCookie = "";
      try { fromCookie = cookie ? decodeURIComponent(cookie.slice(cookieName.length + 1)) : ""; } catch (e) {}
      var id = uuidPattern.test(stored) ? stored : uuidPattern.test(fromCookie) ? fromCookie : crypto.randomUUID();
      if (!uuidPattern.test(id)) throw new Error("device_id unavailable");
      try { window.localStorage.setItem(storageKey, id); } catch (e) {}
      document.cookie = cookieName + "=" + encodeURIComponent(id) + "; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax" +
        (window.location.protocol === "https:" ? "; Secure" : "");
      return id;
    }
  `;
}
