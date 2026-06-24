-- 004_orders_order_items.sql
-- Orders and their line items.

create sequence if not exists order_number_seq;

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique default ('MD-' || lpad(nextval('order_number_seq')::text, 6, '0')),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  status order_status not null default 'pending',
  subtotal numeric(12, 2) not null default 0,
  delivery_fee numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  address_id uuid references public.addresses (id) on delete set null,
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function set_updated_at();

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  product_name text not null,
  unit_price numeric(12, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
