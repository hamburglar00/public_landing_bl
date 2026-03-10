import { LandingConfig } from '@/lib/landing/types';

export async function getLandingConfig(name: string): Promise<LandingConfig | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error('Faltan variables de entorno de Supabase');
  }

  const url = new URL('/functions/v1/builder-config', baseUrl);
  url.searchParams.set('name', name);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`builder-config respondió ${response.status}`);
  }

  const data = (await response.json()) as LandingConfig;

  if (!data?.name) {
    return null;
  }

  return data;
}
