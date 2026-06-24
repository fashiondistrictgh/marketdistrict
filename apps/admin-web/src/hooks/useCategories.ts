"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, CategoryRow } from "@/shared";
import { slugify } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { mapCategory } from "@/lib/mappers";

export interface CategoryInput {
  name: string;
  icon?: string | null;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error || !data) return [];
      return (data as CategoryRow[]).map(mapCategory);
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const supabase = createClient();
      const { error } = await supabase.from("categories").insert({
        name: input.name,
        slug: slugify(input.name),
        icon: input.icon ?? null,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CategoryInput }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("categories")
        .update({ name: input.name, icon: input.icon ?? null } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
