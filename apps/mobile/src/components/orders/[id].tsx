import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ScreenWrapper } from "@/components/common/ScreenWrapper";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-900">Order detail</Text>
        <Text className="mt-1 text-sm text-gray-500">id: {id}</Text>
      </View>
    </ScreenWrapper>
  );
}
