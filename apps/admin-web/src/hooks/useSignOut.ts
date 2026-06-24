"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ADMIN_ROUTES } from "@/constants/routes";
import { createClient } from "@/lib/supabase/client";

/** Signs the admin out of Supabase and redirects to the login page. */
export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace(ADMIN_ROUTES.login);
    router.refresh();
  }

  return { signOut, isSigningOut };
}
