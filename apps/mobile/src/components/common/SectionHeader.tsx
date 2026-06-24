import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text className="text-sm font-medium text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
