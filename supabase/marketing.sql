-- ============================================================
-- Virtual Reality Guys — Marketing & Client Communications Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- Adds:
--   • marketing_contacts           — the email marketing audience (with consent + unsubscribe)
--   • email_campaigns              — email marketing campaigns
--   • email_campaign_recipients    — one row per person per campaign (send log)
--   • ad_campaigns                 — paid / social ads tracking (Meta, Google, TikTok…)
--   • client_communications        — every email sent to / received from a client
--
-- Security: these tables are only reachable by logged-in admins and the
-- server (service role). The public website key cannot read or change them.
-- ============================================================

create extension if not exists "pgcrypto";

-- 1. Marketing contacts --------------------------------------------------
create table if not exists marketing_contacts (
  id                uuid default gen_random_uuid() primary key,
  email             text not null,
  name              text,
  phone             text,
  suburb            text,
  tags              text[] not null default '{}'::text[],
  status            text not null default 'subscribed'
                    check (status in ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  source            text not null default 'manual', -- 'manual', 'website_request', 'past_client', 'import', 'event', 'claude'
  consent_basis     text not null default 'existing_customer'
                    check (consent_basis in ('opt_in', 'existing_customer', 'other')),
  consent_at        timestamptz default now(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  unsubscribed_at   timestamptz,
  last_emailed_at   timestamptz,
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Emails are stored lower-cased by the app, so a plain unique index is enough.
create unique index if not exists marketing_contacts_email_idx on marketing_contacts (email);
create unique index if not exists marketing_contacts_token_idx on marketing_contacts (unsubscribe_token);
create index if not exists marketing_contacts_tags_idx on marketing_contacts using gin (tags);

-- 2. Email campaigns -----------------------------------------------------
create table if not exists email_campaigns (
  id                 uuid default gen_random_uuid() primary key,
  name               text not null,
  subject            text not null,
  preview_text       text,
  body_html          text not null default '',
  body_text          text,
  audience_tags      text[] not null default '{}'::text[], -- empty = all subscribed contacts
  status             text not null default 'draft'
                     check (status in ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_for      timestamptz,
  send_method        text not null default 'gmail' check (send_method in ('gmail', 'portal')),
  recipients_count   int not null default 0,
  sent_count         int not null default 0,
  failed_count       int not null default 0,
  replies_count      int not null default 0,
  bookings_count     int not null default 0,
  revenue_attributed numeric(12, 2) not null default 0,
  cost               numeric(12, 2) not null default 0,
  goal               text,
  notes              text,
  created_by         text not null default 'Admin',
  started_at         timestamptz,
  completed_at       timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- 3. Campaign recipients (send log) --------------------------------------
create table if not exists email_campaign_recipients (
  id               uuid default gen_random_uuid() primary key,
  campaign_id      uuid not null references email_campaigns(id) on delete cascade,
  contact_id       uuid references marketing_contacts(id) on delete set null,
  email            text not null,
  name             text,
  status           text not null default 'pending'
                   check (status in ('pending', 'sent', 'failed', 'skipped', 'replied', 'bounced', 'unsubscribed')),
  external_id      text, -- Gmail / Resend message id
  error            text,
  sent_at          timestamptz,
  created_at       timestamptz default now()
);

create unique index if not exists email_campaign_recipients_unique_idx
  on email_campaign_recipients (campaign_id, email);
create index if not exists email_campaign_recipients_status_idx
  on email_campaign_recipients (campaign_id, status);

-- 4. Ad campaigns --------------------------------------------------------
create table if not exists ad_campaigns (
  id                 uuid default gen_random_uuid() primary key,
  name               text not null,
  platform           text not null default 'meta'
                     check (platform in ('meta', 'instagram', 'facebook', 'google', 'tiktok', 'youtube', 'linkedin', 'whatsapp', 'print', 'radio', 'influencer', 'other')),
  objective          text, -- e.g. 'leads', 'traffic', 'awareness', 'bookings'
  status             text not null default 'planned'
                     check (status in ('planned', 'active', 'paused', 'completed', 'cancelled')),
  start_date         text,
  end_date           text,
  budget             numeric(12, 2) not null default 0,
  spend              numeric(12, 2) not null default 0,
  impressions        int not null default 0,
  clicks             int not null default 0,
  leads              int not null default 0,
  bookings           int not null default 0,
  revenue_attributed numeric(12, 2) not null default 0,
  target_audience    text,
  ad_copy            text,
  creative_url       text,
  landing_url        text,
  notes              text,
  created_by         text not null default 'Admin',
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- 5. Client communications log ------------------------------------------
create table if not exists client_communications (
  id            uuid default gen_random_uuid() primary key,
  request_id    uuid references form_requests(id) on delete set null,
  invoice_id    uuid references invoices(id) on delete set null,
  client_name   text,
  client_email  text,
  direction     text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  channel       text not null default 'email' check (channel in ('email', 'whatsapp', 'sms', 'phone')),
  subject       text,
  body          text,
  status        text not null default 'sent' check (status in ('draft', 'sent', 'failed', 'received')),
  external_id   text, -- Gmail message / thread id
  sent_by       text not null default 'Admin',
  created_at    timestamptz default now()
);

create index if not exists client_communications_request_idx on client_communications (request_id);
create index if not exists client_communications_email_idx on client_communications (lower(client_email));

-- Row Level Security ------------------------------------------------------
alter table marketing_contacts        enable row level security;
alter table email_campaigns           enable row level security;
alter table email_campaign_recipients enable row level security;
alter table ad_campaigns              enable row level security;
alter table client_communications     enable row level security;

drop policy if exists "Admin all marketing_contacts" on marketing_contacts;
drop policy if exists "Admin all email_campaigns" on email_campaigns;
drop policy if exists "Admin all email_campaign_recipients" on email_campaign_recipients;
drop policy if exists "Admin all ad_campaigns" on ad_campaigns;
drop policy if exists "Admin all client_communications" on client_communications;

create policy "Admin all marketing_contacts" on marketing_contacts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all email_campaigns" on email_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all email_campaign_recipients" on email_campaign_recipients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all ad_campaigns" on ad_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all client_communications" on client_communications
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
