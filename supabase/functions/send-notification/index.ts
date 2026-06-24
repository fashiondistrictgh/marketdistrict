// Edge function: send-notification
// Inserts an in-app notification row (and is the place to fan out to push/email).

import { createClient } from "jsr:@supabase/supabase-js@2";

interface NotifyBody {
  userId: string;
  title: string;
  body?: string | null;
  type?: string | null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: NotifyBody;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!payload.userId || !payload.title) {
    return json({ error: "userId and title are required" }, 400);
  }

  // Service-role client so the function can notify any user.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await admin
    .from("notifications")
    .insert({
      user_id: payload.userId,
      title: payload.title,
      body: payload.body ?? null,
      type: payload.type ?? null,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);

  // TODO: fan out to Expo push tokens / email provider here.

  return json({ notification: data }, 201);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
