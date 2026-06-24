"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { createClient } from "@/lib/supabase/client";
import { adminLoginSchema, validate } from "@/lib/validators";

function InactivityNotice() {
  const params = useSearchParams();
  if (params.get("reason") !== "inactivity") return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
      <Clock className="mt-0.5 h-4 w-4 shrink-0" />
      <span>You were signed out after 15 minutes of inactivity. Please sign in again.</span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = validate(adminLoginSchema, { email, password });
    if (!result.success) {
      setError(Object.values(result.errors)[0] ?? "Invalid credentials");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }
    router.replace(ADMIN_ROUTES.dashboard);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Market District" className="h-16 w-16 object-contain" />
          <div>
            <h1 className="text-xl font-semibold">Admin sign in</h1>
            <p className="text-sm text-muted-foreground">Market District dashboard</p>
          </div>
        </div>

        <Suspense fallback={null}>
          <InactivityNotice />
        </Suspense>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="admin@marketdistrict.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
