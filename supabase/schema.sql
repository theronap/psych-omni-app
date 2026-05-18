-- psych-omni-app: supabase/schema.sql
-- Bootstrap schema derived from src/lib/db/schema.ts (Drizzle).
-- Idempotent — safe to re-run.
--
-- Note: the app connects via DATABASE_URL (direct Postgres / Drizzle), which
-- runs as the postgres superuser and bypasses RLS. RLS is enabled here for
-- defence-in-depth — it prevents any accidental anon-key exposure from
-- leaking data even if someone wires up the Supabase JS client directly.

-- =========================================================================
-- sessions: anonymous assessment sessions identified by cookie
-- =========================================================================
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  email       text,
  created_at  timestamptz not null default now(),
  last_active timestamptz not null default now()
);

alter table sessions enable row level security;
-- No anon policies — all access is server-side via Drizzle (service role)

-- =========================================================================
-- profiles: psychological profile captured during the assessment
-- One per session; rebuilt if the assessment is retaken.
-- =========================================================================
create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  dimensions  jsonb not null,
  open_ended  jsonb not null,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

-- =========================================================================
-- reports: generated analysis reports (core + per-module)
-- =========================================================================
create table if not exists reports (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  module_type text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

alter table reports enable row level security;

-- =========================================================================
-- Grants
-- =========================================================================
-- All access is via Drizzle (direct DB connection, runs as service role).
-- No anon or authenticated grants needed — deny-by-default is correct.
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
