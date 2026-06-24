import { create } from "zustand";

interface AppState {
  hasOnboarded: boolean;
  selectedAddressId: string | null;
  setOnboarded: (value: boolean) => void;
  setSelectedAddress: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasOnboarded: false,
  selectedAddressId: null,
  setOnboarded: (value) => set({ hasOnboarded: value }),
  setSelectedAddress: (id) => set({ selectedAddressId: id }),
}));
