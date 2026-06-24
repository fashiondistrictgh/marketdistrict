"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, ProductInput, ProductRow } from "@/shared";
import { slugify } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { mapProduct } from "@/lib/mappers";
import { SAMPLE_PRODUCTS } from "@/constants/sample-data";

export interface ProductsResult {
  products: Product[];
  isSample: boolean;
}

/** Maps the camelCase form input to a snake_case products row payload. */
function toRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description ?? null,
    category_id: input.categoryId ?? null,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    unit: input.unit,
    stock_quantity: input.stockQuantity,
    image_urls: input.imageUrls,
    status: input.status,
    is_featured: input.isFeatured,
  };
}

/**
 * Loads products from Supabase. If the table is empty (or the request fails),
 * falls back to SAMPLE_PRODUCTS so the UI is never blank. `isSample` tells the
 * page whether it's showing real or placeholder data.
 */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductsResult> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return { products: SAMPLE_PRODUCTS, isSample: true };
      }
      return { products: (data as ProductRow[]).map(mapProduct), isSample: false };
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .insert(toRow(input) as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ProductInput }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .update(toRow(input) as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async (): Promise<Product | null> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error || !data) {
        return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
      }
      return mapProduct(data as ProductRow);
    },
  });
}
