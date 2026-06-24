import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().max(40).optional().nullable(),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
