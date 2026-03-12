import { LandingConfig } from '@/lib/landing/types';

export async function getLandingConfig(name: string): Promise<LandingConfig | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    throw new Error('Falta NEXT_PUBLIC_SITE_URL');
  }

  const url = `${baseUrl}/api/config?name=${encodeURIComponent(name)}`;

  const response = await fetch(url, {
    cache: 'force-cache',
    next: { revalidate: 60 }
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
