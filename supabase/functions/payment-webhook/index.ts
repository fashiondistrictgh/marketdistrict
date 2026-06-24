// Edge function: payment-webhook
// Receives provider webhooks (Paystack / Flutterwave), verifies the signature,
// and reconciles payment + order status. Public endpoint — signature is the gate.

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();

  // Verify the webhook came from a known provider.
  const provider = detectProvider(req);
  const valid = await verifySignature(provider, req, raw);
  if (!valid) return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(raw);
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const reference = extractReference(provider, event);
  if (!reference) return new Response("No reference", { status: 400 });

  const succeeded = isSuccess(provider, event);

  const { data: payment } = await admin
    .from("payments")
    .update({
      status: succeeded ? "paid" : "failed",
      paid_at: succeeded ? new Date().toISOString() : null,
    })
    .eq("reference", reference)
    .select("order_id")
    .single();

  if (succeeded && payment) {
    await admin.from("orders").update({ status: "confirmed" }).eq("id", payment.order_id);
  }

  return new Response("ok", { status: 200 });
});

function detectProvider(req: Request): "paystack" | "flutterwave" {
  return req.headers.has("x-paystack-signature") ? "paystack" : "flutterwave";
}

async function verifySignature(
  provider: "paystack" | "flutterwave",
  req: Request,
  raw: string,
): Promise<boolean> {
  if (provider === "paystack") {
    const signature = req.headers.get("x-paystack-signature") ?? "";
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "";
    const expected = await hmacSha512Hex(secret, raw);
    return signature === expected;
  }
  // Flutterwave sends a static secret hash header.
  const hash = req.headers.get("verif-hash") ?? "";
  return hash === (Deno.env.get("FLUTTERWAVE_SECRET_HASH") ?? "");
}

function extractReference(provider: string, event: any): string | null {
  if (provider === "paystack") return event?.data?.reference ?? null;
  return event?.data?.tx_ref ?? event?.data?.flw_ref ?? null;
}

function isSuccess(provider: string, event: any): boolean {
  if (provider === "paystack") return event?.event === "charge.success";
  return event?.data?.status === "successful";
}

async function hmacSha512Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
