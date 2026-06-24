"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "@/shared";

import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, edits this category; otherwise creates a new one. */
  category?: Category | null;
}

export function CategoryForm({ open, onOpenChange, category }: CategoryFormProps) {
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const isEdit = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");
  const [error, setError] = useState<string | null>(null);

  // Reset fields whenever the dialog opens for a different category.
  const [lastId, setLastId] = useState<string | undefined>(category?.id);
  if (open && category?.id !== lastId) {
    setLastId(category?.id);
    setName(category?.name ?? "");
    setIcon(category?.icon ?? "");
    setError(null);
  }

  const saving = create.isPending || update.isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setError(null);
    try {
      if (isEdit) {
        await update.mutateAsync({ id: category!.id, input: { name, icon } });
        toast.success("Category updated");
      } else {
        await create.mutateAsync({ name, icon });
        toast.success("Category created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>
              Categories group products in the catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fruits & Vegetables"
                autoFocus
              />
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-icon">Icon name (optional)</Label>
              <Input
                id="cat-icon"
                value={icon ?? ""}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. Apple, Fish, Egg (Lucide icon name)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
