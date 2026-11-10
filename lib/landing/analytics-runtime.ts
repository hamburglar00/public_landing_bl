import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

// Preserve the existing production measurements without React hydration.
// This adapter runs after the public page and Meta bootstrap are available.
inject({ mode: 'production' });
injectSpeedInsights({ route: '/[slug]' });
