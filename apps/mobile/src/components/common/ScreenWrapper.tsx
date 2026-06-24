import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  /** Disable horizontal padding (e.g. for full-bleed lists). */
  flush?: boolean;
}

export function ScreenWrapper({ children, flush = false }: ScreenWrapperProps) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className={`flex-1 ${flush ? "" : "px-4"}`}>{children}</View>
    </SafeAreaView>
  );
}
