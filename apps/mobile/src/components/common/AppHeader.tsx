import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function AppHeader({ title, showBack = false, right }: AppHeaderProps) {
  return (
    <View className="h-12 flex-row items-center justify-between">
      <View className="w-16">
        {showBack ? (
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text className="text-base text-primary">Back</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="flex-1 text-center text-lg font-semibold text-gray-900">
        {title}
      </Text>
      <View className="w-16 items-end">{right}</View>
    </View>
  );
}
