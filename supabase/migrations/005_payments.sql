-- 005_payments.sql
-- Payment records, one (or more) per order.

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text,
  method payment_method not null default 'card',
  status payment_status not null default 'pending',
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'GHS',
  reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_reference_idx on public.payments (reference);
