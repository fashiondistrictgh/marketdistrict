# Testing Guide

> Test tooling is not yet wired up — this guide documents the intended setup so
> tests slot in consistently.

## Recommended stack

| Layer | Tool |
| --- | --- |
| Shared package units | [Vitest](https://vitest.dev) |
| Admin components | Vitest + React Testing Library |
| Mobile components | Jest + `jest-expo` + React Native Testing Library |
| End-to-end (admin) | Playwright |
| End-to-end (mobile) | Maestro or Detox |

## Suggested layout

```
packages/shared/src/**/*.test.ts
apps/admin-web/src/**/*.test.tsx
apps/mobile/src/**/*.test.tsx
e2e/                      # Playwright / Maestro flows
```

## Conventions

- Co-locate unit tests next to the file under test (`*.test.ts[x]`).
- Run per-workspace via `npm run test --workspace <name>`; add a root
  `npm run test` that fans out with `--workspaces --if-present`.
- Mock Supabase at the client boundary (`lib/supabase*`) so tests don't hit the
  network.
- Validate Zod schemas in `packages/shared` directly — they're the contract both
  apps rely on.

## Priority test targets

1. Shared utils (`currency`, `date`, `text`, `validation`) — pure, high-value.
2. Zod schemas — guard the data contract.
3. `create-order` re-pricing logic — security-critical.
4. RLS policies — verify customers cannot read others' orders (integration test
   against a local Supabase instance).
