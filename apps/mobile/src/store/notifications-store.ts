import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationsState {
  /** IDs of activity items the user has already seen. */
  seenIds: string[];
  /** The last time the user opened the notifications screen. */
  lastOpenedAt: number;
  markAllSeen: (ids: string[]) => void;
  isSeen: (id: string) => boolean;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      seenIds: [],
      lastOpenedAt: 0,
      markAllSeen: (ids) =>
        set((state) => ({
          seenIds: Array.from(new Set([...state.seenIds, ...ids])),
          lastOpenedAt: Date.now(),
        })),
      isSeen: (id) => get().seenIds.includes(id),
    }),
    {
      name: "md.notifications",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
