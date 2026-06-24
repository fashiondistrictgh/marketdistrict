"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useCustomers } from "@/hooks/useCustomers";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersPage() {
  const { data, isLoading } = useCustomers();
  const [search, setSearch] = useState("");

  const customers = data?.customers ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
    );
  }, [customers, search]);

  return (
    <div>
      <PageHeader title="Customers" description="View and manage customers." />

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-md border bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="border-0 px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2 rounded-xl border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="ml-auto h-4 w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">No customers found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Try a different search." : "Customers appear here when they sign up."}
          </p>
        </div>
      ) : (
        <CustomersTable customers={filtered} />
      )}
    </div>
  );
}
