"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/shared";

import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(c: Category) {
    setEditing(c);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteCategory.mutateAsync(toDelete.id);
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
        title="Categories"
        description="Organize products into categories."
        actions={
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> New category
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first category to organize products.
          </p>
          <Button className="mt-4" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> New category
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      <CategoryForm open={formOpen} onOpenChange={setFormOpen} category={editing} />

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              “{toDelete?.name}” will be removed. Products in it become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
