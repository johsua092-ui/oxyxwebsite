-- OXYX API Database Schema
-- Run this in Supabase SQL Editor

-- API request logs
create table if not exists api_logs (
  id uuid default gen_random_uuid() primary key,
  endpoint text not null,
  method text not null default 'GET',
  status_code int not null default 200,
  response_time_ms int not null default 0,
  user_agent text default '',
  ip_address text default '',
  created_at timestamptz default now()
);

-- Daily aggregated stats
create table if not exists daily_stats (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  total_requests int not null default 0,
  total_errors int not null default 0,
  avg_response_ms int not null default 0
);

-- API endpoint registry
create table if not exists api_endpoints (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  path text not null unique,
  method text not null default 'GET',
  category text not null default 'general',
  description text default '',
  is_active boolean default true,
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_api_logs_created on api_logs(created_at desc);
create index if not exists idx_api_logs_endpoint on api_logs(endpoint);
create index if not exists idx_daily_stats_date on daily_stats(date desc);
create index if not exists idx_api_endpoints_category on api_endpoints(category);

-- Enable RLS
alter table api_logs enable row level security;
alter table daily_stats enable row level security;
alter table api_endpoints enable row level security;

-- Public read policy for stats
create policy "public read daily_stats" on daily_stats for select using (true);
create policy "public read api_endpoints" on api_endpoints for select using (true);

-- Service role insert for logs
create policy "service insert logs" on api_logs for insert with check (true);
create policy "public read logs" on api_logs for select using (true);
