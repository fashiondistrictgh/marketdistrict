"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";

interface RevenueChartProps {
  data: { label: string; value: number }[];
}

const config = {
  value: { label: "Revenue", color: "hsl(120 100% 20%)" },
} satisfies ChartConfig;

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue (last 7 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => `₵${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => formatCurrency(Number(v))}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              fill="url(#revFill)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
