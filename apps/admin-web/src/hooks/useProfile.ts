"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async (): Promise<ProfileData | null> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      const p = data as { full_name: string | null; phone: string | null } | null;
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: p?.full_name ?? "",
        phone: p?.phone ?? "",
      };
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, fullName, phone }: { id: string; fullName: string; phone: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-profile"] }),
  });
}
