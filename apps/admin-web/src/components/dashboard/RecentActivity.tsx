import { Boxes, Tags, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  productCount: number;
  customerCount: number;
  categoryCount?: number;
}

export function RecentActivity({
  productCount,
  customerCount,
  categoryCount = 12,
}: RecentActivityProps) {
  const items = [
    { icon: Boxes, label: "Products in catalog", value: productCount },
    { icon: Tags, label: "Categories", value: categoryCount },
    { icon: Users, label: "Registered customers", value: customerCount },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>At a glance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{it.label}</p>
              </div>
              <p className="text-lg font-semibold">{it.value}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
