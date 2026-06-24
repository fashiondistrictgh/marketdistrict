"use client";

import { use } from "react";

import { useProduct } from "@/hooks/useProducts";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useProduct(id);

  return (
    <div>
      <PageHeader
        title="Edit product"
        description={product ? product.name : "Update product details."}
      />
      {isLoading ? (
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : !product ? (
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Product not found.
        </div>
      ) : (
        <ProductForm product={product} />
      )}
    </div>
  );
}
