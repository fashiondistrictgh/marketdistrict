# Payment Flow

Market District supports **Paystack** and **Flutterwave**. The active provider is
chosen via `PAYMENT_PROVIDER`.

## Order + payment lifecycle

```
Cart → create-order (edge fn) → order: pending, payment: pending
     → initialize payment with provider (public key, client-side)
     → customer pays on provider checkout
     → provider redirect / webhook
        ├─ verify-payment (edge fn, on redirect)  ─┐
        └─ payment-webhook (edge fn, server push) ─┴→ payment: paid, order: confirmed
```

## Why both verify and webhook?

- **`verify-payment`** runs when the customer returns to the app after paying.
  It calls the provider's verify endpoint with the secret key and updates state
  immediately for a responsive UX.
- **`payment-webhook`** is the authoritative reconciliation path. It validates
  the provider signature (Paystack HMAC-SHA512 / Flutterwave `verif-hash`) and
  catches cases where the customer never returns to the app.

Both are idempotent: marking an already-paid payment as paid is a no-op.

## Server-side re-pricing

`create-order` ignores client-supplied prices and recomputes the subtotal from
`products.price`, preventing tampering. Delivery fee is applied server-side.

## Keys

| Key | Where |
| --- | --- |
| `PAYSTACK_PUBLIC_KEY` / `FLUTTERWAVE_PUBLIC_KEY` | Mobile (`EXPO_PUBLIC_*`), client-side init. |
| `PAYSTACK_SECRET_KEY` / `FLUTTERWAVE_SECRET_KEY` | Edge functions only. |
| `FLUTTERWAVE_SECRET_HASH` | Webhook signature verification (edge fn). |

Never place secret keys in the mobile app.
