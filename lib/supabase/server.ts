import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('Falta NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient(url, serviceRole || anonKey || '', {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
