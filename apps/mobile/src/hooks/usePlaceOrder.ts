import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartLine } from "@/shared";

import { supabase } from "@/lib/supabase";

interface PlaceOrderInput {
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  deliveryAddress: string;
  phone: string;
  paymentMethod: "cash_on_delivery" | "card";
}

/**
 * Creates an order + its line items in Supabase (RLS: customer_id = auth.uid()).
 * Returns the created order id.
 */
export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PlaceOrderInput): Promise<string> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to place an order.");

      const total = input.subtotal + input.deliveryFee;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          status: "pending",
          subtotal: input.subtotal,
          delivery_fee: input.deliveryFee,
          discount: 0,
          total,
          delivery_notes: `${input.deliveryAddress} · ${input.phone}`,
        } as never)
        .select("id")
        .single();

      if (orderError || !order) throw orderError ?? new Error("Could not create order.");
      const orderId = (order as { id: string }).id;

      const lineItems = input.items.map((i) => ({
        order_id: orderId,
        product_id: i.productId,
        product_name: i.name,
        unit_price: i.unitPrice,
        quantity: i.quantity,
        line_total: i.unitPrice * i.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(lineItems as never);
      if (itemsError) throw itemsError;

      // For cash-on-delivery, record a pending payment row now. For card, the
      // initialize-payment edge function creates the payment row instead.
      if (input.paymentMethod === "cash_on_delivery") {
        await supabase.from("payments").insert({
          order_id: orderId,
          method: "cash_on_delivery",
          status: "pending",
          amount: total,
          currency: "GHS",
        } as never);
      }

      qc.invalidateQueries({ queryKey: ["orders"] });
      return orderId;
    },
  });
}
