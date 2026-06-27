// Edge function: initialize-payment
// Server-side Paystack transaction initialization. Holds the SECRET key (never
// exposed to the app), creates a transaction, and returns the authorization_url
// the mobile app opens in a browser. Also records a pending payment row.

import { createClient } from "jsr:@supabase/supabase-js@2";

interface InitBody {
  orderId: string;
  email: string;
  amount: number; // in GHS (major units)
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: InitBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!body.orderId || !body.email || !body.amount) {
    return json({ error: "orderId, email and amount are required" }, 400);
  }

  const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secret) return json({ error: "Payments are not configured." }, 500);

  // Paystack expects the smallest currency unit (pesewas for GHS).
  const amountMinor = Math.round(body.amount * 100);
  const reference = `MD-${body.orderId.replace(/-/g, "").slice(0, 10).toUpperCase()}-${Date.now()
    .toString()
    .slice(-5)}`;

  const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      amount: amountMinor,
      currency: "GHS",
      reference,
      metadata: { orderId: body.orderId },
    }),
  });

  const initData = await initRes.json();
  if (!initData.status) {
    return json({ error: initData.message ?? "Could not start payment." }, 502);
  }

  // Record a pending payment row tied to the order.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  await admin.from("payments").insert({
    order_id: body.orderId,
    provider: "paystack",
    method: "card",
    status: "pending",
    amount: body.amount,
    currency: "GHS",
    reference,
  });

  return json(
    {
      authorizationUrl: initData.data.authorization_url,
      reference,
    },
    200,
  );
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
