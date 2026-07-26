export function buildTrackingStorageNamespace(pixelId: unknown, slug: unknown) {
  const normalizedPixelId =
    String(pixelId || '').trim().replace(/\D+/g, '') || 'no-pixel';
  const normalizedSlug = String(slug || '').trim() || 'landing';
  return `landing-builder:${normalizedPixelId}:${normalizedSlug}`;
}

export function buildTrackingStorageKey(namespace: string, key: string) {
  return `${namespace}:${key}`;
}
