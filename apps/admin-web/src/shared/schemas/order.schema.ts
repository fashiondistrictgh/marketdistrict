import { z } from "zod";

import { PAYMENT_METHOD } from "../constants/payment-status";

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  addressId: z.string().uuid({ message: "A delivery address is required" }),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD),
  deliveryNotes: z.string().max(500).optional().nullable(),
  couponCode: z.string().max(40).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
