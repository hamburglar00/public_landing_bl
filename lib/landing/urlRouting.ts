/** Only public landing entry points may be overridden by the query parameter. */
const RESERVED_PATHS = new Set(['api', '_next', '.well-known', 'favicon.ico', 'robots.txt', 'sitemap.xml']);

export function landingOverride(url: URL): { slug: string; pathname: string } | null | 'invalid' {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length > 1 || RESERVED_PATHS.has(segments[0])) return null;
  const values = url.searchParams.getAll('landing');
  if (!values.length || (values.length === 1 && !values[0].trim())) return null;
  if (values.length !== 1) return 'invalid';
  const slug = values[0].trim();
  if (slug.length > 160 || /[\x00-\x1f\x7f/\\?#%]/.test(slug) ||
      slug === '.' || slug === '..' || RESERVED_PATHS.has(slug)) return 'invalid';
  return { slug, pathname: `/${encodeURIComponent(slug)}` };
}

export function fallbackDestination(slug: string, params: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === 'landing' || key === '__landing_auto') continue;
    for (const entry of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, entry);
  }
  query.set('__landing_auto', slug);
  const suffix = query.toString();
  return `/${encodeURIComponent(slug)}${suffix ? `?${suffix}` : ''}`;
}
