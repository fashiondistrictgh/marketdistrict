// Edge function: verify-payment
// Verifies a transaction reference against the payment provider and updates
// the payment + order status. Uses the service-role key (server-side only).

import { createClient } from "jsr:@supabase/supabase-js@2";

interface VerifyBody {
  reference: string;
  provider: "paystack" | "flutterwave";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: VerifyBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const verified = await verifyWithProvider(body.provider, body.reference);
  if (!verified.success) {
    await admin
      .from("payments")
      .update({ status: "failed" })
      .eq("reference", body.reference);
    return json({ status: "failed" }, 200);
  }

  const { data: payment, error } = await admin
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("reference", body.reference)
    .select("order_id, amount")
    .single();

  if (error) return json({ error: error.message }, 500);

  // Confirm the related order once payment succeeds.
  await admin.from("orders").update({ status: "confirmed" }).eq("id", payment.order_id);

  return json(
    {
      reference: body.reference,
      status: "paid",
      amount: payment.amount,
      provider: body.provider,
    },
    200,
  );
});

async function verifyWithProvider(
  provider: VerifyBody["provider"],
  reference: string,
): Promise<{ success: boolean }> {
  if (provider === "paystack") {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}` } },
    );
    const data = await res.json();
    return { success: data?.data?.status === "success" };
  }

  // flutterwave
  const res = await fetch(
    `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
    { headers: { Authorization: `Bearer ${Deno.env.get("FLUTTERWAVE_SECRET_KEY")}` } },
  );
  const data = await res.json();
  return { success: data?.data?.status === "successful" };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
