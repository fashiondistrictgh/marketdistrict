import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { MetricCardData } from "@/types/admin";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, delta, hint }: MetricCardData) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {delta !== undefined ? (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            positive ? "text-primary" : "text-destructive",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(delta)}%{hint ? <span className="text-muted-foreground"> {hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
