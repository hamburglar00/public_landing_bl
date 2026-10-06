const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function notifyTemplate6CardClick(landingId: string, cardIndex: number): void {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!baseUrl || !anonKey || !UUID.test(landingId) ||
        !Number.isInteger(cardIndex) || cardIndex < 1 || cardIndex > 6 ||
        typeof crypto?.randomUUID !== 'function') return;

    void fetch(`${baseUrl.replace(/\/+$/, '')}/functions/v1/landing-card-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      },
      body: JSON.stringify({ landingId, cardIndex, eventId: crypto.randomUUID() }),
      keepalive: true
    }).catch(() => {});
  } catch {
    // Analytics must never delay WhatsApp.
  }
}
