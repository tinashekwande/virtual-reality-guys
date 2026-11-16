-- ============================================================
-- Keep the payments log and invoice statuses in step.
--
-- Why: Accounts measures revenue from the payments log. Marking an
-- invoice "paid" or "deposit paid" from Quotes & Invoices (or via the
-- AI/MCP tools) only changed the status, so the money never reached the
-- payments log and the totals did not move.
--
-- What this does:
--   1. Lets invoices store 'pending' and 'deposit_paid' as real statuses
--      (the old constraint forced a "[STATUS:x]" tag hidden in the notes).
--   2. Moves any existing [STATUS:x] tags into the real status column.
--   3. Tags each payment with where it came from (source).
--   4. Trigger: when an invoice becomes "paid" (or "deposit paid"), any
--      shortfall is recorded as a payment, so the ledger always matches.
--      Moving an invoice back (e.g. paid by mistake) removes only the
--      payments the trigger itself created, never ones entered by hand.
--   5. Editing an auto-recorded payment marks it as confirmed (manual).
--
-- Idempotent: safe to run more than once.
-- ============================================================

-- 1. Allow every status the app uses
alter table public.invoices drop constraint if exists invoices_status_check;
alter table public.invoices add constraint invoices_status_check
  check (status in ('draft', 'pending', 'deposit_paid', 'sent', 'paid', 'cancelled'));

-- 2. Promote hidden [STATUS:x] note tags to the real status (only where the row was parked as 'sent')
update public.invoices
set status = substring(notes from '\[STATUS:([a-z_]+)\]')
where notes ~ '\[STATUS:(pending|deposit_paid|paid|sent|draft|cancelled)\]'
  and status = 'sent';
update public.invoices
set notes = btrim(regexp_replace(notes, '\s*\[STATUS:[^\]]+\]', '', 'g'))
where notes like '%[STATUS:%';

-- 3. Where each payment came from
alter table public.payments add column if not exists source text not null default 'manual';
alter table public.payments drop constraint if exists payments_source_check;
alter table public.payments add constraint payments_source_check
  check (source in ('manual', 'backfill', 'status_deposit', 'status_paid'));
update public.payments set source = 'backfill'
where source = 'manual' and notes like 'Backfilled from invoice status%';

-- 4. Status -> payments sync
create or replace function public.sync_payments_from_invoice_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_received numeric;
  v_target   numeric;
  v_source   text;
  v_today    text := to_char((now() at time zone 'Africa/Johannesburg')::date, 'YYYY-MM-DD');
begin
  -- Undo auto-recorded amounts when an invoice is moved back down
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    if new.status = 'deposit_paid' and old.status = 'paid' then
      delete from public.payments where invoice_id = new.id and source = 'status_paid';
    elsif new.status not in ('paid', 'deposit_paid') and old.status in ('paid', 'deposit_paid') then
      delete from public.payments where invoice_id = new.id and source in ('status_paid', 'status_deposit');
    end if;
  end if;

  if new.type <> 'invoice' or coalesce(new.total, 0) <= 0 then
    return new;
  end if;

  if new.status = 'paid' then
    v_target := round(new.total, 2);
    v_source := 'status_paid';
  elsif new.status = 'deposit_paid' then
    v_target := round(new.total * coalesce(new.deposit_percentage, 50) / 100, 2);
    v_source := 'status_deposit';
  else
    return new;
  end if;

  select coalesce(sum(amount), 0) into v_received from public.payments where invoice_id = new.id;

  if v_received + 0.005 < v_target then
    insert into public.payments (invoice_id, amount, paid_on, method, notes, source)
    values (
      new.id,
      round(v_target - v_received, 2),
      v_today,
      'EFT',
      'Recorded automatically when the invoice was marked ' || replace(new.status, '_', ' ')
        || '. Check the date and add the bank reference.',
      v_source
    );
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_sync_payments on public.invoices;
create trigger invoices_sync_payments
  after insert or update of status, total, deposit_percentage, type on public.invoices
  for each row execute function public.sync_payments_from_invoice_status();

-- 5. Editing an auto-recorded payment confirms it
create or replace function public.mark_payment_confirmed()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.source in ('status_paid', 'status_deposit')
     and (new.amount is distinct from old.amount
          or new.paid_on is distinct from old.paid_on
          or new.reference is distinct from old.reference
          or new.method is distinct from old.method
          or new.notes is distinct from old.notes) then
    new.source := 'manual';
  end if;
  return new;
end;
$$;

drop trigger if exists payments_mark_confirmed on public.payments;
create trigger payments_mark_confirmed
  before update on public.payments
  for each row execute function public.mark_payment_confirmed();

-- 6. One-off catch-up: record what is missing for invoices already marked paid / deposit paid.
--    Dated from the invoice's last update (when the status was set).
insert into public.payments (invoice_id, amount, paid_on, method, notes, source)
select i.id,
       round(t.target - coalesce(r.received, 0), 2),
       to_char((coalesce(i.updated_at, i.created_at) at time zone 'Africa/Johannesburg')::date, 'YYYY-MM-DD'),
       'EFT',
       'Catch-up: invoice was marked ' || replace(i.status, '_', ' ') || ' but the payment was never logged. Check the date and add the bank reference.',
       case when i.status = 'paid' then 'status_paid' else 'status_deposit' end
from public.invoices i
cross join lateral (
  select case when i.status = 'paid' then round(i.total, 2)
              else round(i.total * coalesce(i.deposit_percentage, 50) / 100, 2) end as target
) t
left join lateral (
  select sum(p.amount) as received from public.payments p where p.invoice_id = i.id
) r on true
where i.type = 'invoice'
  and i.status in ('paid', 'deposit_paid')
  and i.total > 0
  and coalesce(r.received, 0) + 0.005 < t.target;

notify pgrst, 'reload schema';
