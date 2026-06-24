import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z
    .string()
    .min(7, "Invalid phone number")
    .max(20)
    .optional()
    .nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
