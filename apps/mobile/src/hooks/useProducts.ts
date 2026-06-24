import { useQuery } from "@tanstack/react-query";
import type { Product, ProductRow } from "@/shared";

import { supabase } from "@/lib/supabase";
import { mapProduct } from "@/lib/mappers";

interface UseProductsOptions {
  categoryId?: string;
  search?: string;
  featuredOnly?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase.from("products").select("*").eq("status", "active");

      if (options.categoryId) query = query.eq("category_id", options.categoryId);
      if (options.featuredOnly) query = query.eq("is_featured", true);
      if (options.search) query = query.ilike("name", `%${options.search}%`);

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as ProductRow[]).map(mapProduct);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) return null;
      return mapProduct(data as ProductRow);
    },
  });
}
