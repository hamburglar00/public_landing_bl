import type { TargetProvider } from "../reyDeAses/contracts";
import { isMultiSkinCode, type MultiSkinCode } from "../multi-skin-catalog";
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

export function template8SkinCode(config: unknown, cardIndex: unknown): MultiSkinCode | null {
  if (template8Provider(config, cardIndex) !== "multi_skin") return null;
  const raw = config as { template8Cover: { cards: { multiSkinCode?: unknown }[] } };
  const skin = raw.template8Cover.cards[Number(cardIndex) - 1].multiSkinCode;
  return skin === undefined ? "ganamos_plus" : isMultiSkinCode(skin) ? skin : null;
}
