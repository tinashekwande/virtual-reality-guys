-- ============================================================
-- Virtual Reality Guys — AI Business OS Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable pgcrypto
create extension if not exists "pgcrypto";

-- 1. Equipment Inventory
create table if not exists equipment (
  id               uuid default gen_random_uuid() primary key,
  name             text not null,
  serial_number    text unique,
  category         text not null check (category in ('VR Headset', 'Controller', 'Display/TV', 'Router', 'Power & Cables', 'Accessories')),
  status           text not null default 'available' check (status in ('available', 'assigned', 'maintenance', 'retired')),
  usage_count      int not null default 0,
  battery_health   int default 100,
  notes            text,
  last_inspected_at timestamptz default now(),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 2. Equipment Maintenance & Issue Logs
create table if not exists equipment_logs (
  id           uuid default gen_random_uuid() primary key,
  equipment_id uuid references equipment(id) on delete cascade,
  event_id     uuid references events(id) on delete set null,
  invoice_id   uuid references invoices(id) on delete set null,
  issue_type   text not null, -- e.g. 'connectivity', 'strap_wear', 'charging', 'lens_scratch', 'battery_drain'
  description  text not null,
  severity     text not null default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status       text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'ignored')),
  logged_by    text default 'VR Guys Staff',
  created_at   timestamptz default now(),
  resolved_at  timestamptz
);

-- 3. AI Actions & Approval Queue
create table if not exists ai_actions (
  id               uuid default gen_random_uuid() primary key,
  action_type      text not null, -- e.g. 'send_quote', 'send_whatsapp', 'send_email', 'create_invoice', 'assign_staff', 'payment_reminder', 'equipment_maintenance'
  level            int not null default 2 check (level in (1, 2, 3)), -- Level 1: Auto, Level 2: Approval Req, Level 3: Human Only
  status           text not null default 'pending_approval' check (status in ('pending_approval', 'approved', 'rejected', 'executed', 'failed')),
  title            text not null,
  description      text,
  payload          jsonb not null default '{}'::jsonb,
  result           jsonb,
  error            text,
  requires_approval boolean not null default true,
  created_by       text default 'VR Guys AI Engine',
  approved_by      text,
  created_at       timestamptz default now(),
  executed_at      timestamptz
);

-- 4. Complete AI Audit Logs
create table if not exists ai_audit_logs (
  id             uuid default gen_random_uuid() primary key,
  action_id      uuid references ai_actions(id) on delete set null,
  action_name    text not null,
  category       text not null default 'general', -- 'sales', 'booking', 'finance', 'operations', 'customer', 'system'
  actor          text not null default 'AI Engine',
  target_record  text, -- e.g. 'Invoice #VR-INV-2026-104', 'Booking Natasha'
  details        jsonb not null default '{}'::jsonb,
  status         text not null default 'success',
  created_at     timestamptz default now()
);

-- 5. AI Event Operational Plans
create table if not exists event_plans (
  id                  uuid default gen_random_uuid() primary key,
  event_id            uuid references events(id) on delete cascade,
  invoice_id          uuid references invoices(id) on delete cascade,
  client_name         text not null,
  event_date          text not null,
  readiness_score     int not null default 50, -- 0 to 100
  timeline            jsonb not null default '[]'::jsonb,
  staffing_plan       jsonb not null default '[]'::jsonb,
  equipment_checklist jsonb not null default '[]'::jsonb,
  travel_plan         jsonb not null default '{}'::jsonb,
  notes               text,
  status              text not null default 'draft' check (status in ('draft', 'confirmed', 'in_progress', 'completed')),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 6. AI Post-Event Debriefs
create table if not exists event_debriefs (
  id                  uuid default gen_random_uuid() primary key,
  event_id            uuid references events(id) on delete cascade,
  invoice_id          uuid references invoices(id) on delete cascade,
  client_name         text,
  event_date          text,
  outcome             text not null default 'successful' check (outcome in ('successful', 'minor_issues', 'delayed', 'interrupted', 'failed')),
  customer_satisfaction text not null default 'positive' check (customer_satisfaction in ('positive', 'neutral', 'negative')),
  delay_minutes       int not null default 0,
  equipment_issues    jsonb not null default '[]'::jsonb,
  staff_notes         text,
  action_items        jsonb not null default '[]'::jsonb,
  created_at          timestamptz default now()
);

-- 7. Follow-ups & Lifecycle Tracking
create table if not exists follow_ups (
  id               uuid default gen_random_uuid() primary key,
  client_name      text not null,
  client_email     text,
  client_phone     text,
  invoice_id       uuid references invoices(id) on delete cascade,
  request_id       uuid references form_requests(id) on delete cascade,
  stage            text not null default 'quote_followup', -- 'quote_followup', 'deposit_reminder', 'event_prep', 'payment_balance', 'review_request'
  scheduled_for    timestamptz not null,
  status           text not null default 'pending' check (status in ('pending', 'sent', 'cancelled', 'replied')),
  channel          text not null default 'email' check (channel in ('email', 'whatsapp', 'sms')),
  message_draft    text not null,
  generated_reason text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 8. AI Settings & Business Context
create table if not exists ai_settings (
  id                 uuid default gen_random_uuid() primary key,
  model              text not null default 'gemini-2.5-flash',
  automation_toggles jsonb not null default '{
    "auto_draft_quotes": true,
    "auto_conflict_detection": true,
    "auto_daily_briefing": true,
    "auto_followups": true,
    "auto_payment_reminders": true,
    "auto_event_planning": true,
    "auto_lead_scoring": true
  }'::jsonb,
  business_context   jsonb not null default '{
    "company_name": "Virtual Reality Guys",
    "currency": "ZAR",
    "base_location": "Cape Town, Western Cape",
    "free_radius_areas": ["Kraaifontein", "Brackenfell", "Durbanville", "Bellville", "Kuils River", "Joostenberg Vlakte", "Pinehurst", "Buh-Rein Estate"],
    "deposit_percentage": 50,
    "fnb_account": "63124445502",
    "packages": [
      {"name": "Starter Package", "price": 499, "headsets": 2, "hours": 2, "staff": 1, "players": 10},
      {"name": "Standard Package", "price": 899, "headsets": 4, "hours": 3, "staff": 2, "players": 20},
      {"name": "Premium Package", "price": 1299, "headsets": 6, "hours": 4, "staff": 3, "players": 40}
    ]
  }'::jsonb,
  approval_rules     jsonb not null default '{
    "require_quote_approval": true,
    "require_email_approval": true,
    "require_whatsapp_approval": true,
    "require_discount_approval": true,
    "require_staff_assignment_approval": false
  }'::jsonb,
  updated_at         timestamptz default now()
);

