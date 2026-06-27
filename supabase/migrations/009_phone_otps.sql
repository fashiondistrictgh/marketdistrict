-- 009_phone_otps.sql
-- One-time codes for phone-number login (sent via BulkSMS GH).
-- Codes are stored hashed; rows expire after a few minutes.

create table if not exists public.phone_otps (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed boolean not null default false,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists phone_otps_phone_idx on public.phone_otps (phone);
create index if not exists phone_otps_expires_idx on public.phone_otps (expires_at);

-- RLS: this table is ONLY touched by edge functions using the service-role key,
-- so enable RLS with no policies (blocks all anon/auth client access).
alter table public.phone_otps enable row level security;
