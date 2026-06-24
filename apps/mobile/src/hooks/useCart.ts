import { useCartStore } from "@/store/cart-store";

/** Convenience hook exposing cart state and actions. */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);

  const subtotal = useCartStore((s) => s.subtotal());
  const count = useCartStore((s) => s.count());

  return { items, addItem, removeItem, setQuantity, clear, subtotal, count };
}
