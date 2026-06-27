import { useEffect } from "react";
import type { ProfileRow, UserProfile } from "@/shared";

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

    async function loadFromAuthUser(authUser: { id: string; email?: string }) {
      // Pull the profile (name + phone) so the UI shows the real identity.
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, role, created_at")
        .eq("id", authUser.id)
        .maybeSingle();
      if (!active) return;
      setUser(mapUser(authUser, profile as ProfileRow | null));
    }

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) await loadFromAuthUser(data.user);
      else reset();
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadFromAuthUser(session.user);
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
    signUp: async (email: string, password: string, fullName: string, phone: string) => {
      // Phone + name go in auth metadata so the handle_new_user DB trigger writes
      // them to the profile reliably (no RLS timing issues).
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      // Belt-and-suspenders: also update directly once the session exists.
      const newUser = res.data.user;
      if (newUser && !res.error) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName, phone } as never)
          .eq("id", newUser.id);
      }
      return res;
    },
    // Phone OTP login (edge functions handle SMS + session minting).
    sendOtp: (phone: string) =>
      supabase.functions.invoke("send-otp", { body: { phone } }),
    verifyOtp: async (phone: string, code: string) => {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { phone, code },
      });
      if (error || !data?.access_token) {
        throw new Error(data?.error ?? "Could not verify code.");
      }
      const { error: sessionErr } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessionErr) throw sessionErr;
    },
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

function mapUser(
  user: { id: string; email?: string },
  profile: ProfileRow | null,
): UserProfile {
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
    avatarUrl: null,
    role: profile?.role ?? "customer",
    createdAt: profile?.created_at ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
