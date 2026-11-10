import type { LandingConfig } from "../landing/types";
export const TEMPLATE9_LEGAL_PAGES: Record<string, string>;
export function renderTemplate9LegalHtml(config: LandingConfig, page: string, basePath: string): string | null;
export function renderClassicTemplate7InlineHtml(
  params: { slug: string; config: LandingConfig },
  deviceIdScript: string,
): string;
export function renderClassicPublicLandingHtml(
  params: { slug: string; config: LandingConfig; canonicalUrl?: string },
  deviceIdScript: string,
): string;
export function renderClassicTemplate7Html(
  params: { slug: string; config: LandingConfig; canonicalUrl?: string },
  deviceIdScript: string,
): string;
