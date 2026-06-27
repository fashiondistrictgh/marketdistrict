import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Simple white top header with a back button, for non-tab routes. */
export function StackHeader({ title }: { title: string }) {
  return (
    <SafeAreaView edges={["top"]} className="bg-white">
      <View className="flex-row items-center gap-3 border-b border-gray-100 px-4 pb-3 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
