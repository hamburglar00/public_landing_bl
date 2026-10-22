import type { TargetProvider } from "../reyDeAses/contracts";
const TEMPLATE8_PROVIDERS = ["ganamos_net", "multi_skin", "rey_de_ases", "ases_del_norte"];
/** Strict server selector: never infer a page from an untrusted provider or a default card. */
export function template8Provider(config: unknown, cardIndex: unknown): TargetProvider | null {
  if (!config || typeof config !== "object" || !Number.isInteger(cardIndex)) return null;
  const raw = config as { template?: string; template8Cover?: { cardCount: number; cards: { targetProvider: TargetProvider }[] } };
  const cover = raw.template8Cover;
  if (raw.template !== "template8" || !cover || !Number.isInteger(cover.cardCount) || cover.cardCount < 1 || cover.cardCount > 6 ||
      Number(cardIndex) < 1 || Number(cardIndex) > cover.cardCount) return null;
  const provider = cover.cards?.[Number(cardIndex) - 1]?.targetProvider;
  return TEMPLATE8_PROVIDERS.includes(provider) ? provider : null;
}
