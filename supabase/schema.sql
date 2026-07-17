-- ============================================================
-- Virtual Reality Guys — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ---- Categories ----
create table if not exists categories (
  id         uuid default gen_random_uuid() primary key,
  name       text not null unique,
  created_at timestamptz default now()
);

-- ---- Media ----
create table if not exists media (
  id          uuid default gen_random_uuid() primary key,
  file_url    text not null,
  type        text not null check (type in ('image','video')),
  title       text,
  description text,
  category_id uuid references categories(id) on delete set null,
  created_at  timestamptz default now()
);

-- ---- Team Members ----
create table if not exists team_members (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  role       text not null,
  image_url  text,
  bio        text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---- Form Requests ----
create table if not exists form_requests (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  form_type  text not null default 'contact',
  status     text not null default 'new'
             check (status in ('new','in_progress','completed','archived')),
  created_at timestamptz default now()
);

-- ---- Admin Profiles (links to Supabase Auth users) ----
create table if not exists admin_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'admin',
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS on all tables
alter table categories    enable row level security;
alter table media         enable row level security;
alter table team_members  enable row level security;
alter table form_requests enable row level security;
alter table admin_profiles enable row level security;

-- Public can read categories, media, team_members
create policy "Public read categories"   on categories    for select using (true);
create policy "Public read media"        on media         for select using (true);
create policy "Public read team"         on team_members  for select using (true);

-- Authenticated admins can do everything
create policy "Admin all categories"   on categories    for all using (auth.role() = 'authenticated');
create policy "Admin all media"        on media         for all using (auth.role() = 'authenticated');
create policy "Admin all team"         on team_members  for all using (auth.role() = 'authenticated');
create policy "Admin all requests"     on form_requests for all using (auth.role() = 'authenticated');
create policy "Admin all profiles"     on admin_profiles for all using (auth.role() = 'authenticated');

-- Public can INSERT form_requests (for the booking form)
create policy "Public submit requests" on form_requests for insert with check (true);

-- ============================================================
-- Storage Buckets (run separately if needed)
-- ============================================================
-- In Supabase Dashboard → Storage → New Bucket:
--   Name: "gallery"    → Public bucket ✅
--   Name: "team-avatars" → Public bucket ✅

-- ============================================================
-- Blog Posts Extension
-- ============================================================

-- ---- Blog Posts ----
create table if not exists blog_posts (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  slug            text not null unique,
  content         text not null,
  excerpt         text not null,
  featured_image  text,
  category        text not null,
  tags            text[] default '{}'::text[],
  reading_time    int not null default 5,
  author          text not null default 'Virtual Reality Guys',
  status          text not null default 'draft' check (status in ('draft', 'published')),
  seo_title       text,
  seo_description text,
  published_at    timestamptz default now(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Indexes for performance
create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_published_idx on blog_posts(status, published_at);

-- Row Level Security (RLS)
alter table blog_posts enable row level security;

-- Public read access for published posts (where status is 'published' and published_at <= now)
create policy "Public read published blog posts" on blog_posts
  for select using (
    status = 'published' 
    and (published_at is null or published_at <= now())
  );

-- Authenticated admins can perform all CRUD operations
create policy "Admin all blog posts" on blog_posts
  for all using (auth.role() = 'authenticated');

