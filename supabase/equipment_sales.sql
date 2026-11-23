-- ============================================================
-- Equipment sales: money received from selling equipment
-- (e.g. a used headset). Kept apart from booking revenue so
-- event income is not inflated.
-- Additive and idempotent: safe to run more than once.
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

create table if not exists public.equipment_sales (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  sale_price       numeric(12, 2) not null check (sale_price > 0),
  sold_on          text not null,                       -- YYYY-MM-DD
  buyer            text,
  method           text not null default 'EFT' check (method in ('EFT', 'Cash', 'Card', 'Other')),
  -- The item in the fleet that was sold (gets retired)
  equipment_id     uuid references public.equipment(id) on delete set null,
  -- The expense entry for when it was bought. Gives the book value and stops its depreciation.
  asset_expense_id uuid references public.expenses(id) on delete set null,
  -- What it cost, when there is no purchase expense on record (bought before the portal)
  original_cost    numeric(12, 2) check (original_cost is null or original_cost >= 0),
  notes            text,
  created_at       timestamptz default now()
);
create index if not exists equipment_sales_sold_on_idx on public.equipment_sales (sold_on);

-- Equipment that has been sold stops depreciating from this date
alter table public.expenses add column if not exists disposed_on text;

alter table public.equipment_sales enable row level security;
drop policy if exists "Admins manage equipment sales" on public.equipment_sales;
create policy "Admins manage equipment sales" on public.equipment_sales
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

notify pgrst, 'reload schema';
