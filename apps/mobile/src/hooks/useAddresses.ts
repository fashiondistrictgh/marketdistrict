import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address } from "@/shared";

import { supabase } from "@/lib/supabase";

interface AddressRowLite {
  id: string;
  customer_id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  is_default: boolean;
}

function mapAddress(r: AddressRowLite): Address {
  return {
    id: r.id,
    customerId: r.customer_id,
    label: r.label,
    line1: r.line1,
    line2: r.line2,
    city: r.city,
    state: r.state,
    postalCode: r.postal_code,
    isDefault: r.is_default,
  };
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async (): Promise<Address[]> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false });
      if (error || !data) return [];
      return (data as AddressRowLite[]).map(mapAddress);
    },
  });
}

export interface NewAddress {
  label: string;
  line1: string;
  city: string;
  isDefault?: boolean;
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewAddress) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in.");
      const { error } = await supabase.from("addresses").insert({
        customer_id: user.id,
        label: input.label || null,
        line1: input.line1,
        city: input.city,
        is_default: input.isDefault ?? false,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
