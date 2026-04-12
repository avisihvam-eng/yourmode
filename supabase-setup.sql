-- Mode — Supabase Schema Setup
-- Run this in the Supabase SQL Editor

-- Create the entries table
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  date date not null,
  habits jsonb default '{}'::jsonb,
  creation int default 0,
  reflection int default 0,
  consumption int default 0,
  net int default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Enable Row Level Security
alter table entries enable row level security;

-- Permissive policy (app-level filtering by user_id)
create policy "Allow all" on entries for all using (true) with check (true);
