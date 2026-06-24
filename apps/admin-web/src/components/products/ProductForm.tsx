"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABELS,
  PRODUCT_UNIT,
  discountPercent,
  productSchema,
  validate,
  type Product,
  type ProductInput,
} from "@/shared";

import { ADMIN_ROUTES } from "@/constants/routes";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrency } from "@/lib/formatters";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  product?: Product | null;
}

const UNIT_OPTIONS = Object.values(PRODUCT_UNIT);
const STATUS_OPTIONS = Object.values(PRODUCT_STATUS);
const NO_CATEGORY = "__none__";

type FormState = {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  unit: ProductInput["unit"];
  categoryId: string | null;
  status: ProductInput["status"];
  isFeatured: boolean;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold">{title}</h3>
      {description ? (
        <p className="mb-4 mt-0.5 text-sm text-muted-foreground">{description}</p>
      ) : (
        <div className="mb-4" />
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const isEdit = !!product;

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    imageUrl: product?.imageUrls?.[0] ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? null,
    stockQuantity: product?.stockQuantity ?? 0,
    unit: product?.unit ?? PRODUCT_UNIT.PIECE,
    categoryId: product?.categoryId ?? null,
    status: product?.status ?? PRODUCT_STATUS.DRAFT,
    isFeatured: product?.isFeatured ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const discount = discountPercent(form.price, form.compareAtPrice);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: ProductInput = {
      name: form.name,
      slug: "",
      description: form.description || null,
      categoryId: form.categoryId,
      price: form.price,
      compareAtPrice: form.compareAtPrice,
      unit: form.unit,
      stockQuantity: form.stockQuantity,
      imageUrls: form.imageUrl ? [form.imageUrl] : [],
      status: form.status,
      isFeatured: form.isFeatured,
    };

    const result = validate(productSchema, payload);
    if (!result.success) {
      setErrors(result.errors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    try {
      if (isEdit) {
        await update.mutateAsync({ id: product!.id, input: payload });
        toast.success("Product updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Product created");
      }
      router.push(ADMIN_ROUTES.products);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  const saving = create.isPending || update.isPending;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        <Section title="General" description="Basic product information shown to customers.">
          <div className="space-y-1.5">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Fresh Bananas"
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product, origin, size, etc."
              rows={4}
            />
          </div>
        </Section>

        <Section title="Pricing">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₵)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
              />
              {errors.price ? <p className="text-xs text-destructive">{errors.price}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compareAtPrice">Compare-at price (₵)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                min={0}
                step="0.01"
                value={form.compareAtPrice ?? ""}
                onChange={(e) =>
                  set("compareAtPrice", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Optional"
              />
              {discount > 0 ? (
                <p className="text-xs text-green-600">{discount}% off shown to customers</p>
              ) : (
                <p className="text-xs text-muted-foreground">Original price (shows a discount)</p>
              )}
            </div>
          </div>
        </Section>

        <Section title="Inventory">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock quantity</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stockQuantity || ""}
                onChange={(e) => set("stockQuantity", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select value={form.unit} onValueChange={(v) => set("unit", v as FormState["unit"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Media" description="Upload a product photo, or leave blank to use an auto-generated image.">
          <ProductImageUpload
            value={form.imageUrl}
            onChange={(url) => set("imageUrl", url)}
            productName={form.name}
          />
        </Section>
      </div>

      {/* Side column */}
      <div className="space-y-6">
        <Section title="Organization">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.categoryId ?? NO_CATEGORY}
              onValueChange={(v) => set("categoryId", v === NO_CATEGORY ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>Uncategorized</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as FormState["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PRODUCT_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Section>

        <div className="rounded-xl border bg-card p-5">
          <p className="mb-1 text-sm text-muted-foreground">Customer sees</p>
          <p className="text-2xl font-bold">{formatCurrency(form.price || 0)}</p>
          {form.compareAtPrice && form.compareAtPrice > form.price ? (
            <p className="text-sm text-muted-foreground line-through">
              {formatCurrency(form.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push(ADMIN_ROUTES.products)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
