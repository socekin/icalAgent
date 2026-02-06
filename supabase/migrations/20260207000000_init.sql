-- iCalAgent 完整表结构（清空重建）
create extension if not exists "pgcrypto";

-- 订阅表
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_key text not null unique,
  display_name text not null,
  domain text null,                -- 任意领域，无约束
  timezone text not null default 'UTC',
  feed_token text not null unique,
  sync_policy_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 事件表
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  external_id text not null,
  title text not null,
  description text null,
  start_at timestamptz not null,
  end_at timestamptz null,
  timezone text not null default 'UTC',
  location text null,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'postponed')),
  source_url text not null,
  source_hash text null,
  confidence numeric(4, 3) not null default 0.8 check (confidence >= 0 and confidence <= 1),
  labels_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subscription_id, external_id)
);

-- 同步记录表
create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  trace_id text not null,
  run_status text not null check (run_status in ('queued', 'running', 'success', 'failed')),
  inserted_count integer not null default 0,
  updated_count integer not null default 0,
  skipped_count integer not null default 0,
  error_message text null,
  started_at timestamptz not null default now(),
  finished_at timestamptz null
);

-- API 密钥表
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key_prefix text not null,
  key_hash text not null,
  name text not null default '',
  created_at timestamptz not null default now(),
  last_used_at timestamptz null,
  revoked_at timestamptz null
);

-- 索引
create index if not exists idx_subscriptions_feed_token on public.subscriptions (feed_token);
create index if not exists idx_subscriptions_updated_at on public.subscriptions (updated_at desc);
create index if not exists idx_subscriptions_user_id on public.subscriptions (user_id);
create index if not exists idx_events_subscription_start_at on public.events (subscription_id, start_at);
create index if not exists idx_sync_runs_subscription_started_at on public.sync_runs (subscription_id, started_at desc);
create index if not exists idx_api_keys_key_hash on public.api_keys (key_hash);
create index if not exists idx_api_keys_user_id on public.api_keys (user_id);
