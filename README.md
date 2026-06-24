# Market District

A grocery delivery platform. **Two standalone apps** plus a shared Supabase backend.
Each app has its own `node_modules` and `package.json` — just `cd` into one and run it.
(No monorepo / workspaces.)

| App | Stack | Path |
| --- | --- | --- |
| **Customer mobile app** | React Native, Expo, Expo Router, TypeScript, NativeWind | [`apps/mobile`](apps/mobile) |
| **Admin dashboard** | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide, Recharts, Framer Motion | [`apps/admin-web`](apps/admin-web) |
| **Backend** | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) | [`supabase`](supabase) |

Both apps talk to the **same Supabase backend**.

## Shared code

There is no shared npm package. The common types, constants, Zod schemas, and
utilities live as a **copy inside each app** at `src/shared/`, imported as
`@/shared`. If you change shared logic, update both copies
(`apps/mobile/src/shared` and `apps/admin-web/src/shared`).

## Prerequisites

- Node.js >= 20
- [Expo Go](https://expo.dev/go) app on your phone (for mobile testing)
- [Supabase CLI](https://supabase.com/docs/guides/cli) for migrations and edge functions

---

## Run the mobile app

```bash
cd apps/mobile
npm install                 # first time only
cp .env.example .env        # then fill in your keys
npm run dev                 # = expo start
```

Then open it:

| Target | How |
| --- | --- |
| **Phone** | Scan the QR code with **Expo Go** |
| **Web** | Press `w` in the terminal |
| **Android emulator** | Press `a` |
| **iOS simulator** (Mac) | Press `i` |

Mobile build scripts: `npm run build:android`, `npm run build:ios` (EAS).

## Run the admin dashboard

```bash
cd apps/admin-web
npm install                       # first time only
cp .env.local.example .env.local  # then fill in your keys
npm run dev                       # http://localhost:3000
```

Production build: `npm run build` then `npm start`.

---

## Environment variables

Secrets are split by trust boundary:

- **`apps/admin-web/.env.local`** — server-side admin code may use the service-role key.
- **`apps/mobile/.env`** — only `EXPO_PUBLIC_*` keys. **Never** put the service-role key
  here; everything in a mobile bundle is public.
- **Root `.env.example`** — reference for backend tooling / edge functions (service-role key).

## Backend

See [`supabase/`](supabase) for migrations, seed data, and edge functions, and
[`docs/`](docs) for the project overview, database design, roles, payment flow, and
deployment/testing guides. Repo-level tooling lives in [`scripts/`](scripts) (run with
`npx tsx scripts/<file>.ts`).

## Repository layout

```
market-district/
├── apps/
│   ├── mobile/        # Standalone Expo customer app (src/shared = copied shared code)
│   └── admin-web/     # Standalone Next.js admin dashboard (src/shared = copied shared code)
├── supabase/          # Migrations, seed data, edge functions
├── docs/              # Project documentation
└── scripts/           # Backend tooling (generate-types, seed-database)
```
