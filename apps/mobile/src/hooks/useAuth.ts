import { useEffect } from "react";
import type { UserProfile } from "@/shared";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

/**
 * Subscribes to Supabase auth changes and keeps the auth store in sync.
 * Mount once near the root (see app/_layout.tsx).
 */
export function useAuth() {
  const { user, isLoading, setUser, setLoading, reset } = useAuthStore();

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) {
        setUser(mapUser(data.user));
      } else {
        reset();
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(mapUser(session.user));
      else reset();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [setUser, reset]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signUp: (email: string, password: string, fullName?: string) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: fullName ? { full_name: fullName } : undefined },
      }),
    resetPassword: (email: string) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "marketdistrict://reset-password",
      }),
    signOut: async () => {
      await supabase.auth.signOut();
      reset();
    },
    setLoading,
  };
}

function mapUser(user: { id: string; email?: string }): UserProfile {
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: null,
    phone: null,
    avatarUrl: null,
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
