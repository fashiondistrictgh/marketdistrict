// Edge function: create-order
// Validates a cart, computes totals server-side, and inserts an order + items.
// Deno runtime (Supabase Edge Functions).

import { createClient } from "jsr:@supabase/supabase-js@2";

interface CreateOrderBody {
  addressId: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: "card" | "transfer" | "cash_on_delivery";
  deliveryNotes?: string | null;
}

const DELIVERY_FEE = 800;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";

  // Client scoped to the caller so RLS applies and customer_id = auth.uid().
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!body.items?.length) return json({ error: "Cart is empty" }, 400);

  // Re-price from the database — never trust client-supplied prices.
  const productIds = body.items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds);

  if (productsError) return json({ error: productsError.message }, 500);

  const priceMap = new Map(products!.map((p) => [p.id, p]));
  let subtotal = 0;
  const lineItems = body.items.map((item) => {
    const product = priceMap.get(item.productId);
    if (!product) throw new Error(`Unknown product: ${item.productId}`);
    const lineTotal = Number(product.price) * item.quantity;
    subtotal += lineTotal;
    return {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      line_total: lineTotal,
    };
  });

  const total = subtotal + DELIVERY_FEE;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      address_id: body.addressId,
      subtotal,
      delivery_fee: DELIVERY_FEE,
      total,
      delivery_notes: body.deliveryNotes ?? null,
    })
    .select()
    .single();

  if (orderError) return json({ error: orderError.message }, 500);

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));

  if (itemsError) return json({ error: itemsError.message }, 500);

  return json({ order }, 201);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
