// Edge function: verify-otp
// Phone-number login step 2. Validates the 6-digit code and, on success, returns
// a Supabase session (access + refresh tokens) the app uses to sign in.

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let phone = "";
  let code = "";
  try {
    const body = await req.json();
    phone = normalizePhone(body.phone ?? "");
    code = String(body.code ?? "").trim();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (!phone || code.length !== 6) return json({ error: "Enter the 6-digit code." }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find the latest unconsumed code for this phone.
  const { data: otp } = await admin
    .from("phone_otps")
    .select("*")
    .eq("phone", phone)
    .eq("consumed", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp) return json({ error: "No active code. Please request a new one." }, 400);
  if (new Date(otp.expires_at) < new Date()) {
    return json({ error: "Code expired. Please request a new one." }, 400);
  }
  if (otp.attempts >= 5) {
    return json({ error: "Too many attempts. Request a new code." }, 429);
  }

  const codeHash = await sha256(`${phone}:${code}`);
  if (codeHash !== otp.code_hash) {
    await admin.from("phone_otps").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
    return json({ error: "Incorrect code. Try again." }, 400);
  }

  // Valid — consume it.
  await admin.from("phone_otps").update({ consumed: true }).eq("id", otp.id);

  // Look up the user's email (their account login identity).
  const { data: profile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("phone", phone)
    .maybeSingle();
  if (!profile?.email) return json({ error: "Account not found." }, 404);

  // Mint a session: generate a magiclink, then verify its token_hash to exchange
  // for a real session (access + refresh tokens) without a password.
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: profile.email,
  });
  if (linkErr || !link?.properties?.hashed_token) {
    return json({ error: "Could not start session." }, 500);
  }

  const anon = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data: session, error: verifyErr } = await anon.auth.verifyOtp({
    type: "magiclink",
    token_hash: link.properties.hashed_token,
  });
  if (verifyErr || !session.session) {
    return json({ error: "Could not complete sign-in." }, 500);
  }

  return json(
    {
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    },
    200,
  );
});

function normalizePhone(raw: string): string {
  let p = raw.replace(/[\s-()]/g, "");
  if (p.startsWith("+233")) p = "0" + p.slice(4);
  else if (p.startsWith("233")) p = "0" + p.slice(3);
  if (!/^0\d{9}$/.test(p)) return "";
  return p;
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
