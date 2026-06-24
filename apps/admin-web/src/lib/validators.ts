// Re-export shared Zod schemas plus admin-only validators.
export {
  productSchema,
  createOrderSchema,
  profileSchema,
  initiatePaymentSchema,
  verifyPaymentSchema,
  addressSchema,
  validate,
} from "@/shared";

import { z } from "zod";

/** Admin login form. */
export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