-- Enable RLS
alter table equipment enable row level security;
alter table equipment_logs enable row level security;
alter table ai_actions enable row level security;
alter table ai_audit_logs enable row level security;
alter table event_plans enable row level security;
alter table event_debriefs enable row level security;
alter table follow_ups enable row level security;
alter table ai_settings enable row level security;

-- Universal policies for authenticated admin
create policy "Admin all equipment" on equipment for all using (true) with check (true);
create policy "Admin all equipment_logs" on equipment_logs for all using (true) with check (true);
create policy "Admin all ai_actions" on ai_actions for all using (true) with check (true);
create policy "Admin all ai_audit_logs" on ai_audit_logs for all using (true) with check (true);
create policy "Admin all event_plans" on event_plans for all using (true) with check (true);
create policy "Admin all event_debriefs" on event_debriefs for all using (true) with check (true);
create policy "Admin all follow_ups" on follow_ups for all using (true) with check (true);
create policy "Admin all ai_settings" on ai_settings for all using (true) with check (true);

-- Indexes for high-speed queries
create index if not exists idx_equipment_category_status on equipment(category, status);
create index if not exists idx_equipment_logs_equipment_id on equipment_logs(equipment_id);
create index if not exists idx_ai_actions_status on ai_actions(status, created_at);
create index if not exists idx_ai_audit_logs_created_at on ai_audit_logs(created_at desc);
create index if not exists idx_event_plans_event_date on event_plans(event_date);
create index if not exists idx_follow_ups_status_scheduled on follow_ups(status, scheduled_for);

-- Seed initial standard equipment inventory if table is empty
insert into equipment (name, serial_number, category, status, usage_count, battery_health, notes)
select * from (values
  ('Meta Quest 3 Headset #01', 'VRG-Q3-001', 'VR Headset', 'available', 34, 98, 'Equipped with Kiwi Elite Comfort Strap & Silicone Cover'),
  ('Meta Quest 3 Headset #02', 'VRG-Q3-002', 'VR Headset', 'available', 31, 95, 'Equipped with Kiwi Elite Comfort Strap & Silicone Cover'),
  ('Meta Quest 3 Headset #03', 'VRG-Q3-003', 'VR Headset', 'available', 42, 91, 'Primary Tournament Unit'),
  ('Meta Quest 3 Headset #04', 'VRG-Q3-004', 'VR Headset', 'available', 28, 97, 'Equipped with Kiwi Elite Comfort Strap'),
  ('Meta Quest 3 Headset #05', 'VRG-Q3-005', 'VR Headset', 'available', 19, 100, 'New Unit'),
  ('Meta Quest 3 Headset #06', 'VRG-Q3-006', 'VR Headset', 'available', 22, 99, 'New Unit'),
  ('Meta Quest 2 Headset #07 (Backup)', 'VRG-Q2-007', 'VR Headset', 'available', 58, 88, 'Backup / Extra Unit'),
  ('Meta Quest 2 Headset #08 (Backup)', 'VRG-Q2-008', 'VR Headset', 'available', 54, 85, 'Backup / Extra Unit'),
  ('55" 4K UHD Spectator Display #01', 'VRG-TV-001', 'Display/TV', 'available', 40, 100, 'Heavy Duty Tripod Stand Included'),
  ('55" 4K UHD Spectator Display #02', 'VRG-TV-002', 'Display/TV', 'available', 35, 100, 'Heavy Duty Tripod Stand Included'),
  ('Wi-Fi 6 Dedicated VR Router (TP-Link AX3000)', 'VRG-NET-001', 'Router', 'available', 48, 100, 'Pre-configured 5GHz low-latency casting channel'),
  ('High-Capacity VR Charging Station Dock (8-Bay)', 'VRG-PWR-001', 'Power & Cables', 'available', 48, 100, 'Fast Charging + Controller Dock')
) as t(name, serial_number, category, status, usage_count, battery_health, notes)
where not exists (select 1 from equipment);

-- Seed initial AI settings row if table is empty
insert into ai_settings (model)
select 'gemini-2.5-flash'
where not exists (select 1 from ai_settings);
