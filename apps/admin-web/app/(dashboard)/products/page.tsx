"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/shared";

import { ADMIN_ROUTES } from "@/constants/routes";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductsTable } from "@/components/products/ProductsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductsPage() {
  const { data, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const products = data?.products ?? [];
  const isSample = data?.isSample ?? false;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  async function confirmDelete() {
    if (!toDelete) return;
    if (isSample) {
      toast.error("This is sample data — add a real product first.");
      setToDelete(null);
      return;
    }
    try {
      await deleteProduct.mutateAsync(toDelete.id);
      toast.success(`Deleted "${toDelete.name}"`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setToDelete(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        actions={
          <Button asChild>
            <Link href={ADMIN_ROUTES.productNew}>
              <Plus className="mr-2 h-4 w-4" /> New product
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-md border bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="border-0 px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Try a different search." : "Create your first product to get started."}
          </p>
        </div>
      ) : (
        <ProductsTable products={filtered} onDelete={setToDelete} />
      )}

      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This will permanently remove “{toDelete?.name}”. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="ml-auto h-4 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
