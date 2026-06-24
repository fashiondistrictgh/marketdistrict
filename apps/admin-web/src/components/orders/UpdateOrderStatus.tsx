"use client";

import { toast } from "sonner";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from "@/shared";

import { useUpdateOrderStatus } from "@/hooks/useOrders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, "cancelled"];

interface UpdateOrderStatusProps {
  orderId: string;
  status: OrderStatus;
  /** Sample orders can't be persisted. */
  disabled?: boolean;
}

export function UpdateOrderStatus({ orderId, status, disabled }: UpdateOrderStatusProps) {
  const update = useUpdateOrderStatus();

  async function onChange(next: string) {
    if (disabled) {
      toast.error("This is a sample order — it can't be updated.");
      return;
    }
    try {
      await update.mutateAsync({ id: orderId, status: next as OrderStatus });
      toast.success(`Status set to “${ORDER_STATUS_LABELS[next as OrderStatus]}”`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  }

  return (
    <Select value={status} onValueChange={onChange} disabled={update.isPending}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
