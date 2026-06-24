import type { ProductStatus, ProductUnit } from "../constants/product-status";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  price: number;
  compareAtPrice?: number | null;
  unit: ProductUnit;
  stockQuantity: number;
  imageUrls: string[];
  status: ProductStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductListItem = Pick<
  Product,
  "id" | "name" | "price" | "compareAtPrice" | "unit" | "imageUrls" | "status" | "stockQuantity"
>;
