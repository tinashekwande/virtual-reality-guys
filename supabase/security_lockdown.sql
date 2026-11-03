-- ============================================================
-- Virtual Reality Guys — Security lockdown (Row Level Security)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Run AFTER all other migrations. Safe to run more than once.
--
-- Why: several tables had policies like `using (true)`, which let anyone
-- holding the public (anon) website key read and change business data
-- through the Supabase API. The app itself only touches these tables from
-- server API routes using the service-role key (which bypasses RLS), so
-- locking them down does not affect the portal.
--
-- After this:
--   • Admin tables: only signed-in users listed in admin_profiles.
--   • Public website: can still read published blog posts, gallery media,
--     categories and team members, and submit the booking form.
-- ============================================================

-- Helper: is the current signed-in user an admin?
-- Lives in a private schema (not exposed by the Supabase API) and is
-- SECURITY DEFINER so it can read admin_profiles without recursive RLS.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid());
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

do $$
declare
  t text;
  p record;
  admin_tables text[] := array[
    'admin_profiles', 'form_requests', 'invoices', 'events', 'expenses',
    'equipment', 'equipment_logs', 'ai_actions', 'ai_audit_logs', 'ai_settings',
    'event_plans', 'event_debriefs', 'follow_ups', 'personal_calendar_events',
    'calendar_subscriptions', 'rental_agreements', 'blog_posts', 'media',
    'categories', 'team_members', 'marketing_contacts', 'email_campaigns',
    'email_campaign_recipients', 'ad_campaigns', 'client_communications'
  ];
  -- Public policies we deliberately keep (website needs them)
  keep text[] := array[
    'Public read published blog posts', 'Public read media',
    'Public read categories', 'Public read team', 'Public submit requests'
  ];
begin
  foreach t in array admin_tables loop
    if to_regclass('public.' || t) is null then
      continue; -- table not created in this project
    end if;

    execute format('alter table public.%I enable row level security', t);

    -- Drop every existing policy except the intentional public ones
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      if not (p.policyname = any(keep)) then
        execute format('drop policy %I on public.%I', p.policyname, t);
      end if;
    end loop;

    execute format(
      'create policy %I on public.%I for all to authenticated using (private.is_admin()) with check (private.is_admin())',
      'Admins manage ' || t, t
    );
  end loop;
end $$;

-- Re-assert the public website policies (no-ops if they already exist)
do $$
begin
  if to_regclass('public.form_requests') is not null and not exists (
    select 1 from pg_policies where schemaname='public' and tablename='form_requests' and policyname='Public submit requests') then
    create policy "Public submit requests" on public.form_requests for insert with check (true);
  end if;
  if to_regclass('public.media') is not null and not exists (
    select 1 from pg_policies where schemaname='public' and tablename='media' and policyname='Public read media') then
    create policy "Public read media" on public.media for select using (true);
  end if;
  if to_regclass('public.categories') is not null and not exists (
    select 1 from pg_policies where schemaname='public' and tablename='categories' and policyname='Public read categories') then
    create policy "Public read categories" on public.categories for select using (true);
  end if;
  if to_regclass('public.team_members') is not null and not exists (
    select 1 from pg_policies where schemaname='public' and tablename='team_members' and policyname='Public read team') then
    create policy "Public read team" on public.team_members for select using (true);
  end if;
  if to_regclass('public.blog_posts') is not null and not exists (
    select 1 from pg_policies where schemaname='public' and tablename='blog_posts' and policyname='Public read published blog posts') then
    create policy "Public read published blog posts" on public.blog_posts for select
      using (status = 'published' and (published_at is null or published_at <= now()));
  end if;
end $$;

-- Remove the earlier public version of the helper if it exists
drop function if exists public.is_admin();
