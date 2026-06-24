"use client";

import * as Icons from "lucide-react";
import { MoreVertical, Pencil, Tag, Trash2 } from "lucide-react";
import type { Category } from "@/shared";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

/** Looks up a Lucide icon by name, falling back to a tag icon. */
function CategoryIcon({ name }: { name?: string | null }) {
  const Icon =
    (name && (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) ||
    Tag;
  return <Icon className="h-5 w-5" />;
}

export function CategoryCard({ category, productCount, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CategoryIcon name={category.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{category.name}</p>
        <p className="text-xs text-muted-foreground">
          {productCount === undefined ? category.slug : `${productCount} products`}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(category)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
