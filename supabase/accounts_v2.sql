-- ============================================================
-- Accounts v2: payments log, staff payouts, asset purchases,
-- expense receipts / overhead flag.
-- Additive and idempotent: safe to run more than once.
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- Make sure invoice columns used elsewhere exist
alter table public.invoices add column if not exists deposit_percentage numeric not null default 50;

-- 1. Payments received against invoices ---------------------------------
create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  amount      numeric(12, 2) not null check (amount > 0),
  paid_on     text not null,                       -- YYYY-MM-DD
  method      text not null default 'EFT' check (method in ('EFT', 'Cash', 'Card', 'Other')),
  reference   text,
  received_by text,
  notes       text,
  created_at  timestamptz default now()
);
create index if not exists payments_invoice_id_idx on public.payments (invoice_id);
create index if not exists payments_paid_on_idx on public.payments (paid_on);

-- 2. Expense extras -------------------------------------------------------
alter table public.expenses add column if not exists kind text not null default 'running';
alter table public.expenses drop constraint if exists expenses_kind_check;
alter table public.expenses add constraint expenses_kind_check check (kind in ('running', 'asset'));
alter table public.expenses add column if not exists useful_life_months integer;
alter table public.expenses add column if not exists receipt_path text;
alter table public.expenses add column if not exists is_overhead boolean not null default false;
-- Staff payouts are Staff Wages expenses with a named payee and a paid/owed state
alter table public.expenses add column if not exists payee text;
alter table public.expenses add column if not exists payment_status text not null default 'paid';
alter table public.expenses drop constraint if exists expenses_payment_status_check;
alter table public.expenses add constraint expenses_payment_status_check check (payment_status in ('paid', 'owed'));
alter table public.expenses add column if not exists paid_on text;

-- 3. Row level security (same admin-only model as the other tables) --------
alter table public.payments enable row level security;
drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments" on public.payments
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- 4. Private storage bucket for expense receipts ---------------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- 5. One-off backfill so existing invoices show correct received/balance ----
-- Fully paid invoices -> one payment for the full total
insert into public.payments (invoice_id, amount, paid_on, method, notes)
select i.id, i.total, coalesce(nullif(substr(i.updated_at::text, 1, 10), ''), substr(i.created_at::text, 1, 10)),
       'EFT', 'Backfilled from invoice status "paid" - please verify'
from public.invoices i
where i.type = 'invoice' and i.status = 'paid' and i.total > 0
  and not exists (select 1 from public.payments p where p.invoice_id = i.id);

-- Deposit-paid invoices (status or the [STATUS:deposit_paid] note tag) -> deposit payment
insert into public.payments (invoice_id, amount, paid_on, method, notes)
select i.id, round(i.total * coalesce(i.deposit_percentage, 50) / 100, 2),
       coalesce(nullif(substr(i.updated_at::text, 1, 10), ''), substr(i.created_at::text, 1, 10)),
       'EFT', 'Backfilled from invoice status "deposit paid" - please verify'
from public.invoices i
where i.type = 'invoice'
  and (i.status = 'deposit_paid' or i.notes like '%[STATUS:deposit_paid]%')
  and i.total > 0
  and not exists (select 1 from public.payments p where p.invoice_id = i.id);

-- 6. Headsets bought so far are equipment (assets), not running costs ------
update public.expenses
set kind = 'asset', useful_life_months = 36
where kind = 'running' and category = 'Equipment / Maintenance'
  and lower(title) like '%headset%' and amount >= 1000;

notify pgrst, 'reload schema';
