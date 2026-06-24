import { z } from "zod";

import { PRODUCT_STATUS, PRODUCT_UNIT } from "../constants/product-status";

export const productSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  // Blank is allowed — the slug is auto-generated from the name when empty.
  slug: z.string().optional().or(z.literal("")),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  categoryId: z.string().uuid().optional().nullable().or(z.literal("")),
  price: z.number().nonnegative("Price cannot be negative"),
  compareAtPrice: z.number().nonnegative().optional().nullable(),
  unit: z.nativeEnum(PRODUCT_UNIT).default(PRODUCT_UNIT.PIECE),
  stockQuantity: z.number().int().nonnegative().default(0),
  imageUrls: z.array(z.string().url()).default([]),
  status: z.nativeEnum(PRODUCT_STATUS).default(PRODUCT_STATUS.DRAFT),
  isFeatured: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;
