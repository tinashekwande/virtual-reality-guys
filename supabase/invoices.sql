-- ============================================================
-- Virtual Reality Guys — Quotes & Invoices Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists invoices (
  id             uuid default gen_random_uuid() primary key,
  type           text not null check (type in ('quote', 'invoice')),
  doc_number     text not null unique,
  client_name    text not null,
  client_email   text,
  client_phone   text,
  client_address text,
  event_date     text,
  issue_date     text not null,
  due_date       text,
  status         text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'cancelled')),
  items          jsonb not null default '[]'::jsonb,
  subtotal       numeric(12, 2) not null default 0,
  discount       numeric(12, 2) not null default 0,
  transport_fee  numeric(12, 2) not null default 0,
  total          numeric(12, 2) not null default 0,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Enable RLS
alter table invoices enable row level security;

-- Admin full access policy
create policy "Admin all invoices" on invoices
  for all using (auth.role() = 'authenticated');
