-- ============================================================
-- Virtual Reality Guys -- Personal Calendar Migration
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. Personal Calendar Events
create table if not exists personal_calendar_events (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  description   text,
  date          text not null,
  start_time    text,
  end_time      text,
  location      text,
  color         text not null default '#8b5cf6',
  is_all_day    boolean not null default false,
  source        text not null default 'manual'
                check (source in ('manual', 'ics_import', 'google', 'apple', 'outlook', 'other')),
  external_uid  text,
  subscription_id uuid,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create unique index if not exists personal_calendar_events_uid_idx
  on personal_calendar_events (external_uid)
  where external_uid is not null;

-- 2. Calendar Subscriptions
create table if not exists calendar_subscriptions (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  type          text not null default 'ics_url'
                check (type in ('ics_url', 'google_feed', 'apple_feed', 'outlook_feed')),
  url           text not null,
  color         text not null default '#8b5cf6',
  is_active     boolean not null default true,
  last_synced_at timestamptz,
  event_count   int not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table personal_calendar_events
  add constraint fk_personal_event_subscription
  foreign key (subscription_id) references calendar_subscriptions(id) on delete set null;

alter table personal_calendar_events enable row level security;
alter table calendar_subscriptions enable row level security;

drop policy if exists "Admin all personal events" on personal_calendar_events;
drop policy if exists "Admin all calendar subscriptions" on calendar_subscriptions;

create policy "Admin all personal events"
  on personal_calendar_events for all using (true) with check (true);

create policy "Admin all calendar subscriptions"
  on calendar_subscriptions for all using (true) with check (true);
