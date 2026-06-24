import { z } from "zod";

import { PAYMENT_METHOD, PAYMENT_PROVIDER } from "../constants/payment-status";

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  provider: z.nativeEnum(PAYMENT_PROVIDER),
  method: z.nativeEnum(PAYMENT_METHOD),
  amount: z.number().positive(),
  currency: z.string().length(3).default("GHS"),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  provider: z.nativeEnum(PAYMENT_PROVIDER),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
