import { Pressable, Text, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

import { colors } from "@/constants/colors";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export function ProfileMenuItem({ icon: Icon, label, onPress, danger }: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 border-b border-gray-100 px-4 py-3.5 active:bg-gray-50"
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          danger ? "bg-red-50" : "bg-primary/10"
        }`}
      >
        <Icon size={18} color={danger ? "#dc2626" : colors.primary} />
      </View>
      <Text className={`flex-1 text-[15px] font-medium ${danger ? "text-red-600" : "text-gray-900"}`}>
        {label}
      </Text>
      {!danger ? <ChevronRight size={18} color="#d1d5db" /> : null}
    </Pressable>
  );
}
