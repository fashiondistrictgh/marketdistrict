import { useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Renders a show/hide toggle and starts masked. */
  password?: boolean;
}

export function AppInput({ label, error, password, ...props }: AppInputProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <View className="mb-4 w-full">
      {label ? (
        <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>
      ) : null}
      <View className="relative">
        <TextInput
          placeholderTextColor="#9ca3af"
          secureTextEntry={password ? hidden : props.secureTextEntry}
          className={`h-12 rounded-xl border bg-white px-4 text-base text-gray-900 ${
            password ? "pr-12" : ""
          } ${error ? "border-red-500" : "border-gray-200"}`}
          {...props}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            className="absolute right-3 top-0 h-12 justify-center"
          >
            {hidden ? (
              <Eye size={20} color="#9ca3af" />
            ) : (
              <EyeOff size={20} color="#9ca3af" />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
