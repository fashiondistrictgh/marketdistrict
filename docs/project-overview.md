# Project Overview

**Market District** is a grocery delivery platform consisting of a customer-facing
mobile app, an admin dashboard, and a shared Supabase backend.

## Components

- **`apps/mobile`** — React Native (Expo) customer app. File-based routing with
  Expo Router, styling with NativeWind, state with Zustand, data fetching with
  TanStack Query, and Supabase for auth/data.
- **`apps/admin-web`** — Next.js (App Router) admin dashboard. Tailwind CSS +
  shadcn/ui for UI, Lucide for icons, Recharts for analytics, Framer Motion for
  motion. Server Components read Supabase via SSR helpers.
- **`packages/shared`** — Types, constants, Zod schemas, and utilities consumed
  by both apps. Single source of truth for domain models and status enums.
- **`supabase`** — Migrations, seed data, and edge functions.

## High-level flow

1. Customer browses the catalog, adds items to the cart, and checks out.
2. The `create-order` edge function re-prices the cart and creates the order.
3. The customer pays via Paystack/Flutterwave; `verify-payment` and
   `payment-webhook` reconcile the payment and confirm the order.
4. Admin staff process the order, assign a rider (`assign-delivery`), and the
   customer tracks delivery in the app.
5. `send-notification` pushes status updates to the customer.

## Conventions

- TypeScript everywhere.
- Domain models live in `packages/shared`; apps import from
  `@market-district/shared`.
- Database row shapes use `snake_case`; app-facing models use `camelCase`.
- Secrets are split by trust boundary — see the README and `docs/user-roles.md`.
