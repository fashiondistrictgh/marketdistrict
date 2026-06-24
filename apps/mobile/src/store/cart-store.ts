import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CartLine } from "@/shared";
import { calcSubtotal } from "@/shared";

interface CartState {
  items: CartLine[];
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (line, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === line.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i,
                ),
        })),

      clear: () => set({ items: [] }),

      subtotal: () => calcSubtotal(get().items),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "md.cart",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
