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
create policy "order_items_owner_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

-- Payments: owner read/create own, staff all ----------------------------
create policy "payments_read" on public.payments
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );
create policy "payments_owner_insert" on public.payments
  for insert with check (
    exists (
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
