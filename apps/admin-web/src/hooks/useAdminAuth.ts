"use client";

import { useEffect, useState } from "react";
import { ADMIN_ROLES, type UserRole } from "@/shared";

import { createClient } from "@/lib/supabase/client";

interface AdminAuthState {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
}

/** Reads the current session and the caller's role from their profile. */
export function useAdminAuth(): AdminAuthState & { signOut: () => Promise<void> } {
  const [state, setState] = useState<AdminAuthState>({
    userId: null,
    email: null,
    role: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;
      if (!user) {
        setState({ userId: null, email: null, role: null, isLoading: false, isAdmin: false });
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const profile = data as { role: UserRole } | null;
      const role = profile?.role ?? null;
      setState({
        userId: user.id,
        email: user.email ?? null,
        role,
        isLoading: false,
        isAdmin: role ? ADMIN_ROLES.includes(role) : false,
      });
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return {
    ...state,
    signOut: async () => {
      await createClient().auth.signOut();
    },
  };
}
