import { Image, Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8 items-center">
      <View className="mb-5 h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 80, height: 80 }}
          resizeMode="cover"
        />
      </View>
      <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-center text-base text-gray-500">{subtitle}</Text>
      ) : null}
    </View>
  );
}
