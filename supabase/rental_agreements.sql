-- ============================================================
-- Virtual Reality Guys — Rental Agreements Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists rental_agreements (
  id                     uuid default gen_random_uuid() primary key,
  agreement_number       text not null unique,
  renter_name            text not null,
  renter_email           text,
  renter_phone           text,
  renter_id_number       text,
  renter_address         text,
  is_company             boolean default false,
  company_name           text,
  company_reg            text,
  company_rep            text,
  company_position       text,
  start_date             text,
  start_time             text,
  end_date               text,
  end_time               text,
  delivery_address       text,
  purpose                text default 'birthday',
  purpose_other          text,
  rental_fee             numeric(12, 2) not null default 0,
  delivery_fee           numeric(12, 2) not null default 0,
  other_charges          numeric(12, 2) not null default 0,
  total_amount           numeric(12, 2) not null default 0,
  booking_deposit_paid   numeric(12, 2) not null default 0,
  deposit_date_paid      text,
  security_deposit       numeric(12, 2) not null default 0,
  status                 text not null default 'draft' check (status in ('draft', 'active', 'returned', 'completed', 'cancelled')),
  equipment_list         jsonb not null default '[]'::jsonb,
  headset_serial_numbers text,
  replacement_values     jsonb default '[]'::jsonb,
  late_return_charge     numeric(12, 2) default 250,
  late_return_unit       text default 'hour',
  handover_notes         text,
  return_notes           text,
  full_agreement_data    jsonb not null default '{}'::jsonb,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

-- Enable RLS
alter table rental_agreements enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Admin all rental_agreements" on rental_agreements;
drop policy if exists "Allow all rental_agreements ops" on rental_agreements;

-- Universal policy so admin operations are never blocked
create policy "Allow all rental_agreements ops" on rental_agreements
  for all using (true) with check (true);
