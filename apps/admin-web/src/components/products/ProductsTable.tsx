"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/shared";

import { ADMIN_ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/formatters";
import { productImageUrl } from "@/lib/product-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "./ProductStatusBadge";

interface ProductsTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

const UNIT_LABEL: Record<string, string> = {
  piece: "pc",
  kg: "kg",
  g: "g",
  l: "L",
  pack: "pack",
  bundle: "bundle",
};

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImageUrl(p.imageUrls, p.name, 80)}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per {UNIT_LABEL[p.unit] ?? p.unit}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{formatCurrency(p.price)}</div>
                {p.compareAtPrice ? (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatCurrency(p.compareAtPrice)}
                  </div>
                ) : null}
              </TableCell>
              <TableCell>{p.stockQuantity}</TableCell>
              <TableCell>
                <ProductStatusBadge status={p.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={ADMIN_ROUTES.productEdit(p.id)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(p)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
