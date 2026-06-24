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
