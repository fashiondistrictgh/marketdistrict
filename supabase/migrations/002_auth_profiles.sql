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
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
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
