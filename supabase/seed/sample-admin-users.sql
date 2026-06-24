-- sample-admin-users.sql
-- Promote existing auth users to staff roles.
--
-- Create the auth users first (Supabase Studio > Authentication, or the CLI),
-- then run this to grant roles. Update the emails to match your accounts.

update public.profiles
set role = 'admin', full_name = coalesce(full_name, 'Store Admin')
where email = 'admin@marketdistrict.com';

update public.profiles
set role = 'manager', full_name = coalesce(full_name, 'Store Manager')
where email = 'manager@marketdistrict.com';

update public.profiles
set role = 'rider', full_name = coalesce(full_name, 'Delivery Rider')
where email = 'rider@marketdistrict.com';
