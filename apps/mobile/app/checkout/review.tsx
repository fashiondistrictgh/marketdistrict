import { Text, View } from "react-native";

import { ScreenWrapper } from "@/components/common/ScreenWrapper";

export default function Screen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-900">Review order</Text>
        <Text className="mt-1 text-sm text-gray-500">Screen placeholder</Text>
      </View>
    </ScreenWrapper>
  );
}
