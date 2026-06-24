import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-center text-lg font-semibold text-gray-900">{title}</Text>
      {message ? (
        <Text className="mt-2 text-center text-sm text-gray-500">{message}</Text>
      ) : null}
      {action ? <View className="mt-6 w-full">{action}</View> : null}
    </View>
  );
}
