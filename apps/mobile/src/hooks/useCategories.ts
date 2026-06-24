import { useQuery } from "@tanstack/react-query";
import type { Category, CategoryRow } from "@/shared";

import { supabase } from "@/lib/supabase";
import { mapCategory } from "@/lib/mappers";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error || !data) return [];
      return (data as CategoryRow[]).map(mapCategory);
    },
  });
}
