-- ============================================================
-- Virtual Reality Guys — Events & Accounting Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create Standalone Events Table
create table if not exists events (
  id             uuid default gen_random_uuid() primary key,
  title          text not null,
  event_date     text not null,
  event_type     text not null default 'Corporate Activation',
  location       text,
  description    text,
  total_revenue  numeric(12, 2) not null default 0,
  total_expenses numeric(12, 2) not null default 0,
  status         text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2. Create Expenses Table
create table if not exists expenses (
  id          uuid default gen_random_uuid() primary key,
  event_id    uuid references events(id) on delete cascade,
  invoice_id  uuid references invoices(id) on delete cascade,
  title       text not null,
  category    text not null default 'Other' check (category in ('Staff Wages', 'Transport / Fuel', 'Venue Fee', 'Equipment / Maintenance', 'Marketing / Ads', 'Food & Refreshments', 'Other')),
  amount      numeric(12, 2) not null default 0,
  date        text not null,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable RLS
alter table events enable row level security;
alter table expenses enable row level security;

-- Policies for public / admin access
drop policy if exists "Allow all operations for authenticated admin on events" on events;
create policy "Allow all operations for authenticated admin on events" on events for all using (true) with check (true);

drop policy if exists "Allow all operations for authenticated admin on expenses" on expenses;
create policy "Allow all operations for authenticated admin on expenses" on expenses for all using (true) with check (true);
