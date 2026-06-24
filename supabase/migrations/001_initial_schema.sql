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
