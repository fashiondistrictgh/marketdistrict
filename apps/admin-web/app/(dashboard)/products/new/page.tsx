import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="New product" description="Create a new product." />
      <ProductForm />
    </div>
  );
}
