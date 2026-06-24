// Edge function: assign-delivery
// Staff-only: assigns a rider to an order's delivery and marks it 'assigned'.

import { createClient } from "jsr:@supabase/supabase-js@2";

interface AssignBody {
  orderId: string;
  riderId: string;
  estimatedArrival?: string | null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  // Only staff may assign deliveries.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return json({ error: "Forbidden" }, 403);
  }

  let body: AssignBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { data: delivery, error } = await supabase
    .from("deliveries")
    .upsert(
      {
        order_id: body.orderId,
        rider_id: body.riderId,
        status: "assigned",
        estimated_arrival: body.estimatedArrival ?? null,
      },
      { onConflict: "order_id" },
    )
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ delivery }, 200);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
