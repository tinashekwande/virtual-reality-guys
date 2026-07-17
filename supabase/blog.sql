-- ============================================================
-- Virtual Reality Guys — Blog Schema Extensions
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ---- Blog Posts ----
create table if not exists blog_posts (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  slug            text not null unique,
  content         text not null,
  excerpt         text not null,
  featured_image  text,
  category        text not null, -- e.g., 'Birthday Parties', 'Schools', etc.
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
