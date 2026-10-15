import { renderClassicTemplate7InlineHtml } from '@/lib/template7/shared.cjs';
import { buildDeviceIdRuntimeScript } from '@/lib/reyDeAses/deviceId';
import type { LandingConfig } from '@/lib/landing/types';

/** Server-rendered form. Its inline runtime does not depend on React hydration. */
export default function Template7FastView({ slug, config }: { slug: string; config: LandingConfig }) {
  const html = renderClassicTemplate7InlineHtml({ slug, config }, buildDeviceIdRuntimeScript());
  return <div data-template7-fast dangerouslySetInnerHTML={{ __html: html }} />;
}
