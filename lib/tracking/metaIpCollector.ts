export type MetaClientIpProof = {
  clientIpAddress: string;
  clientIpIssuedAt: number | null;
  clientIpProof: string;
};

const EMPTY_PROOF: MetaClientIpProof = {
  clientIpAddress: '',
  clientIpIssuedAt: null,
  clientIpProof: ''
};
const COLLECTOR_TIMEOUT_MS = 800;
const MAX_RESPONSE_AGE_SECONDS = 10 * 60;

let cachedProof: MetaClientIpProof = EMPTY_PROOF;
let pendingProof: Promise<MetaClientIpProof> | null = null;

function parseCollectorResponse(value: unknown): MetaClientIpProof {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return EMPTY_PROOF;
  const response = value as Record<string, unknown>;
  const ip = String(response.ip ?? '').trim().toLowerCase();
  const issuedAt = Number(response.issued_at);
  const proof = String(response.proof ?? '').trim();
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (
    !ip ||
    !proof ||
    !Number.isInteger(issuedAt) ||
    issuedAt > nowSeconds + 30 ||
    nowSeconds - issuedAt > MAX_RESPONSE_AGE_SECONDS
  ) {
    return EMPTY_PROOF;
  }

  return {
    clientIpAddress: ip,
    clientIpIssuedAt: issuedAt,
    clientIpProof: proof
  };
}

export function getCachedMetaClientIpProof() {
  return cachedProof;
}

export function collectMetaClientIpProof() {
  const collectorUrl = String(process.env.NEXT_PUBLIC_META_IP_COLLECTOR_URL || '').trim();
  if (!collectorUrl || typeof window === 'undefined') {
    return Promise.resolve(EMPTY_PROOF);
  }
  if (cachedProof.clientIpAddress) return Promise.resolve(cachedProof);
  if (pendingProof) return pendingProof;

  pendingProof = (async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), COLLECTOR_TIMEOUT_MS);
    try {
      const response = await fetch(collectorUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal
      });
      if (!response.ok) return EMPTY_PROOF;
      const proof = parseCollectorResponse(await response.json());
      if (proof.clientIpAddress) cachedProof = proof;
      return proof;
    } catch {
      return EMPTY_PROOF;
    } finally {
      window.clearTimeout(timeoutId);
    }
  })().finally(() => {
    pendingProof = null;
  });

  return pendingProof;
}
