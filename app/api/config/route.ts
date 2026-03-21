import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = (url.searchParams.get('name') || '').trim();

  if (!name) {
    return NextResponse.json({ error: 'missing name' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    return NextResponse.json(
      { error: 'missing supabase env' },
      { status: 500 }
    );
  }

  const supabaseUrl = new URL('/functions/v1/builder-config', baseUrl);
  supabaseUrl.searchParams.set('name', name);

  const upstream = await fetch(supabaseUrl.toString(), {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    cache: 'force-cache',
    next: { revalidate: 60, tags: [`landing-config:${name}`] }
  });

  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
