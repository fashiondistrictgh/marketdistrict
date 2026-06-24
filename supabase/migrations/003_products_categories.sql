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
