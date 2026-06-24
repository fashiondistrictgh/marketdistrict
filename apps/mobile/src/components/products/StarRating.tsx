import { View } from "react-native";
import { Star } from "lucide-react-native";

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            color="#f59e0b"
            fill={filled ? "#f59e0b" : "transparent"}
            strokeWidth={2}
          />
        );
      })}
    </View>
  );
}
