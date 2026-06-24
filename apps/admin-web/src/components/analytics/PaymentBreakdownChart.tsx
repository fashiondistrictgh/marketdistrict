"use client";

import { ResponsiveContainer } from "recharts";

/**
 * PaymentBreakdownChart — Recharts placeholder.
 * Drop in a LineChart / BarChart / PieChart with real data when ready.
 */
export function PaymentBreakdownChart() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm font-medium">PaymentBreakdownChart</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chart placeholder
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
