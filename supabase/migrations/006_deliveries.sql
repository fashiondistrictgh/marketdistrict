-- 006_deliveries.sql
-- Delivery assignment and tracking, one per order.

create table if not exists public.deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  rider_id uuid references public.profiles (id) on delete set null,
  status delivery_status not null default 'unassigned',
  estimated_arrival timestamptz,
  delivered_at timestamptz,
  tracking_lat double precision,
  tracking_lng double precision,
  created_at timestamptz not null default now()
);

create unique index if not exists deliveries_order_id_idx on public.deliveries (order_id);
create index if not exists deliveries_rider_id_idx on public.deliveries (rider_id);
create index if not exists deliveries_status_idx on public.deliveries (status);
