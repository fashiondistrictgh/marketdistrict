# Deployment Guide

## Supabase backend

1. Create a project at [supabase.com](https://supabase.com).
2. Link the CLI: `supabase link --project-ref <ref>`.
3. Push migrations: `supabase db push`.
4. Seed (optional): `npm run seed-database`.
5. Set function secrets:
   ```bash
   supabase secrets set \
     PAYSTACK_SECRET_KEY=... FLUTTERWAVE_SECRET_KEY=... FLUTTERWAVE_SECRET_HASH=...
   ```
6. Deploy edge functions:
   ```bash
   supabase functions deploy create-order verify-payment payment-webhook assign-delivery send-notification
   ```
7. Register the `payment-webhook` URL in the Paystack/Flutterwave dashboards.

## Admin dashboard (Next.js)

Deploy to **Vercel**:

1. Import the repo; set the root to `apps/admin-web` (or use the monorepo build).
2. Build command: `npm run build:admin` (from repo root) or `next build`.
3. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`.

## Mobile app (Expo / EAS)

1. Configure EAS: `eas build:configure` (sets the project ID in `app.json`).
2. Set env vars in EAS or `.env` (`EXPO_PUBLIC_*` only).
3. Build:
   ```bash
   npm run build:mobile:android
   npm run build:mobile:ios
   ```
4. Submit: `eas submit -p android` / `eas submit -p ios`.

## Environment matrix

| Variable | Backend | Admin | Mobile |
| --- | :---: | :---: | :---: |
| `SUPABASE_URL` / `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` | ✅ | ✅ | ✅ |
| Anon key | ✅ | ✅ | ✅ |
| Service-role key | ✅ | ✅ (server) | ❌ |
| Payment secret keys | ✅ | — | ❌ |
| Payment public keys | ✅ | — | ✅ |
