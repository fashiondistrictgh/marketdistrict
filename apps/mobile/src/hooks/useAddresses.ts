import { useQuery } from "@tanstack/react-query";
import type { Address } from "@/shared";

import { supabase } from "@/lib/supabase";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async (): Promise<Address[]> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Address[];
    },
  });
}
