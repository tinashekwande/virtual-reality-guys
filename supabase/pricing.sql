-- ============================================================
-- Virtual Reality Guys — Pricing Management
-- One row per price, package, add-on or pricing rule.
-- The portal's Pricing page edits this table, and Claude's
-- get_business_knowledge tool reads it as the pricing baseline.
-- Only the server (service role) reads/writes it, so RLS is on
-- with no public policies.
-- ============================================================

create table if not exists pricing_items (
  id              uuid default gen_random_uuid() primary key,
  category        text not null,              -- party | corporate | school | fitness | rental | repairs | addon | transport | policy
  name            text not null,
  price           numeric(12, 2),             -- null = quoted individually / rule only
  price_unit      text not null default 'per event', -- per event | per person | per learner | per hour | per headset | per session | quote | rule
  min_price       numeric(12, 2),             -- minimum charge (e.g. per-person pricing)
  duration_hours  numeric(5, 2),
  headsets        integer,
  staff           integer,
  max_players     integer,
  includes        text,                       -- what the client gets
  notes           text,                       -- internal guidance for quoting
  active          boolean not null default true, -- false = draft, not quoted to clients
  sort_order      integer not null default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists pricing_items_category_idx on pricing_items (category, sort_order);

alter table pricing_items enable row level security;

-- Seed (only when the table is empty)
insert into pricing_items (category, name, price, price_unit, duration_hours, headsets, staff, max_players, includes, notes, active, sort_order)
select * from (values
  -- Parties
  ('party', 'Starter Package', 999, 'per event', 2, 4, 1, 8, '4 headsets, 2 hours, up to 8 players, 1 supervisor, 30+ games', 'Small parties. Transport included.', true, 10),
  ('party', 'Standard Package', 1499, 'per event', 3, 5, 2, 12, '5 headsets, 3 hours, up to 12 players, 2 supervisors, 60+ games, multiplayer tournaments, spectator screen', 'Most popular. Transport included.', true, 20),
  ('party', 'Premium Package', 1999, 'per event', 4, 6, 2, 20, '6 headsets, 4 hours, up to 20 players, 2 supervisors, 100+ games, tournament brackets, photo & video', 'Bigger parties. Transport included.', true, 30),
  ('addon', 'Extra hour (parties)', 350, 'per hour', null, null, null, null, null, null, true, 10),
  ('addon', 'Extra headset (parties)', 150, 'per headset', null, null, null, null, null, null, true, 20),

  -- Corporate / team building (DRAFT until approved)
  ('corporate', 'Activation: half day', 4500, 'per event', 3, 6, 2, null, 'Up to 3 hours play, 6 headsets, 2 supervisors, spectator screen', 'DRAFT suggestion (21 Nov 2026), not yet approved.', false, 10),
  ('corporate', 'Activation: full day', 7500, 'per event', 6, 6, 2, null, 'Up to 6 hours play, 6 headsets, 2 supervisors, spectator screen', 'DRAFT suggestion (21 Nov 2026), not yet approved.', false, 20),
  ('corporate', 'Team building (facilitated)', 200, 'per person', 2.5, 6, 2, null, 'Facilitated teams, multiplayer tournament, leaderboard, prizes for winners', 'DRAFT: R180–R250 pp, minimum R3,500.', false, 30),
  ('corporate', 'Extra hour (corporate)', 900, 'per hour', null, null, null, null, null, 'DRAFT', false, 40),
  ('corporate', 'Extra headset (corporate)', 300, 'per headset', null, null, null, null, null, 'DRAFT', false, 50),
  ('corporate', 'Own Wi-Fi router', 300, 'per event', null, null, null, null, null, 'DRAFT', false, 60),
  ('corporate', 'Branded leaderboard / logo on screen', 500, 'per event', null, null, null, null, null, 'DRAFT', false, 70),

  -- Schools
  ('school', 'School VR session', null, 'quote', null, null, null, null, 'Educational and exploration experiences on site at the school', 'Quoted individually (hours, learners, staff). Reference: R25 per learner was quoted for ~1,850 learners (Nov 2026).', true, 10),

  -- Repairs
  ('repairs', 'Headset repairs', null, 'quote', null, null, null, null, 'Diagnosis and repair of VR headsets', 'Charged as parts plus labour.', true, 10),

  -- Transport & policies
  ('transport', 'Party transport', 0, 'rule', null, null, null, null, null, 'Party package prices include transport. No separate transport fee.', true, 10),
  ('policy', 'Deposit', null, 'rule', null, null, null, null, null, '50% deposit secures the date; balance on or before the day.', true, 10),
  ('policy', 'VAT', null, 'rule', null, null, null, null, null, 'Not a VAT vendor. Never add or mention VAT.', true, 20),
  ('policy', 'Setup time', null, 'rule', null, null, null, null, null, 'We arrive 15–20 minutes before the start to set up.', true, 30),
  ('policy', 'Space', null, 'rule', null, null, null, null, null, 'About 3m x 3m for the whole play area, plus a wall plug. Indoors or full shade.', true, 40)
) as seed
where not exists (select 1 from pricing_items);
