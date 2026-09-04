-- ============================================================
-- Update form_requests status check constraint
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Drop the old 4-value check constraint if it exists
alter table form_requests drop constraint if exists form_requests_status_check;

-- Add updated check constraint allowing all extended lifecycle statuses
alter table form_requests add constraint form_requests_status_check
  check (status in (
    'new',
    'new_request',
    'in_progress',
    'pending_confirmation',
    'pending',
    'deposit_paid',
    'scheduled',
    'archived',
    'confirmed',
    'booking_confirmed',
    'completed',
    'event_completed',
    'cancelled'
  ));
