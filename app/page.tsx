import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { fallbackDestination } from '@/lib/landing/urlRouting';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { data, error } = await getSupabaseServerClient().rpc('get_random_active_landing', {
    p_client_name: process.env.LANDING_FALLBACK_CLIENT || 'goldencajeros',
  });
  if (error) console.error('[landing-fallback] lookup failed', error.code);
  if (!error && typeof data === 'string' && data) redirect(fallbackDestination(data, params));
  return (
    <main className="home-minimal">
      <div className="home-card">
        <h1>No hay atención disponible en este momento</h1>
        <p>Por favor, volvé a intentar más tarde.</p>
      </div>
    </main>
  );
}
