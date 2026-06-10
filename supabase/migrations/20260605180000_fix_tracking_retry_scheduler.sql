do $$
begin
  execute 'create extension if not exists pg_cron';
exception when others then
  null;
end $$;

do $$
begin
  execute 'create extension if not exists pg_net';
exception when others then
  null;
end $$;

do $$
begin
  execute 'create extension if not exists pgcrypto';
exception when others then
  null;
end $$;

create table if not exists public.cron_config (
  key text primary key,
  value text not null
);

insert into public.cron_config (key, value) values
  ('tracking_retry_url', 'https://landing.panelbotadmin.com/api/track/retry')
on conflict (key) do nothing;

insert into public.cron_config (key, value) values
  ('tracking_retry_secret', encode(extensions.gen_random_bytes(32), 'hex'))
on conflict (key) do update set
  value = excluded.value
where
  public.cron_config.value like 'REPLACE_%'
  or btrim(public.cron_config.value) = '';

create or replace function public.cron_retry_tracking_queue()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  retry_url text;
  retry_secret text;
begin
  select value into retry_url from public.cron_config where key = 'tracking_retry_url';
  select value into retry_secret from public.cron_config where key = 'tracking_retry_secret';

  if retry_url is null or retry_secret is null then
    raise notice 'cron_retry_tracking_queue: missing tracking_retry_url or tracking_retry_secret.';
    return;
  end if;

  if retry_url like '%REPLACE_%' or retry_secret like 'REPLACE_%' then
    raise notice 'cron_retry_tracking_queue: replace placeholders in cron_config.';
    return;
  end if;

  perform net.http_post(
    url := retry_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || retry_secret
    ),
    body := jsonb_build_object(
      'limit', 50,
      'cron_secret', retry_secret
    ),
    timeout_milliseconds := 30000
  );
end;
$$;

comment on function public.cron_retry_tracking_queue() is
  'Reintenta envios fallidos del tracking publico al constructor cada 5 minutos.';

do $$
begin
  perform cron.unschedule('tracking-retry-every-5m');
exception when others then
  null;
end $$;

select cron.schedule(
  'tracking-retry-every-5m',
  '*/5 * * * *',
  $$select public.cron_retry_tracking_queue()$$
);
