import { CircleDollarSign, Clock, XCircle } from "lucide-react";

import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentStatsProps {
  totalCollected: number;
  pending: number;
  failed: number;
}

export function PaymentStats({ totalCollected, pending, failed }: PaymentStatsProps) {
  const items = [
    {
      icon: CircleDollarSign,
      label: "Collected",
      value: formatCurrency(totalCollected),
      tone: "text-green-600",
    },
    { icon: Clock, label: "Pending", value: formatCurrency(pending), tone: "text-amber-600" },
    { icon: XCircle, label: "Failed", value: String(failed), tone: "text-red-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label}>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className={`rounded-lg bg-muted p-2 ${it.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{it.label}</p>
                <p className="text-xl font-bold">{it.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
