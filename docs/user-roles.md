# User Roles & Access

Roles are stored on `profiles.role` (enum `user_role`).

| Role | Description | Access |
| --- | --- | --- |
| `customer` | Shopper using the mobile app | Own profile, addresses, orders, payments, notifications. |
| `admin` | Full store administrator | All admin dashboard features; manage users. |
| `manager` | Store operations | Most admin features (orders, products, deliveries). |
| `rider` | Delivery rider | Deliveries assigned to them. |

`ADMIN_ROLES` (`['admin', 'manager']`) defines who may access the admin
dashboard. The mobile app treats everyone as a `customer`.

## Enforcement layers

1. **Database (RLS)** — the source of truth. The `is_staff()` function gates
   staff-only reads/writes; owner checks (`auth.uid()`) gate customer data.
2. **Admin middleware** — `apps/admin-web/middleware.ts` redirects
   unauthenticated requests to `/login`. Pair with a role check in the dashboard
   layout (via `useAdminAuth`) to bounce non-staff.
3. **App UI** — hides actions a role can't perform (defense in depth, not the
   primary gate).

## Secrets by trust boundary

- **Service-role key**: backend tooling, edge functions, and admin server code
  only. Never shipped to the mobile bundle.
- **Anon key**: safe for both apps; RLS protects the data.
- Mobile only receives `EXPO_PUBLIC_*` variables.
