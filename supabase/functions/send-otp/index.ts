// Edge function: send-otp
// Phone-number login step 1. Looks up the user by phone, generates a 6-digit
// code, stores it hashed (5-min expiry), and texts it via BulkSMS GH.

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let phone: string;
  try {
    phone = normalizePhone((await req.json()).phone ?? "");
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (!phone) return json({ error: "Enter a valid phone number." }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Must be a registered user (login, not signup).
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (!profile) {
    // Don't reveal whether a number exists — but this app wants a clear signup
    // prompt, so return a specific flag the app can act on.
    return json({ exists: false, error: "No account found for this number." }, 404);
  }

  // Generate + store a hashed 6-digit code.
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await sha256(`${phone}:${code}`);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Invalidate any earlier unconsumed codes for this phone.
  await admin.from("phone_otps").update({ consumed: true }).eq("phone", phone).eq("consumed", false);
  await admin.from("phone_otps").insert({ phone, code_hash: codeHash, expires_at: expiresAt });

  // Send via BulkSMS GH.
  const key = Deno.env.get("BULKSMS_API_KEY");
  const sender = Deno.env.get("BULKSMS_SENDER_ID") ?? "MarketDist";
  if (!key) return json({ error: "SMS is not configured." }, 500);

  const msg = `Your Market District code is ${code}. It expires in 5 minutes.`;
  const smsUrl =
    `https://clientlogin.bulksmsgh.com/smsapi?key=${encodeURIComponent(key)}` +
    `&to=${encodeURIComponent(phone)}&msg=${encodeURIComponent(msg)}` +
    `&sender_id=${encodeURIComponent(sender)}`;

  const smsRes = await fetch(smsUrl);
  const smsText = (await smsRes.text()).trim();
  // BulkSMS GH returns 1000 on success.
  if (!smsText.includes("1000")) {
    return json({ error: `Could not send SMS (code ${smsText}).` }, 502);
  }

  return json({ exists: true, sent: true }, 200);
});

/** Normalizes Ghana numbers to the local 0XXXXXXXXX form BulkSMS expects. */
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
