# Database Design

Postgres schema managed by Supabase migrations in
[`supabase/migrations`](../supabase/migrations). Apply with `supabase db reset`
(local) or `supabase db push` (remote).

## Tables

| Table | Purpose |
| --- | --- |
| `profiles` | One row per auth user; holds role, name, contact, avatar. |
| `addresses` | Customer delivery addresses (owner-scoped). |
| `categories` | Catalog categories. |
| `products` | Catalog products (price, stock, status, images). |
| `orders` | Customer orders with totals and status. |
| `order_items` | Line items snapshotted at purchase time. |
| `payments` | Payment records linked to orders. |
| `deliveries` | Rider assignment and live tracking, one per order. |
| `notifications` | Per-user in-app notifications. |

## Enums

`user_role`, `order_status`, `payment_status`, `payment_method`,
`product_status`, `delivery_status` — mirrored as constants in
`packages/shared/src/constants`.

## Key relationships

```
auth.users 1─1 profiles 1─* addresses
profiles 1─* orders 1─* order_items *─1 products *─1 categories
orders 1─* payments
orders 1─1 deliveries *─1 profiles (rider)
profiles 1─* notifications
```

## Conventions

- All tables use `uuid` primary keys (`uuid_generate_v4()`).
- `created_at` / `updated_at` are `timestamptz`; `updated_at` is maintained by
  the shared `set_updated_at()` trigger.
- Order numbers are generated via the `order_number_seq` sequence (`MD-000123`).
- Monetary columns are `numeric(12,2)`.

## Row Level Security

RLS is enabled on every table in `008_row_level_security.sql`. Customers can
only read/write their own data; staff (`admin`, `manager`) can read everything
and manage the catalog, orders, and deliveries. The `is_staff()` helper
encapsulates the role check.

## Type generation

Run `npm run generate-types` to regenerate
`packages/shared/src/types/database.generated.ts` from the live schema.
