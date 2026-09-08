-- ============================================================
-- Add suburb column to form_requests
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

alter table form_requests add column if not exists suburb text;
