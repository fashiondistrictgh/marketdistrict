export const PRODUCT_STATUS = {
  ACTIVE: "active",
  DRAFT: "draft",
  OUT_OF_STOCK: "out_of_stock",
  ARCHIVED: "archived",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Active",
  draft: "Draft",
  out_of_stock: "Out of stock",
  archived: "Archived",
};

export const PRODUCT_UNIT = {
  PIECE: "piece",
  KG: "kg",
  GRAM: "g",
  LITRE: "l",
  PACK: "pack",
  BUNDLE: "bundle",
} as const;

export type ProductUnit = (typeof PRODUCT_UNIT)[keyof typeof PRODUCT_UNIT];
