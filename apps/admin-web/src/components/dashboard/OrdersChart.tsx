"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface OrdersChartProps {
  data: { label: string; value: number }[];
}

const config = {
  value: { label: "Orders", color: "hsl(120 100% 20%)" },
} satisfies ChartConfig;

export function OrdersChart({ data }: OrdersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders (last 7 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
