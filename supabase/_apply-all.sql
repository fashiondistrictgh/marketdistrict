-- ============================================================
-- Market District — full schema + seed (generated)
-- Paste this entire file into Supabase Studio > SQL Editor > Run
-- ============================================================


-- ===== migrations/001_initial_schema.sql =====
-- 001_initial_schema.sql
-- Extensions and shared enums used across the schema.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enum types -------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer', 'admin', 'manager', 'rider');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum (
    'pending', 'processing', 'paid', 'failed', 'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('card', 'transfer', 'cash_on_delivery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type product_status as enum ('active', 'draft', 'out_of_stock', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_status as enum (
    'unassigned', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'
  );
exception when duplicate_object then null; end $$;

-- Shared trigger to keep updated_at fresh --------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ===== migrations/002_auth_profiles.sql =====
-- 002_auth_profiles.sql
-- Profiles table mirroring auth.users, plus customer addresses.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_customer_id_idx on public.addresses (customer_id);


-- ===== migrations/003_products_categories.sql =====
-- 003_products_categories.sql
-- Catalog: categories and products.

-- pg_trgm powers the ILIKE search used by the apps. Must exist before the
-- gin_trgm_ops index below is created.
create extension if not exists pg_trgm;

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price >= 0),
  unit text not null default 'piece',
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  image_urls text[] not null default '{}',
  status product_status not null default 'draft',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function set_updated_at();

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);

-- pg_trgm powers the ILIKE search used by the apps.
create extension if not exists pg_trgm;


-- ===== migrations/004_orders_order_items.sql =====
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


-- ===== migrations/005_payments.sql =====
-- 005_payments.sql
-- Payment records, one (or more) per order.

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text,
  method payment_method not null default 'card',
  status payment_status not null default 'pending',
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'NGN',
  reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_reference_idx on public.payments (reference);


-- ===== migrations/006_deliveries.sql =====
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


-- ===== migrations/007_notifications.sql =====
-- 007_notifications.sql
-- Per-user notifications (order updates, promos, etc.).

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  type text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_unread_idx
  on public.notifications (user_id) where is_read = false;


-- ===== migrations/008_row_level_security.sql =====
-- 008_row_level_security.sql
-- Enable RLS and define policies. Customers see their own data; staff see all.

-- Helper: is the current user an admin or manager?
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'manager')
  );
$$ language sql stable security definer;

-- Enable RLS ------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.addresses     enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.payments      enable row level security;
alter table public.deliveries    enable row level security;
alter table public.notifications enable row level security;

-- Profiles --------------------------------------------------------------
create policy "profiles_select_self_or_staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- Addresses (owner only) ------------------------------------------------
create policy "addresses_owner_all" on public.addresses
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Categories & products: public read, staff write -----------------------
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_staff_write" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

create policy "products_public_read" on public.products
  for select using (status = 'active' or public.is_staff());
create policy "products_staff_write" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

-- Orders & items: owner reads own, staff read all -----------------------
create policy "orders_owner_or_staff_read" on public.orders
  for select using (customer_id = auth.uid() or public.is_staff());
create policy "orders_owner_insert" on public.orders
  for insert with check (customer_id = auth.uid());
create policy "orders_staff_update" on public.orders
  for update using (public.is_staff());

create policy "order_items_read" on public.order_items
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

-- Payments: owner read own, staff all -----------------------------------
create policy "payments_read" on public.payments
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

-- Deliveries: staff and assigned rider ----------------------------------
create policy "deliveries_read" on public.deliveries
  for select using (public.is_staff() or rider_id = auth.uid());
create policy "deliveries_staff_write" on public.deliveries
  for all using (public.is_staff()) with check (public.is_staff());

-- Notifications (owner only) --------------------------------------------
create policy "notifications_owner_all" on public.notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ===== seed: categories =====
-- sample-categories.sql
-- Default grocery categories (mirrors packages/shared DEFAULT_CATEGORIES).

insert into public.categories (name, slug, icon, sort_order) values
  ('Fruits & Vegetables', 'fruits-vegetables', 'Apple', 1),
  ('Meat & Seafood',      'meat-seafood',      'Fish', 2),
  ('Dairy & Eggs',        'dairy-eggs',        'Egg', 3),
  ('Bakery',              'bakery',            'Croissant', 4),
  ('Beverages',           'beverages',         'CupSoda', 5),
  ('Snacks',              'snacks',            'Cookie', 6),
  ('Pantry & Staples',    'pantry',            'Wheat', 7),
  ('Frozen Foods',        'frozen',            'Snowflake', 8),
  ('Household',           'household',         'SprayCan', 9),
  ('Personal Care',       'personal-care',     'Sparkles', 10),
  ('Baby Care',           'baby',              'Baby', 11),
  ('Pet Supplies',        'pets',              'PawPrint', 12)
on conflict (slug) do nothing;

-- ===== seed: products =====
-- sample-products.sql
-- A handful of active products mapped to seeded categories.

insert into public.products (name, slug, description, category_id, price, compare_at_price, unit, stock_quantity, status, is_featured)
select v.name, v.slug, v.description, c.id, v.price, v.compare_at_price, v.unit, v.stock, 'active'::product_status, v.featured
from (values
  ('Fresh Bananas',     'fresh-bananas',     'Sweet, ripe bananas sold per bunch.', 'fruits-vegetables', 1200, 1500, 'bundle', 80,  true),
  ('Red Apples 1kg',    'red-apples-1kg',    'Crisp red apples.',                   'fruits-vegetables', 2500, null, 'kg',     60,  false),
  ('Whole Milk 1L',     'whole-milk-1l',     'Full-cream pasteurized milk.',        'dairy-eggs',        1800, null, 'l',      40,  false),
  ('Crate of Eggs',     'crate-of-eggs',     'Fresh eggs, crate of 30.',            'dairy-eggs',        3200, 3600, 'pack',   25,  true),
  ('Brown Bread Loaf',  'brown-bread-loaf',  'Freshly baked whole-wheat loaf.',     'bakery',            1500, null, 'piece',  30,  true),
  ('Orange Juice 1L',   'orange-juice-1l',   '100% pure orange juice.',             'beverages',         2200, null, 'l',      50,  false)
) as v(name, slug, description, cat_slug, price, compare_at_price, unit, stock, featured)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

